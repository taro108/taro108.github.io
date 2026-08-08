'use client'

import { isSaleActive } from './order'

// 특가 만료 시각은 브라우저 localStorage 에만 산다 (TRD §7).
const key = (cardId: number) => `taro_sale_${cardId}`

export function startSale(cardId: number) {
  try {
    if (!localStorage.getItem(key(cardId))) {
      localStorage.setItem(key(cardId), String(Date.now()))
    }
  } catch {
    // 시크릿 모드 등 저장 불가 — 특가 없이 정가로 보여준다
  }
}

export function saleDrawnAt(cardId: number): number | null {
  try {
    const v = localStorage.getItem(key(cardId))
    const n = v ? Number(v) : NaN
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export const saleAlive = (cardId: number) => isSaleActive(saleDrawnAt(cardId), Date.now())
