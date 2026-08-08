'use client'

import Link from 'next/link'
import type { Product } from '@/lib/supabase'
import { won, hms, discountRate, FREE_SHIPPING_OVER } from '@/lib/order'
import { useSale } from '@/lib/useSale'

/** 상품 상세의 가격 + 주문 버튼. 특가 여부는 브라우저의 타로 기록으로 판단한다. */
export default function BuyBlock({ product: p, cardId }: { product: Product; cardId?: number }) {
  const { active, msLeft } = useSale(cardId)
  const soldOut = p.stock <= 0
  const price = active ? p.sale_price : p.price

  return (
    <div className="space-y-3">
      <div>
        {active && (
          <p className="mb-1 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-gold px-2 py-0.5 font-bold text-ink">
              타로특가 {discountRate(p.price, p.sale_price)}%
            </span>
            <span className="font-mono tabular-nums text-gold">{hms(msLeft)} 남음</span>
          </p>
        )}
        <p className="flex items-baseline gap-2">
          {active && <span className="text-sm text-muted line-through">{won(p.price)}</span>}
          <span className="text-2xl font-bold text-cream">{won(price)}</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          {won(FREE_SHIPPING_OVER)} 이상 무료배송 · 입금 확인 후 2~3일 내 발송
        </p>
      </div>

      {soldOut ? (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm text-muted">
          품절되었습니다
        </p>
      ) : (
        <Link
          href={`/order/${p.slug}${cardId !== undefined ? `?card=${cardId}` : ''}`}
          className="block rounded-xl bg-gold px-4 py-3 text-center font-bold text-ink hover:bg-gold-soft"
        >
          주문하기 (무통장입금)
        </Link>
      )}

      {!active && cardId === undefined && (
        <Link href="/tarot" className="block text-center text-xs text-gold underline">
          타로를 뽑으면 24시간 특가로 살 수 있어요 →
        </Link>
      )}
    </div>
  )
}
