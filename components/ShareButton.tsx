'use client'

import { useState } from 'react'
import Script from 'next/script'

// 키가 없으면 카카오 버튼 자체를 그리지 않는다 — SDK 도 안 받는다.
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
const KAKAO_SDK = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js'
// 서드파티 스크립트라 SRI 로 고정한다. SDK 버전을 올리면 이 해시도 같이 바꿔야 한다:
//   curl -s <위 URL> | openssl dgst -sha384 -binary | openssl base64 -A
const KAKAO_SRI = 'sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6'

declare global {
  interface Window {
    Kakao?: {
      init(key: string): void
      isInitialized(): boolean
      Share: { sendScrap(o: { requestUrl: string }): void }
    }
  }
}

/**
 * 네이티브 공유 시트 → 없으면 URL 복사. 카카오 키가 있으면 카카오톡 공유 버튼이 하나 더 붙는다.
 *
 * 카카오는 sendScrap 이라 별도 이미지·문구를 넘기지 않는다. 페이지의 og 태그를 그대로 긁어가므로
 * 공유 카드 문구는 generateMetadata 한 곳에서만 관리된다.
 * 단, Kakao Developers → 앱 → 플랫폼 → Web 에 도메인을 등록해야 동작한다 (localhost 포함).
 */
export default function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      setDone(false)
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href })
      } catch {
        // 사용자가 취소한 경우 — 복사로 넘어가지 않는다
      }
      return
    }
    await copyLink()
  }

  async function shareKakao() {
    const kakao = window.Kakao
    if (kakao && KAKAO_KEY) {
      try {
        if (!kakao.isInitialized()) kakao.init(KAKAO_KEY)
        kakao.Share.sendScrap({ requestUrl: window.location.href })
        return
      } catch {
        // SDK 오류·도메인 미등록 — 링크 복사로 떨어뜨린다
      }
    }
    await copyLink()
  }

  return (
    <>
      {KAKAO_KEY && (
        <Script
          src={KAKAO_SDK}
          integrity={KAKAO_SRI}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      <button
        type="button"
        onClick={share}
        className="rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-soft"
      >
        {done ? '링크를 복사했어요' : '결과 공유하기'}
      </button>

      {KAKAO_KEY && (
        <button
          type="button"
          onClick={shareKakao}
          className="rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191600]"
        >
          카카오톡으로 공유
        </button>
      )}
    </>
  )
}
