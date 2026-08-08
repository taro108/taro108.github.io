// 주문 계산 · 검증 · 특가 판정. 순수 함수만 두고 import 없이 유지한다
// (node --test 로 그대로 돌리기 위해 — lib/order.test.mts).

export const SHIPPING_FEE = 3500
export const FREE_SHIPPING_OVER = 50000
/** 타로 특가 유효 시간 */
export const SALE_WINDOW_MS = 24 * 60 * 60 * 1000
/** 입금 기한 */
export const DEPOSIT_DEADLINE_HOURS = 48

export const won = (n: number) => n.toLocaleString('ko-KR') + '원'

export function orderTotal(unitPrice: number, qty: number) {
  const subtotal = unitPrice * qty
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: subtotal + shipping }
}

/** 특가는 뽑은 시각 기준 24시간. 서버 검증 없음 (TRD §7). */
export function isSaleActive(drawnAt: number | null, now: number) {
  return drawnAt !== null && now - drawnAt < SALE_WINDOW_MS && now >= drawnAt
}

/** 남은 시간 HH:MM:SS */
export function hms(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export const discountRate = (price: number, salePrice: number) =>
  price > 0 ? Math.round((1 - salePrice / price) * 100) : 0

/** 'T' + YYMMDD + 4자리. 충돌 시 재시도는 호출부에서 (TRD §4). */
export function makeOrderNo(now: Date, rand = Math.random) {
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const tail = String(Math.floor(rand() * 10000)).padStart(4, '0')
  return `T${yy}${mm}${dd}${tail}`
}

/** RLS의 phone ~ '^01[0-9]{8,9}$' 와 같은 규칙 — 하이픈·공백 제거 후 검증. */
export const normalizePhone = (raw: string) => raw.replace(/\D/g, '')
export const isValidPhone = (raw: string) => /^01\d{8,9}$/.test(normalizePhone(raw))

/** RLS insert 정책과 동일한 조건. 여기서 막으면 서버 거절 전에 사용자에게 알려줄 수 있다. */
export function validateOrder(f: {
  buyerName: string
  phone: string
  address: string
  qty: number
}): string | null {
  if (f.qty < 1 || f.qty > 10) return '수량은 1~10개까지 주문할 수 있어요.'
  if (f.buyerName.trim().length < 1 || f.buyerName.trim().length > 30)
    return '주문자 이름을 확인해 주세요.'
  if (!isValidPhone(f.phone)) return '연락처를 010으로 시작하는 번호로 입력해 주세요.'
  const addr = f.address.trim()
  if (addr.length < 5 || addr.length > 200) return '배송지 주소를 5자 이상 입력해 주세요.'
  return null
}
