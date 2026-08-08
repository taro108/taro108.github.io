import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/supabase'
import ProductCard, { CATEGORY_LABEL } from '@/components/ProductCard'

export const metadata: Metadata = {
  title: '전체 상품',
  description: '108염주 팔찌와 합장주 전체 목록입니다.',
}

export default async function ProductsPage() {
  const products = await getProducts()
  const groups = (['bracelet108', 'hapjangju'] as const).map((c) => ({
    key: c,
    label: CATEGORY_LABEL[c],
    items: products.filter((p) => p.category === c),
  }))

  return (
    <div className="space-y-10">
      <header className="space-y-2 pt-2">
        <h1 className="text-xl font-bold text-cream">전체 상품</h1>
        <p className="text-sm text-muted">
          타로를 뽑으면 카드에 맞는 원석을 24시간 특가로 만날 수 있어요.{' '}
          <Link href="/tarot" className="text-gold underline">
            타로 뽑기 →
          </Link>
        </p>
      </header>

      {products.length === 0 && (
        <p className="card-surface rounded-xl p-6 text-center text-sm text-muted">
          준비된 상품이 없습니다.
        </p>
      )}

      {groups
        .filter((g) => g.items.length > 0)
        .map((g) => (
          <section key={g.key} className="space-y-3">
            <h2 className="text-base font-bold text-cream">{g.label}</h2>
            <div className="grid grid-cols-2 gap-3">
              {g.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
