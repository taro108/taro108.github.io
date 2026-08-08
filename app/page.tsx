import Link from 'next/link'
import { CARDS } from '@/data/cards'
import CardFace from '@/components/CardFace'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/supabase'

const STEPS = [
  ['카드 세 장을 뽑고', '지금의 상황 · 당신의 마음 · 오늘의 조언, 세 자리에 놓습니다.'],
  ['오늘의 기운을 읽고', '세 장이 전하는 메시지와, 조언 카드가 가리키는 원석을 알려드려요.'],
  ['24시간 특가로', '추천 원석으로 만든 108염주·합장주를 타로 특가로 만나보세요.'],
]

export default async function Home() {
  const products = await getProducts()
  const preview = [CARDS[1], CARDS[17], CARDS[19]] // 마법사 · 별 · 태양

  return (
    <div className="space-y-14">
      <section className="pt-6 text-center">
        <p className="text-xs tracking-[0.3em] text-gold">TAROT × 108</p>
        <h1 className="mt-3 text-3xl font-bold leading-snug text-cream">
          오늘의 타로가 골라주는
          <br />
          <span className="text-gold-soft">108염주 · 합장주</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted">
          카드 세 장이 오늘의 기운을 읽어드립니다. 그 기운을 닮은 원석 염주를 24시간 특가로.
        </p>

        <div className="mx-auto mt-8 flex max-w-[260px] justify-center gap-3">
          {preview.map((c, i) => (
            <div
              key={c.id}
              className="w-1/3 float-in"
              style={{ animationDelay: `${i * 90}ms`, rotate: `${(i - 1) * 6}deg` }}
            >
              <CardFace card={c} />
            </div>
          ))}
        </div>

        <Link
          href="/tarot"
          className="mt-9 inline-block rounded-full bg-gold px-8 py-3.5 font-bold text-ink hover:bg-gold-soft"
        >
          오늘의 타로 뽑기
        </Link>
        <p className="mt-2 text-xs text-muted">무료 · 회원가입 없이 바로</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">이렇게 진행돼요</h2>
        <ol className="space-y-3">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="card-surface flex gap-3 rounded-xl p-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-cream">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {products.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-bold text-cream">지금 있는 염주</h2>
            <Link href="/products" className="text-xs text-gold underline">
              전체 보기
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
