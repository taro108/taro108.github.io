import type { Card } from '@/data/cards'
import { stoneGlow } from '@/lib/stones'

// ponytail: 라이더-웨이트 스캔 대신 CSS로 그린 카드. 자체 일러스트 생기면 <img>로 교체.
export default function CardFace({ card, className = '' }: { card: Card; className?: string }) {
  return (
    <div
      className={`card-surface relative flex aspect-[2/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-gold/40 px-2 text-center ${className}`}
    >
      <div className="absolute inset-0" style={{ background: stoneGlow(card.stone) }} />
      <div className="absolute inset-[6px] rounded-lg border border-gold/20" />
      <span className="absolute top-2 left-0 right-0 text-[10px] tracking-[0.2em] text-gold/70">
        {card.numeral}
      </span>
      <span className="relative text-4xl leading-none text-gold-soft">{card.symbol}</span>
      <span className="relative mt-1 text-sm font-semibold text-cream">{card.nameKo}</span>
      <span className="relative text-[10px] tracking-wide text-muted">{card.nameEn}</span>
    </div>
  )
}
