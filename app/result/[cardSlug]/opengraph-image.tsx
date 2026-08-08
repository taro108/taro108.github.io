import { ImageResponse } from 'next/og'
import { CARDS, cardBySlug } from '@/data/cards'
import { STONES, type StoneSlug } from '@/lib/stones'

export const alt = '오늘의 타로 결과'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// 22장 전부 빌드 타임에 굽는다 — 공유 카드 이미지를 요청 때마다 만들지 않는다.
export function generateStaticParams() {
  return CARDS.map((c) => ({ cardSlug: c.slug }))
}

/**
 * 카카오톡·문자·SNS 공유 카드에 쓰이는 og:image.
 *
 * ponytail: 글자는 전부 로마자다. next/og 기본 폰트에 한글 글리프가 없어서 한글을 넣으면
 * 네모(두부)로 나오고, 한글 폰트를 넣으려면 수 MB짜리 TTF를 레포에 두고 빌드에서 읽어야 한다.
 * 카드 영문명 + 로마숫자 + 원석 색이면 공유 카드로 충분해서 폰트는 받지 않았다.
 * 한글 문구가 꼭 필요해지면 Noto Sans KR 서브셋(필요 글자만)을 assets/ 에 넣고 fonts 옵션에 건다.
 */
export default async function Image({ params }: { params: Promise<{ cardSlug: string }> }) {
  const card = cardBySlug((await params).cardSlug)
  const stone = STONES[(card?.stone ?? 'clear-quartz') as StoneSlug]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0f0d18',
          backgroundImage: `radial-gradient(700px 460px at 78% 12%, ${stone.from}38 0%, ${stone.to}22 45%, transparent 72%)`,
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 10, color: '#d9b26a' }}>
          TARO108
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 64 }}>
          {/* 원석색은 링으로만 쓴다 — 오닉스처럼 어두운 원석 위에 숫자를 얹으면 대비가 깨진다. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 240,
              height: 240,
              borderRadius: 999,
              background: `linear-gradient(150deg, ${stone.from} 0%, ${stone.to} 100%)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 176,
                height: 176,
                borderRadius: 999,
                backgroundColor: '#0f0d18',
              }}
            >
              <div style={{ display: 'flex', fontSize: 80, fontWeight: 700, color: '#f2e0b6' }}>
                {card?.numeral ?? '?'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#efecf8' }}>
              {card?.nameEn ?? 'Tarot'}
            </div>
            <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#a49ec2' }}>
              {(card?.stone ?? 'clear-quartz').replace(/-/g, ' ').toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#a49ec2' }}>
          108 BEADS BRACELET · PRAYER BEADS
        </div>
      </div>
    ),
    size,
  )
}
