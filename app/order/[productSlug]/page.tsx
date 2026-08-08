import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/supabase'
import { parseCardId } from '@/data/cards'
import OrderForm from '@/components/OrderForm'

export const metadata: Metadata = { title: '주문서', robots: { index: false } }

type Props = {
  params: Promise<{ productSlug: string }>
  searchParams: Promise<{ card?: string | string[] }>
}

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ productSlug }, sp] = await Promise.all([params, searchParams])
  const product = await getProduct(productSlug)
  if (!product) notFound()

  if (product.stock <= 0) {
    return (
      <div className="space-y-4 pt-8 text-center">
        <p className="text-cream">품절된 상품이에요.</p>
        <Link href="/products" className="inline-block text-sm text-gold underline">
          다른 상품 보기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="pt-2 text-xl font-bold text-cream">주문서</h1>
      <OrderForm product={product} cardId={parseCardId(sp.card)} />
    </div>
  )
}
