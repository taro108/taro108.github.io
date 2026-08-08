import Link from 'next/link'
import type { Product } from '@/lib/supabase'
import { stoneGradient, stoneName } from '@/lib/stones'
import { won, discountRate } from '@/lib/order'

export const CATEGORY_LABEL = {
  bracelet108: '108염주 팔찌',
  hapjangju: '합장주',
} as const

export default function ProductCard({
  product: p,
  saleActive = false,
  cardId,
}: {
  product: Product
  saleActive?: boolean
  cardId?: number
}) {
  const href = `/products/${p.slug}${cardId !== undefined ? `?card=${cardId}` : ''}`
  const soldOut = p.stock <= 0

  return (
    <Link href={href} className="group block">
      <div className="card-surface relative aspect-square overflow-hidden rounded-xl">
        {p.images[0] ? (
          // ponytail: next/image 대신 <img> — Vercel 무료 티어 이미지 최적화 쿼터를 쓰지 않는다
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ background: stoneGradient(p.stone) }} />
        )}
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-ink/70 text-sm text-muted">
            품절
          </span>
        )}
        {!soldOut && saleActive && (
          <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-ink">
            타로특가 {discountRate(p.price, p.sale_price)}%
          </span>
        )}
      </div>

      <div className="mt-2 space-y-0.5">
        <p className="text-[11px] text-muted">
          {CATEGORY_LABEL[p.category]} · {stoneName(p.stone)}
        </p>
        <p className="text-sm font-medium text-cream group-hover:text-gold-soft">{p.name}</p>
        {saleActive && !soldOut ? (
          <p className="text-sm">
            <span className="mr-1 text-xs text-muted line-through">{won(p.price)}</span>
            <span className="font-bold text-gold">{won(p.sale_price)}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-cream/90">{won(p.price)}</p>
        )}
      </div>
    </Link>
  )
}
