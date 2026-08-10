'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARDS, type Card } from '@/data/cards'
import { SPREAD_POSITIONS, SPREAD_SIZE, SPREAD_PARAM, buildSpreadParam } from '@/lib/spread'
import CardFace from '@/components/CardFace'

// 부채꼴 배치 — 카드에서 340px 아래를 축으로 2.2도씩 돌린다.
// 22장이면 양끝이 ±23.1도, 부채 폭 ≈363px. 좁은 화면(390px)에서 잘리지 않게 스테이지는 -mx-4 로
// 좌우 여백까지 쓴다. 각도를 더 벌리면 끝 카드부터 잘리기 시작한다.
const ARC_ORIGIN = 340
const ARC_STEP = 2.2
/** globals.css 의 card-launch 길이와 맞춰야 카드가 사라지는 순간이 어긋나지 않는다. */
const LAUNCH_MS = 360
/** 세 장이 다 놓인 뒤 결과로 넘어가기까지 — 마지막 카드가 열리는 걸 볼 만큼만 둔다. */
const REVEAL_MS = 900

/** 뽑기 결과는 카드의 위치가 아니라 난수로 정한다 (TRD §7). 이미 나온 카드는 빼고 뽑는다. */
function drawFrom(exclude: Card[]): Card {
  const pool = CARDS.filter((c) => !exclude.includes(c))
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return pool[buf[0] % pool.length]
}

export default function TarotPage() {
  const router = useRouter()
  const [picked, setPicked] = useState<Card[]>([])
  // 부채꼴에서 사라진 자리. 화면상의 배치일 뿐 뽑힌 카드와는 무관하다.
  const [fan, setFan] = useState<number[]>(() => CARDS.map((_, i) => i))
  const [launching, setLaunching] = useState<number | null>(null)

  const done = picked.length >= SPREAD_SIZE

  useEffect(() => {
    if (!done) return
    const advice = picked[SPREAD_SIZE - 1]
    const rest = buildSpreadParam(picked.slice(0, SPREAD_SIZE - 1).map((c) => c.id))
    const id = setTimeout(
      () => router.push(`/result/${advice.slug}?${SPREAD_PARAM}=${rest}`),
      REVEAL_MS,
    )
    return () => clearTimeout(id)
  }, [done, picked, router])

  function pick(fanIndex: number) {
    if (done || launching !== null) return
    const card = drawFrom(picked)
    setLaunching(fanIndex)
    setTimeout(() => {
      setFan((f) => f.filter((i) => i !== fanIndex))
      setPicked((p) => [...p, card])
      setLaunching(null)
    }, LAUNCH_MS)
  }

  function pickAny() {
    if (done || launching !== null || fan.length === 0) return
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    pick(fan[buf[0] % fan.length])
  }

  return (
    <div className="space-y-7">
      <header className="pt-2 text-center">
        <h1 className="text-xl font-bold text-cream">세 장으로 오늘을 읽습니다</h1>
        <p className="mt-2 text-sm text-muted">
          {done ? (
            <span className="text-gold-soft">세 장이 모두 놓였습니다</span>
          ) : (
            <>
              <span className="text-gold-soft">{SPREAD_POSITIONS[picked.length]}</span> 자리에 놓을
              카드를 고르세요
            </>
          )}
        </p>
      </header>

      {/* 세 자리 — 뽑은 카드가 여기로 날아와 앞면을 연다 */}
      <div className="stage-3d grid grid-cols-3 gap-3">
        {SPREAD_POSITIONS.map((label, i) => {
          const card = picked[i]
          const isAdvice = i === SPREAD_SIZE - 1
          const isNext = !done && picked.length === i

          return (
            <div key={label} className="space-y-2">
              <div
                className={`relative rounded-xl ${isAdvice ? 'ring-1 ring-gold/45' : ''} ${
                  done && isAdvice ? 'advice-pulse' : ''
                }`}
              >
                {card ? (
                  <CardFace card={card} className="slot-flip" />
                ) : (
                  <div
                    className={`flex aspect-[2/3] items-center justify-center rounded-xl border border-dashed ${
                      isNext ? 'slot-idle border-gold/60 text-gold' : 'border-line text-line'
                    }`}
                  >
                    <span className="text-lg">{i + 1}</span>
                  </div>
                )}
              </div>
              <p
                className={`text-center text-[11px] ${
                  isAdvice ? 'font-semibold text-gold-soft' : 'text-muted'
                }`}
              >
                {label}
              </p>
            </div>
          )
        })}
      </div>

      {/* 부채꼴로 펼친 덱 */}
      <div className="stage-3d relative -mx-4 h-52" aria-hidden={done}>
        {fan.map((fanIndex, i) => {
          const angle = ((i - (fan.length - 1) / 2) * ARC_STEP).toFixed(2)
          return (
            <button
              key={fanIndex}
              type="button"
              disabled={done || launching !== null}
              onClick={() => pick(fanIndex)}
              aria-label={`${i + 1}번째 카드 뽑기`}
              className="group absolute top-3 left-1/2 -ml-8 w-16 transition-transform duration-300 ease-out focus:outline-none disabled:cursor-default"
              style={{ transform: `rotate(${angle}deg)`, transformOrigin: `50% ${ARC_ORIGIN}px` }}
            >
              <span
                className={`block ${launching === fanIndex ? 'card-launch' : 'fan-deal'}`}
                style={launching === fanIndex ? undefined : { animationDelay: `${i * 14}ms` }}
              >
                <span className="card-back flex aspect-[2/3] items-center justify-center rounded-lg transition-transform duration-200 ease-out group-enabled:group-hover:-translate-y-6 group-enabled:group-focus-visible:-translate-y-6">
                  <span className="text-xl text-gold/45">✷</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={pickAny}
        disabled={done || launching !== null}
        className="w-full rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 font-semibold text-gold-soft disabled:opacity-40"
      >
        {done ? '결과를 여는 중…' : '아무 카드나 뽑아주세요'}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted">
        어떤 카드를 고르든 결과는 무작위로 정해집니다. 하루에 여러 번 뽑아도 괜찮아요.
        <br />
        추천 원석은 <span className="text-gold-soft">오늘의 조언</span> 자리 카드가 정합니다.
      </p>
    </div>
  )
}
