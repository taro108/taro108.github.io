import { createClient } from '@supabase/supabase-js'
import { SAMPLE_PRODUCTS } from '@/data/products.sample'

// anon key는 공개돼도 되는 키다. 보안은 전부 RLS로 강제한다 (TRD §6).
// 환경변수가 없어도 빌드는 통과시키고, 조회 실패는 빈 목록으로 떨어뜨린다.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

/** 환경변수가 둘 다 있어야 실제 DB를 본다. 없으면 화면 확인용 샘플 상품으로 떨어진다. */
const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  global: {
    // 서버 컴포넌트에서의 조회를 60초 ISR 캐시에 태운다 (POST는 Next가 캐시하지 않음).
    fetch: (input, init) =>
      fetch(input, { ...init, next: { revalidate: 60 } } as RequestInit),
  },
})

export type Product = {
  id: string
  slug: string
  name: string
  category: 'bracelet108' | 'hapjangju'
  stone: string
  price: number
  sale_price: number
  stock: number
  images: string[]
  description: string
}

const COLUMNS = 'id,slug,name,category,stone,price,sale_price,stock,images,description'

/** SKU 수십 개 규모라 통째로 받아 화면에서 거른다. 100개 넘어가면 그때 쿼리로 내린다. */
export async function getProducts(): Promise<Product[]> {
  if (!CONFIGURED) return SAMPLE_PRODUCTS
  const { data, error } = await supabase
    .from('products')
    .select(COLUMNS)
    .eq('is_active', true)
    // seed 18개는 created_at 이 전부 같아서 slug 를 동점 처리자로 둔다 (매번 순서가 바뀌지 않게).
    .order('created_at', { ascending: true })
    .order('slug', { ascending: true })
  if (error) {
    console.error('[products]', error.message)
    return []
  }
  return (data ?? []) as Product[]
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!CONFIGURED) return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null
  const { data, error } = await supabase
    .from('products')
    .select(COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) {
    console.error('[product]', error.message)
    return null
  }
  return (data as Product) ?? null
}

/** 해당 원석 상품을 앞으로, 품절은 뒤로. */
export function recommend(products: Product[], stone: string, limit = 3) {
  return [...products]
    .sort(
      (a, b) =>
        Number(b.stone === stone) - Number(a.stone === stone) ||
        Number(b.stock > 0) - Number(a.stock > 0),
    )
    .slice(0, limit)
}
