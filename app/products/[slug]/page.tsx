import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/supabase'
import { stoneGradient, stoneName } from '@/lib/stones'
import { parseCardId, cardById } from '@/data/cards'
import { CATEGORY_LABEL } from '@/components/ProductCard'
import BuyBlock from '@/components/BuyBlock'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ card?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return { title: '상품을 찾을 수 없습니다' }
  return { title: p.name, description: p.description || `${stoneName(p.stone)} 염주` }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const p = await getProduct(slug)
  if (!p) notFound()

  const cardId = parseCardId(sp.card)
  const card = cardId !== undefined ? cardById(cardId) : undefined

  return (
    <div className="space-y-6">
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4">
        {p.images.length > 0 ? (
          p.images.map((src) => (
            // ponytail: next/image 미사용 — Vercel 무료 티어 최적화 쿼터 절약
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={p.name}
              className="aspect-square w-[85%] shrink-0 snap-center rounded-xl object-cover"
            />
          ))
        ) : (
          <div
            className="aspect-square w-full rounded-xl"
            style={{ background: stoneGradient(p.stone) }}
          />
        )}
      </div>

      <header className="space-y-1">
        <p className="text-xs text-muted">
          {CATEGORY_LABEL[p.category]} · {stoneName(p.stone)}
        </p>
        <h1 className="text-xl font-bold text-cream">{p.name}</h1>
      </header>

      {card && (
        <p className="rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold-soft">
          &lsquo;{card.nameKo}&rsquo; 카드가 추천한 원석입니다 · {card.stoneNote}
        </p>
      )}

      <BuyBlock product={p} cardId={cardId} />

      {p.description && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-cream/85">{p.description}</p>
      )}

      <dl className="card-surface space-y-2 rounded-xl p-4 text-xs text-muted">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-cream/80">소재</dt>
          <dd>{stoneName(p.stone)} · 손목 둘레에 맞춰 제작</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-cream/80">배송</dt>
          <dd>입금 확인 후 2~3일 내 발송 (주말·공휴일 제외)</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-cream/80">교환·환불</dt>
          <dd>수령 후 7일 이내. 자세한 내용은 배송·교환·환불 안내를 확인해 주세요.</dd>
        </div>
      </dl>
    </div>
  )
}
