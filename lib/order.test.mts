// npm test — 주문 금액/특가/검증만 확인한다. 프레임워크 없이 node --test.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  orderTotal,
  isSaleActive,
  makeOrderNo,
  validateOrder,
  normalizePhone,
  discountRate,
  hms,
  SALE_WINDOW_MS,
  SHIPPING_FEE,
} from './order.ts'

test('배송비는 5만원 미만에만 붙는다', () => {
  assert.deepEqual(orderTotal(39000, 1), {
    subtotal: 39000,
    shipping: SHIPPING_FEE,
    total: 39000 + SHIPPING_FEE,
  })
  assert.deepEqual(orderTotal(50000, 1), { subtotal: 50000, shipping: 0, total: 50000 })
  assert.deepEqual(orderTotal(30000, 2), { subtotal: 60000, shipping: 0, total: 60000 })
})

test('특가는 뽑은 뒤 24시간까지만 유효', () => {
  const t = 1_700_000_000_000
  assert.equal(isSaleActive(t, t), true)
  assert.equal(isSaleActive(t, t + SALE_WINDOW_MS - 1), true)
  assert.equal(isSaleActive(t, t + SALE_WINDOW_MS), false)
  assert.equal(isSaleActive(null, t), false)
  assert.equal(isSaleActive(t, t - 1), false, '조작된 미래 시각은 무효')
})

test('할인율 · 카운트다운 표기', () => {
  assert.equal(discountRate(50000, 44000), 12)
  assert.equal(discountRate(0, 0), 0)
  assert.equal(hms(SALE_WINDOW_MS), '24:00:00')
  assert.equal(hms(3_661_000), '01:01:01')
  assert.equal(hms(-5), '00:00:00')
})

test('주문번호는 T+YYMMDD+4자리', () => {
  const no = makeOrderNo(new Date(2026, 6, 24), () => 0.4242)
  assert.equal(no, 'T2607244242')
  assert.match(makeOrderNo(new Date(2026, 0, 5), () => 0), /^T260105\d{4}$/)
})

test('주문 검증은 RLS 정책과 같은 선에서 막는다', () => {
  const ok = { buyerName: '홍길동', phone: '010-1234-5678', address: '서울시 어딘가 1층', qty: 1 }
  assert.equal(validateOrder(ok), null)
  assert.equal(normalizePhone('010-1234-5678'), '01012345678')
  assert.ok(validateOrder({ ...ok, qty: 11 }))
  assert.ok(validateOrder({ ...ok, phone: '02-123-4567' }))
  assert.ok(validateOrder({ ...ok, address: '짧음' }))
  assert.ok(validateOrder({ ...ok, buyerName: '  ' }))
})
