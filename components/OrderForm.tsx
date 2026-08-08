'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Product } from '@/lib/supabase'
import {
  orderTotal,
  makeOrderNo,
  validateOrder,
  normalizePhone,
  won,
  DEPOSIT_DEADLINE_HOURS,
} from '@/lib/order'
import { useSale } from '@/lib/useSale'

export type OrderReceipt = {
  orderNo: string
  productName: string
  qty: number
  unitPrice: number
  shipping: number
  total: number
  buyerName: string
  createdAt: number
}

export const receiptKey = (orderNo: string) => `taro_order_${orderNo}`

export default function OrderForm({ product: p, cardId }: { product: Product; cardId?: number }) {
  const router = useRouter()
  const { active } = useSale(cardId)
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false) // 봇 대비 3초 지연 (TRD §6)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const unitPrice = active ? p.sale_price : p.price
  const max = Math.min(10, Math.max(p.stock, 1))
  const { subtotal, shipping, total } = orderTotal(unitPrice, qty)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) return // honeypot

    const form = {
      buyerName: String(fd.get('buyerName') ?? '').trim(),
      phone: String(fd.get('phone') ?? ''),
      address: String(fd.get('address') ?? '').trim(),
      qty,
    }
    const invalid = validateOrder(form)
    if (invalid) return setErr(invalid)

    setErr(null)
    setBusy(true)

    const row = {
      product_id: p.id,
      product_name: p.name,
      qty,
      unit_price: unitPrice,
      shipping_fee: shipping,
      total,
      buyer_name: form.buyerName,
      phone: normalizePhone(form.phone),
      address: form.address,
      memo: String(fd.get('memo') ?? '').trim() || null,
      tarot_card_id: cardId ?? null,
    }

    const placedAt = new Date()
    let orderNo = ''
    let error = null
    for (let attempt = 0; attempt < 2; attempt++) {
      orderNo = makeOrderNo(placedAt, () => Math.random())
      const res = await supabase.from('orders').insert({ ...row, order_no: orderNo })
      error = res.error
      if (!error || error.code !== '23505') break // 주문번호 충돌만 재시도
    }

    if (error) {
      setBusy(false)
      setErr('주문 저장에 실패했어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    // orders 는 조회 정책이 없으므로(TRD §6) 완료 화면은 제출한 값으로 그린다.
    const receipt: OrderReceipt = {
      orderNo,
      productName: p.name,
      qty,
      unitPrice,
      shipping,
      total,
      buyerName: form.buyerName,
      createdAt: placedAt.getTime(),
    }
    try {
      sessionStorage.setItem(receiptKey(orderNo), JSON.stringify(receipt))
    } catch {}
    router.push(`/order/complete/${orderNo}`)
  }

  const field = 'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-cream placeholder:text-muted/60 focus:border-gold focus:outline-none'

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="card-surface space-y-2 rounded-xl p-4 text-sm">
        <p className="font-medium text-cream">{p.name}</p>
        <label className="flex items-center justify-between">
          <span className="text-muted">수량</span>
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-cream"
          >
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </label>
        <dl className="space-y-1 border-t border-line pt-2 text-muted">
          <div className="flex justify-between">
            <dt>상품금액{active && <span className="ml-1 text-gold">(타로특가)</span>}</dt>
            <dd>{won(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>배송비</dt>
            <dd>{shipping === 0 ? '무료' : won(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-1 text-base font-bold text-cream">
            <dt>총 결제금액</dt>
            <dd className="text-gold">{won(total)}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3">
        <input name="buyerName" required maxLength={30} placeholder="주문자 이름" className={field} />
        <input
          name="phone"
          required
          type="tel"
          inputMode="numeric"
          placeholder="연락처 (- 없이 숫자만)"
          className={field}
        />
        <textarea
          name="address"
          required
          rows={2}
          maxLength={200}
          placeholder="배송지 주소 (도로명 주소 + 상세주소)"
          className={field}
        />
        <textarea
          name="memo"
          rows={2}
          maxLength={300}
          placeholder="요청사항 (선택) · 입금자명이 다르면 여기에 적어 주세요"
          className={field}
        />
        {/* honeypot */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5 accent-[#d9b26a]" />
        <span>
          주문 처리와 배송을 위해 이름·연락처·주소를 수집하며, 배송 완료 후 관련 법령에 따라
          보관합니다. 동의합니다. (필수)
        </span>
      </label>

      {err && (
        <p role="alert" className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !ready}
        className="w-full rounded-xl bg-gold px-4 py-3.5 font-bold text-ink disabled:opacity-50"
      >
        {busy ? '주문 접수 중…' : ready ? '무통장입금으로 주문하기' : '잠시만요…'}
      </button>

      <p className="text-center text-xs text-muted">
        주문 후 {DEPOSIT_DEADLINE_HOURS}시간 안에 입금해 주세요. 미입금 시 자동 취소됩니다.
      </p>
    </form>
  )
}
