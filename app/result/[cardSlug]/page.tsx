import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CARDS, cardBySlug } from '@/data/cards'
import { getProducts, recommend } from '@/lib/supabase'
import { stoneName } from '@/lib/stones'
import CardFace from '@/components/CardFace'
import SaleBlock from '@/components/SaleBlock'
import ShareButton from '@/components/ShareButton'

type Props = { params: Promise<{ cardSlug: string }> }

// 22장 전부 정적 생성 — 공유 링크로 들어와도 같은 결과가 보인다.
export function generateStaticParams() {
  return CARDS.map((c) => ({ cardSlug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = cardBySlug((await params).cardSlug)
  if (!card) return {}
  const title = `${card.nameKo} — 오늘의 타로`
  const description = `${card.message.split('.')[0]}. ${stoneName(card.stone)}를 추천합니다.`
  return { title, description, openGraph: { title, description } }
}

export default async function ResultPage({ params }: Props) {
  const card = cardBySlug((await params).cardSlug)
  if (!card) notFound()

  const products = recommend(await getProducts(), card.stone)

  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center gap-4 pt-2 text-center">
        <div className="w-36 float-in">
          <CardFace card={card} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-cream">{card.nameKo}</h1>
          <p className="mt-1 text-xs tracking-widest text-muted">{card.nameEn}</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-2">
          {card.keywords.map((k) => (
            <li
              key={k}
              className="rounded-full border border-gold/40 px-3 py-1 text-xs text-gold-soft"
            >
              {k}
            </li>
          ))}
        </ul>
        <p className="card-surface rounded-xl px-4 py-4 text-left text-sm leading-relaxed text-cream/90">
          {card.message}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-cream">
          이 카드의 기운을 담은 원석,{' '}
          <span className="text-gold-soft">{stoneName(card.stone)}</span>
        </h2>
        <p className="text-sm leading-relaxed text-muted">{card.stoneNote}</p>
        <SaleBlock cardId={card.id} products={products} />
      </section>

      <section className="flex flex-col gap-3">
        <ShareButton title={`오늘의 타로: ${card.nameKo}`} />
        <Link
          href="/tarot"
          className="rounded-xl border border-line px-4 py-3 text-center text-sm text-muted"
        >
          다시 뽑기
        </Link>
      </section>
    </div>
  )
}
