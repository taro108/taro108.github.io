// 3장 스프레드. 순수 함수만 두고 import 없이 유지한다 (lib/order.ts 와 같은 이유 — node --test).

/** 뽑는 순서 = 자리 순서. 마지막 '조언' 자리가 추천 원석을 정한다. */
export const SPREAD_POSITIONS = ['지금의 상황', '당신의 마음', '오늘의 조언'] as const

export const SPREAD_SIZE = SPREAD_POSITIONS.length

/** 결과 URL 의 쿼리 이름. 조언 카드는 path 에 있어서 여기 들어가지 않는다. */
export const SPREAD_PARAM = 'spread'

/**
 * '?spread=13,17' → [13, 17] (상황·마음).
 *
 * 조언 카드는 URL path(/result/[cardSlug])가 들고 있다. 그래야 정적 22페이지와
 * OG 이미지 22장이 그대로 살고, 특가 키·주문의 tarot_card_id 도 손댈 필요가 없다.
 *
 * 주소창으로 들어오는 값이라 하나라도 어긋나면 통째로 [] 를 준다 → 한 장 결과로 떨어진다.
 * 반쯤 맞은 스프레드를 그리느니 조용히 한 장으로 보여주는 쪽이 낫다.
 */
export function parseSpread(
  raw: string | string[] | undefined,
  deckSize: number,
  adviceId: number,
): number[] {
  const v = Array.isArray(raw) ? raw[0] : raw
  if (!v) return []

  const ids = v.split(',').map((s) => Number(s.trim()))
  if (ids.length !== SPREAD_SIZE - 1) return []
  if (!ids.every((n) => Number.isInteger(n) && n >= 0 && n < deckSize)) return []
  // 같은 카드가 두 자리에 앉거나 조언 카드와 겹치면 스프레드가 아니다.
  if (new Set([...ids, adviceId]).size !== SPREAD_SIZE) return []

  return ids
}

/** [상황, 마음] → '13,17'. 조언은 path 로 나가므로 받지 않는다. */
export const buildSpreadParam = (ids: number[]) => ids.join(',')
