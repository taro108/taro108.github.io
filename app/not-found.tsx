import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 pt-16 text-center">
      <p className="text-3xl text-gold/60">✦</p>
      <h1 className="text-lg font-bold text-cream">찾는 페이지가 없어요</h1>
      <Link href="/tarot" className="text-sm text-gold underline">
        오늘의 타로 뽑기 →
      </Link>
    </div>
  )
}
