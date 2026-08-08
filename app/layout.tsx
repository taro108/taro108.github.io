import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { SITE, BUSINESS } from '@/lib/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { type: 'website', siteName: SITE.name, locale: 'ko_KR' },
}

const NAV = [
  { href: '/tarot', label: '타로 뽑기' },
  { href: '/products', label: '전체 상품' },
  { href: '/about', label: '소개' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b border-line/70 bg-ink/85 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-screen-sm items-center justify-between px-4">
            <Link href="/" className="font-bold tracking-tight text-gold-soft">
              타로<span className="text-gold">108</span>
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-cream">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-screen-sm flex-1 px-4 pb-16 pt-6">{children}</main>

        <footer className="border-t border-line/70 px-4 py-8 text-xs leading-relaxed text-muted">
          <div className="mx-auto w-full max-w-screen-sm space-y-3">
            <nav className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/terms" className="hover:text-cream">이용약관</Link>
              <Link href="/privacy" className="hover:text-cream">개인정보처리방침</Link>
              <Link href="/policy" className="hover:text-cream">배송·교환·환불</Link>
              <a href={BUSINESS.kakao} className="hover:text-cream" target="_blank" rel="noreferrer">
                카카오톡 문의
              </a>
            </nav>
            <p>
              {BUSINESS.company} · 대표 {BUSINESS.owner} · 사업자등록번호 {BUSINESS.regNo}
              <br />
              통신판매업신고 {BUSINESS.mailOrderNo} · {BUSINESS.address}
              <br />
              {BUSINESS.tel} · {BUSINESS.email}
            </p>
            <p className="text-muted/70">
              타로 해석은 오락 목적의 콘텐츠이며 결과를 보증하지 않습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
