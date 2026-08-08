'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARDS, type Card } from '@/data/cards'
import CardFace from '@/components/CardFace'

/** 뽑기 결과는 카드의 위치가 아니라 난수로 정한다 (TRD §7). */
function drawCard(): Card {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return CARDS[buf[0] % CARDS.length]
}

export default function TarotPage() {
  const router = useRouter()
  const [picked, setPicked] = useState<Card | null>(null)

  function pick() {
    if (picked) return
    const card = drawCard()
    setPicked(card)
    setTimeout(() => router.push(`/result/${card.slug}`), 1100)
  }

  if (picked) {
    return (
      <div className="flex flex-col items-center gap-5 pt-10 text-center">
        <div className="w-40 float-in">
          <CardFace card={picked} />
        </div>
        <p className="text-sm text-muted">
          <span className="text-gold-soft">{picked.nameKo}</span> 카드를 뽑았습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="pt-2 text-center">
        <h1 className="text-xl font-bold text-cream">마음이 가는 카드를 한 장 고르세요</h1>
        <p className="mt-2 text-sm text-muted">
          메이저 아르카나 22장 · 옆으로 밀어서 볼 수 있어요
        </p>
      </header>

      <div className="-mx-4 overflow-x-auto px-4 pb-4">
        <div className="flex w-max pl-6">
          {CARDS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={pick}
              aria-label={`${i + 1}번째 카드 뽑기`}
              className="card-back -ml-6 aspect-[2/3] w-20 shrink-0 rounded-xl transition-transform hover:-translate-y-3 focus:-translate-y-3 focus:outline-none"
              style={{ rotate: `${(i - CARDS.length / 2) * 0.8}deg` }}
            >
              <span className="text-2xl text-gold/50">✷</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={pick}
        className="w-full rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 font-semibold text-gold-soft"
      >
        아무 카드나 뽑아주세요
      </button>

      <p className="text-center text-xs text-muted">
        어떤 카드를 고르든 결과는 무작위로 정해집니다. 하루에 여러 번 뽑아도 괜찮아요.
      </p>
    </div>
  )
}
