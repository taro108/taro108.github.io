// 운영자가 바꾸는 값은 전부 여기 한 곳에.

export const SITE = {
  name: '타로108',
  tagline: '오늘의 타로가 골라주는 108염주 · 합장주',
  description:
    '타로 한 장을 뽑으면 그 기운에 맞는 108염주 팔찌와 합장주를 추천해 드립니다. 타로 특가 24시간 한정.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://taro108.vercel.app',
} as const

// 배송비·특가 시간 등 계산에 쓰이는 값은 lib/order.ts 에 있다.

// TODO(운영자): 실제 계좌로 교체 — PRD §8-1
export const BANK = {
  bank: '○○은행',
  account: '000-0000-0000-00',
  holder: '홍길동(타로108)',
} as const

// TODO(운영자): 사업자 정보 교체 — PRD §8-4. 판매 개시 전 법적 필수.
export const BUSINESS = {
  company: '타로108',
  owner: '대표자명',
  regNo: '000-00-00000',
  mailOrderNo: '제0000-지역-0000호',
  address: '사업장 주소',
  tel: '000-0000-0000',
  email: 'contact@example.com',
  kakao: 'https://pf.kakao.com/_______',
} as const
