export const STONES = {
  'clear-quartz': { ko: '백수정', from: '#e9e6f2', to: '#b8b2d2' },
  citrine: { ko: '시트린', from: '#f7d08a', to: '#d99a2b' },
  amethyst: { ko: '자수정', from: '#c0a3e4', to: '#6f4fa8' },
  'rose-quartz': { ko: '로즈쿼츠', from: '#f6c6d2', to: '#d97f9c' },
  'tiger-eye': { ko: '호안석', from: '#e0ab58', to: '#8a5a20' },
  lapis: { ko: '라피스라줄리', from: '#5f7ddb', to: '#23347a' },
  garnet: { ko: '가넷', from: '#d9727a', to: '#7c1f2b' },
  onyx: { ko: '오닉스', from: '#5d5d6b', to: '#17171d' },
  amazonite: { ko: '아마조나이트', from: '#8fdcd0', to: '#2f8a86' },
} as const

export type StoneSlug = keyof typeof STONES

export const stoneName = (slug: string) =>
  STONES[slug as StoneSlug]?.ko ?? slug

const stone = (slug: string) => STONES[slug as StoneSlug] ?? STONES['clear-quartz']

/** 사진이 없는 상품의 대체 이미지로 쓰는 그라데이션. */
export const stoneGradient = (slug: string) => {
  const s = stone(slug)
  return `linear-gradient(150deg, ${s.from} 0%, ${s.to} 100%)`
}

/** 어두운 카드 위에 얹는 원석 빛. 글자는 항상 크림색이라 대비가 깨지지 않는다. */
export const stoneGlow = (slug: string) => {
  const s = stone(slug)
  return `radial-gradient(120% 80% at 50% 30%, ${s.from}40 0%, ${s.to}30 45%, transparent 72%)`
}
