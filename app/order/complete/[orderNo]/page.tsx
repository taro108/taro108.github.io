import type { Metadata } from 'next'
import OrderComplete from '@/components/OrderComplete'

export const metadata: Metadata = { title: '주문 완료', robots: { index: false } }

export default async function Page({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params
  return <OrderComplete orderNo={orderNo} />
}
