'use client'

import { useEffect, useState } from 'react'
import { SALE_WINDOW_MS, isSaleActive } from './order'
import { saleDrawnAt, startSale } from './sale'

/**
 * 타로 특가 남은 시간. cardId가 없으면 특가 없음(정가).
 * start=true 인 화면(결과 페이지)에서 24시간 타이머가 시작된다.
 * 첫 렌더는 항상 msLeft=0 — 서버 HTML과 어긋나지 않게.
 */
export function useSale(cardId?: number, start = false) {
  const [msLeft, setMsLeft] = useState(0)

  useEffect(() => {
    if (cardId === undefined) return
    if (start) startSale(cardId)
    const tick = () => {
      const at = saleDrawnAt(cardId)
      setMsLeft(isSaleActive(at, Date.now()) ? at! + SALE_WINDOW_MS - Date.now() : 0)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [cardId, start])

  return { active: msLeft > 0, msLeft }
}
