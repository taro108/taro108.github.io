'use client'

import { useState } from 'react'

/** 네이티브 공유 시트가 있으면 그걸, 없으면 URL 복사. 카카오 SDK는 안 붙인다. */
export default function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false)

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // 사용자가 취소한 경우 — 복사로 넘어가지 않는다
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      setDone(false)
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-soft"
    >
      {done ? '링크를 복사했어요' : '결과 공유하기'}
    </button>
  )
}
