// parseSpread 는 주소창에서 그대로 들어오는 값을 읽는다 — 망가진 입력이 화면을 깨지 않는지만 본다.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSpread, buildSpreadParam, SPREAD_POSITIONS } from './spread.ts'

const DECK = 22
const ADVICE = 8

test('정상 스프레드는 두 자리를 그대로 돌려준다', () => {
  assert.deepEqual(parseSpread('13,17', DECK, ADVICE), [13, 17])
  assert.deepEqual(parseSpread(' 0 , 21 ', DECK, ADVICE), [0, 21])
  // 같은 이름의 쿼리가 두 번 오면 Next 가 배열로 준다 — 첫 값만 본다.
  assert.deepEqual(parseSpread(['13,17', '1,2'], DECK, ADVICE), [13, 17])
})

test('어긋난 입력은 통째로 버리고 한 장 결과로 떨어진다', () => {
  assert.deepEqual(parseSpread(undefined, DECK, ADVICE), [])
  assert.deepEqual(parseSpread('', DECK, ADVICE), [])
  assert.deepEqual(parseSpread('13', DECK, ADVICE), [], '자리 수가 모자라면 버린다')
  assert.deepEqual(parseSpread('13,17,3', DECK, ADVICE), [], '자리 수가 넘쳐도 버린다')
  assert.deepEqual(parseSpread('13,99', DECK, ADVICE), [], '덱 밖의 번호')
  assert.deepEqual(parseSpread('-1,3', DECK, ADVICE), [], '음수')
  assert.deepEqual(parseSpread('1.5,3', DECK, ADVICE), [], '정수가 아님')
  assert.deepEqual(parseSpread('abc,3', DECK, ADVICE), [], '숫자가 아님')
  assert.deepEqual(parseSpread('7,7', DECK, ADVICE), [], '같은 카드가 두 자리에')
  assert.deepEqual(parseSpread(`${ADVICE},3`, DECK, ADVICE), [], '조언 카드와 겹침')
})

test('만든 쿼리는 다시 읽힌다', () => {
  const ids = [4, 19]
  assert.deepEqual(parseSpread(buildSpreadParam(ids), DECK, ADVICE), ids)
})

test('자리는 세 개, 마지막이 조언', () => {
  assert.equal(SPREAD_POSITIONS.length, 3)
  assert.equal(SPREAD_POSITIONS.at(-1), '오늘의 조언')
})
