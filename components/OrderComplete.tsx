'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { BANK, BUSINESS } from '@/lib/constants'
import { won, DEPOSIT_DEADLINE_HOURS } from '@/lib/order'
import { receiptKey, type OrderReceipt } from './OrderForm'

const noSubscribe = () => () => {}

/** 주문 내역은 orders 조회 정책이 없어(TRD §6) 제출 시 저장한 sessionStorage 에서 읽는다. */
function useReceipt(orderNo: string): OrderReceipt | null {
  const raw = useSyncExternalStore(
    noSubscribe,
    () => {
      try {
        return sessionStorage.getItem(receiptKey(orderNo))
      } catch {
        return null
      }
    },
    () => null, // 서버 렌더에는 없음
  )
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as OrderReceipt) : null
    } catch {
      return null
    }
  }, [raw])
}

export default function OrderComplete({ orderNo }: { orderNo: string }) {
  const receipt = useReceipt(orderNo)

  const deadline = receipt
    ? new Date(receipt.createdAt + DEPOSIT_DEADLINE_HOURS * 3600_000)
    : null

  return (
    <div className="space-y-6">
      <header className="space-y-2 pt-4 text-center">
        <p className="text-3xl">✦</p>
        <h1 className="text-xl font-bold text-cream">주문이 접수되었습니다</h1>
        <p className="text-sm text-muted">
          주문번호 <span className="font-mono text-gold">{orderNo}</span>
        </p>
      </header>

      {receipt && (
        <dl className="card-surface space-y-1.5 rounded-xl p-4 text-sm text-muted">
          <div className="flex justify-between">
            <dt>상품</dt>
            <dd className="text-right text-cream">
              {receipt.productName} × {receipt.qty}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>배송비</dt>
            <dd>{receipt.shipping === 0 ? '무료' : won(receipt.shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>주문자</dt>
            <dd className="text-cream">{receipt.buyerName}</dd>
          </div>
        </dl>
      )}

      <section className="space-y-3 rounded-xl border border-gold/40 bg-gold/5 p-4">
        <h2 className="font-bold text-gold-soft">입금 안내</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">입금 은행</dt>
            <dd className="text-cream">{BANK.bank}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">계좌번호</dt>
            <dd className="font-mono text-cream">{BANK.account}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">예금주</dt>
            <dd className="text-cream">{BANK.holder}</dd>
          </div>
          {receipt && (
            <div className="flex justify-between border-t border-gold/20 pt-1.5 text-base font-bold">
              <dt className="text-cream">입금 금액</dt>
              <dd className="text-gold">{won(receipt.total)}</dd>
            </div>
          )}
        </dl>
        <p className="text-xs leading-relaxed text-muted">
          {deadline
            ? `${deadline.toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit' })}까지 입금해 주세요.`
            : `주문 후 ${DEPOSIT_DEADLINE_HOURS}시간 안에 입금해 주세요.`}{' '}
          기한이 지나면 주문은 자동 취소됩니다. 입금자명이 주문자명과 다르면 카카오톡 채널로 알려
          주세요.
        </p>
      </section>

      {!receipt && (
        <p className="text-center text-xs text-muted">
          주문 내역은 이 브라우저에만 저장돼요. 금액이 보이지 않으면 주문번호로 문의해 주세요.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <a
          href={BUSINESS.kakao}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-gold px-4 py-3 text-center font-bold text-ink"
        >
          카카오톡으로 문의하기
        </a>
        <Link
          href="/tarot"
          className="rounded-xl border border-line px-4 py-3 text-center text-sm text-muted"
        >
          타로 다시 뽑기
        </Link>
      </div>
    </div>
  )
}
