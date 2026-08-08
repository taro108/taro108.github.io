'use client'

import type { Product } from '@/lib/supabase'
import { hms } from '@/lib/order'
import { useSale } from '@/lib/useSale'
import ProductCard from './ProductCard'

/** 결과 페이지의 추천 상품 + 24시간 특가 카운트다운. 여기서 특가 타이머가 시작된다. */
export default function SaleBlock({
  cardId,
  products,
}: {
  cardId: number
  products: Product[]
}) {
  const { active, msLeft } = useSale(cardId, true)

  if (products.length === 0) {
    return (
      <p className="card-surface rounded-xl p-4 text-sm text-muted">
        지금은 준비된 상품이 없습니다. 곧 다시 찾아올게요.
      </p>
    )
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-3 py-2">
        <span className="text-sm font-semibold text-gold-soft">타로 특가</span>
        <span className="font-mono text-sm tabular-nums text-gold">
          {active ? hms(msLeft) : '종료'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} saleActive={active} cardId={cardId} />
        ))}
      </div>

      <p className="text-xs text-muted">
        {active
          ? '카드를 뽑은 시점부터 24시간 동안 특가로 구매할 수 있어요.'
          : '특가 시간이 지났습니다. 카드를 다시 뽑으면 새 특가가 열려요.'}
      </p>
    </section>
  )
}
