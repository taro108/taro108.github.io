import type { Metadata } from 'next'
import Link from 'next/link'
import Doc from '@/components/Doc'
import { STONES } from '@/lib/stones'

export const metadata: Metadata = {
  title: '소개',
  description: '타로108은 타로 카드의 기운을 원석 염주로 잇는 작은 공방입니다.',
}

export default function AboutPage() {
  return (
    <Doc title="타로108 이야기">
      <p>
        108개의 알에는 사람이 하루에 겪는 번뇌의 수만큼 의미가 담겨 있습니다. 타로108은 오늘 뽑은
        세 장의 카드에서 시작해, 그 기운을 닮은 원석으로 엮은 108염주 팔찌와 합장주를 만듭니다.
      </p>

      <section>
        <h2>왜 타로와 원석인가요</h2>
        <p className="mt-1.5">
          타로는 오늘의 마음을 비추는 거울이고, 원석은 그 마음을 손목에 남겨두는 방법입니다.
          카드가 말하는 기운과 원석이 가진 상징을 이어, 오늘의 나에게 가장 어울리는 한 줄을
          골라드립니다.
        </p>
      </section>

      <section>
        <h2>다루는 원석</h2>
        <ul>
          {Object.entries(STONES).map(([slug, s]) => (
            <li key={slug}>{s.ko}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>만드는 방식</h2>
        <ul>
          <li>천연 원석을 한 알씩 골라 손으로 엮습니다.</li>
          <li>주문 후 손목 둘레에 맞춰 길이를 조정해 발송합니다.</li>
          <li>염주 알의 크기와 색은 천연석 특성상 조금씩 다릅니다.</li>
        </ul>
      </section>

      <p className="text-xs text-muted">
        타로 해석은 오락 목적의 콘텐츠이며, 원석의 효능은 의학적·과학적으로 검증된 사실이 아닙니다.
      </p>

      <Link href="/tarot" className="inline-block text-sm text-gold underline">
        오늘의 타로 뽑으러 가기 →
      </Link>
    </Doc>
  )
}
