import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CARDS, cardById, cardBySlug, type Card } from '@/data/cards'
import { getProducts, recommend } from '@/lib/supabase'
import { stoneName } from '@/lib/stones'
import { SPREAD_POSITIONS, SPREAD_SIZE, SPREAD_PARAM, parseSpread } from '@/lib/spread'
import CardFace from '@/components/CardFace'
import SaleBlock from '@/components/SaleBlock'
import ShareButton from '@/components/ShareButton'

type Props = {
  params: Promise<{ cardSlug: string }>
  searchParams: Promise<{ spread?: string | string[] }>
}

// ponytail: ?spread= 를 읽으면서 이 페이지는 정적 생성에서 요청 시 렌더로 내려왔다.
// 대신 스프레드가 서버에서 그려져 카카오 스크래퍼·JS 없는 환경에서도 세 장이 다 보이고,
// 하이드레이션 뒤 레이아웃이 밀리지 않는다. 렌더 비용은 카드 조회(메모리) + 상품 조회(60초 캐시)뿐.
// 공유 링크 첫 페인트가 문제로 측정되면 그때 스프레드를 path 로 올려 (/result/[card]/[a]/[b])
// 정적 생성으로 되돌린다. OG 이미지 22장은 opengraph-image.tsx 가 따로 정적 생성한다.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = cardBySlug((await params).cardSlug)
  if (!card) return {}
  const title = `${card.nameKo} — 오늘의 타로`
  // 조사(을/를)는 받침에 따라 갈려서 '백수정를' 같은 문장이 공유 카드에 그대로 나간다.
  // 판정 로직을 두는 대신 조사가 붙지 않는 문장으로 쓴다.
  const description = `${card.message.split('.')[0]}. 추천 원석 — ${stoneName(card.stone)}`
  return { title, description, openGraph: { title, description } }
}

export default async function ResultPage({ params, searchParams }: Props) {
  const [{ cardSlug }, sp] = await Promise.all([params, searchParams])
  const card = cardBySlug(cardSlug)
  if (!card) notFound()

  // path 의 카드가 '조언' 자리 = 추천 원석을 정하는 카드. 앞의 두 자리만 쿼리로 따라온다.
  // 쿼리가 없거나 어긋나면 지금까지의 한 장 결과 그대로 — 예전 공유 링크가 계속 열린다.
  const lead = parseSpread(sp[SPREAD_PARAM], CARDS.length, card.id)
    .map(cardById)
    .filter((c): c is Card => c !== undefined)
  const isSpread = lead.length === SPREAD_SIZE - 1

  const products = recommend(await getProducts(), card.stone)

  return (
    <div className="space-y-10">
      {isSpread && (
        <section className="space-y-3 pt-2">
          <h2 className="text-center text-[11px] tracking-[0.3em] text-muted">
            세 장으로 읽은 오늘
          </h2>
          {lead.map((c, i) => (
            <article
              key={c.id}
              className="card-surface float-in flex gap-3 rounded-xl p-3"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="w-16 shrink-0">
                <CardFace card={c} />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.2em] text-gold/80">{SPREAD_POSITIONS[i]}</p>
                <p className="text-sm font-semibold text-cream">
                  {c.nameKo} <span className="text-[11px] font-normal text-muted">{c.nameEn}</span>
                </p>
                <p className="text-xs leading-relaxed text-muted">{c.message}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="flex flex-col items-center gap-4 pt-2 text-center">
        {isSpread && (
          <p className="text-[11px] tracking-[0.2em] text-gold/80">
            {SPREAD_POSITIONS[SPREAD_SIZE - 1]}
          </p>
        )}
        <div className="w-36 float-in" style={isSpread ? { animationDelay: '180ms' } : undefined}>
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
          {isSpread ? '오늘의 조언이 가리키는 원석, ' : '이 카드의 기운을 담은 원석, '}
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
