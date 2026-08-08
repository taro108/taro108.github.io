import type { MetadataRoute } from 'next'
import { CARDS } from '@/data/cards'
import { getProducts } from '@/lib/supabase'
import { SITE } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const paths = [
    '/',
    '/tarot',
    '/products',
    '/about',
    '/terms',
    '/privacy',
    '/policy',
    ...CARDS.map((c) => `/result/${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ]
  return paths.map((path) => ({ url: `${SITE.url}${path}` }))
}
