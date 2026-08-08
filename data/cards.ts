import type { StoneSlug } from '@/lib/stones'

export type Card = {
  id: number
  slug: string
  nameKo: string
  nameEn: string
  numeral: string
  symbol: string
  keywords: [string, string, string]
  message: string
  stone: StoneSlug
  stoneNote: string
}

// 메이저 아르카나 22장. 정방향 해석만 사용 (PRD F1).
// 문구·원석 매핑은 운영자 감수 대상 (PRD §8-3).
export const CARDS: Card[] = [
  {
    id: 0,
    slug: 'major-00-fool',
    nameKo: '바보',
    nameEn: 'The Fool',
    numeral: '0',
    symbol: '✧',
    keywords: ['새 출발', '자유', '순수'],
    message:
      '아직 아무것도 정해지지 않았다는 건, 무엇이든 될 수 있다는 뜻입니다. 오늘은 계산보다 마음이 먼저 움직이는 날이니 재고 따지기 전에 한 걸음을 떼어 보세요. 서툴러도 괜찮습니다.',
    stone: 'clear-quartz',
    stoneNote: '어떤 색으로도 물들 수 있는, 순수한 시작의 돌',
  },
  {
    id: 1,
    slug: 'major-01-magician',
    nameKo: '마법사',
    nameEn: 'The Magician',
    numeral: 'I',
    symbol: '✶',
    keywords: ['실행', '재능', '창조'],
    message:
      '필요한 재료는 이미 당신 손안에 다 있습니다. 부족한 건 능력이 아니라 지금 시작한다는 결심 하나뿐이에요. 오늘 꺼낸 말과 행동이 그대로 현실이 됩니다.',
    stone: 'citrine',
    stoneNote: '의지를 현실로 끌어내는 풍요와 실행의 돌',
  },
  {
    id: 2,
    slug: 'major-02-high-priestess',
    nameKo: '여사제',
    nameEn: 'The High Priestess',
    numeral: 'II',
    symbol: '☾',
    keywords: ['직관', '침묵', '내면'],
    message:
      '답은 이미 당신 안에 있습니다. 오늘은 많이 묻기보다 조용히 듣는 편이 이롭습니다. 문득 스치고 지나가는 직감을 흘려보내지 마세요.',
    stone: 'amethyst',
    stoneNote: '직관과 내면의 소리를 밝혀주는 돌',
  },
  {
    id: 3,
    slug: 'major-03-empress',
    nameKo: '여황제',
    nameEn: 'The Empress',
    numeral: 'III',
    symbol: '❀',
    keywords: ['풍요', '사랑', '돌봄'],
    message:
      '애써 키워온 것들이 이제 결실을 맺기 시작합니다. 오늘은 나를 먼저 넉넉히 돌보세요. 채워진 마음에서 나온 다정함이 주변까지 물들입니다.',
    stone: 'rose-quartz',
    stoneNote: '사랑과 돌봄의 기운을 품는 돌',
  },
  {
    id: 4,
    slug: 'major-04-emperor',
    nameKo: '황제',
    nameEn: 'The Emperor',
    numeral: 'IV',
    symbol: '■',
    keywords: ['결단', '책임', '중심'],
    message:
      '흔들리는 상황일수록 기준을 세운 사람이 이깁니다. 오늘은 미뤄둔 결정을 매듭짓기 좋은 날이에요. 당신이 정한 선이 곧 질서가 됩니다.',
    stone: 'tiger-eye',
    stoneNote: '중심을 잡고 밀고 나가는 결단의 돌',
  },
  {
    id: 5,
    slug: 'major-05-hierophant',
    nameKo: '교황',
    nameEn: 'The Hierophant',
    numeral: 'V',
    symbol: '❖',
    keywords: ['가르침', '신뢰', '전통'],
    message:
      '혼자 헤매지 않아도 됩니다. 먼저 걸어간 사람의 말 속에 오늘의 실마리가 있어요. 배움을 청하는 일은 지는 게 아니라 빨라지는 겁니다.',
    stone: 'lapis',
    stoneNote: '지혜와 가르침을 상징하는 돌',
  },
  {
    id: 6,
    slug: 'major-06-lovers',
    nameKo: '연인',
    nameEn: 'The Lovers',
    numeral: 'VI',
    symbol: '✿',
    keywords: ['선택', '인연', '조화'],
    message:
      '마음이 향하는 쪽은 이미 정해져 있습니다. 오늘은 머리로 계산한 답보다 가슴이 따뜻해지는 선택을 하세요. 관계는 솔직함에서 깊어집니다.',
    stone: 'rose-quartz',
    stoneNote: '관계와 선택에 온기를 더하는 돌',
  },
  {
    id: 7,
    slug: 'major-07-chariot',
    nameKo: '전차',
    nameEn: 'The Chariot',
    numeral: 'VII',
    symbol: '▲',
    keywords: ['추진', '승리', '의지'],
    message:
      '속도를 늦출 때가 아닙니다. 방향만 분명하면 지금의 추진력이 당신을 멀리 데려다줍니다. 흔들리는 마음은 잠시 옆자리에 태워 두세요.',
    stone: 'tiger-eye',
    stoneNote: '목표를 향해 직진하는 추진의 돌',
  },
  {
    id: 8,
    slug: 'major-08-strength',
    nameKo: '힘',
    nameEn: 'Strength',
    numeral: 'VIII',
    symbol: '∞',
    keywords: ['용기', '인내', '다정'],
    message:
      '힘으로 누르는 대신 다독여야 넘어가는 일이 있습니다. 오늘의 용기는 큰소리가 아니라 기다려주는 부드러움에서 나와요. 당신은 생각보다 단단합니다.',
    stone: 'garnet',
    stoneNote: '흔들리지 않는 내면의 힘을 데워주는 돌',
  },
  {
    id: 9,
    slug: 'major-09-hermit',
    nameKo: '은둔자',
    nameEn: 'The Hermit',
    numeral: 'IX',
    symbol: '✦',
    keywords: ['성찰', '고요', '지혜'],
    message:
      '잠시 물러나는 것도 전진입니다. 오늘은 사람을 만나기보다 스스로에게 시간을 내주세요. 조용한 자리에서 오래 찾던 답이 떠오릅니다.',
    stone: 'amethyst',
    stoneNote: '고요한 성찰의 시간을 지켜주는 돌',
  },
  {
    id: 10,
    slug: 'major-10-wheel',
    nameKo: '운명의 수레바퀴',
    nameEn: 'Wheel of Fortune',
    numeral: 'X',
    symbol: '◎',
    keywords: ['전환', '기회', '흐름'],
    message:
      '흐름이 바뀌는 자리에 서 있습니다. 붙잡을 것과 놓아줄 것이 오늘 나뉘어요. 예상 밖의 소식이 오히려 반가운 방향으로 이어집니다.',
    stone: 'citrine',
    stoneNote: '흐름을 기회로 바꾸는 행운의 돌',
  },
  {
    id: 11,
    slug: 'major-11-justice',
    nameKo: '정의',
    nameEn: 'Justice',
    numeral: 'XI',
    symbol: '◇',
    keywords: ['균형', '판단', '진실'],
    message:
      '감정보다 사실이 당신을 지켜줍니다. 오늘은 애매하게 넘어간 일을 분명히 정리하기 좋은 날이에요. 공정하게 매듭지으면 마음도 가벼워집니다.',
    stone: 'lapis',
    stoneNote: '명료한 판단과 균형의 돌',
  },
  {
    id: 12,
    slug: 'major-12-hanged-man',
    nameKo: '매달린 사람',
    nameEn: 'The Hanged Man',
    numeral: 'XII',
    symbol: '▽',
    keywords: ['전환점', '기다림', '관점'],
    message:
      '지금 멈춰 있는 건 실패가 아니라 각도를 바꾸는 중입니다. 억지로 밀어붙이면 오히려 더 늦어져요. 한 박자 쉬면 안 보이던 길이 보입니다.',
    stone: 'clear-quartz',
    stoneNote: '관점을 비우고 다시 보게 하는 돌',
  },
  {
    id: 13,
    slug: 'major-13-death',
    nameKo: '죽음',
    nameEn: 'Death',
    numeral: 'XIII',
    symbol: '●',
    keywords: ['마무리', '변화', '재생'],
    message:
      '끝나는 것은 사라지는 게 아니라 자리를 비켜주는 겁니다. 오늘은 미련이 남은 무언가를 정리하기 좋은 날이에요. 비운 만큼 새것이 들어옵니다.',
    stone: 'onyx',
    stoneNote: '끝맺음과 새 국면을 지키는 보호의 돌',
  },
  {
    id: 14,
    slug: 'major-14-temperance',
    nameKo: '절제',
    nameEn: 'Temperance',
    numeral: 'XIV',
    symbol: '◈',
    keywords: ['조화', '절제', '치유'],
    message:
      '너무 뜨겁지도 차갑지도 않게, 오늘의 열쇠는 알맞음입니다. 서두른 만큼 되돌아오는 일이 있으니 속도를 고르게 유지하세요. 잘 섞이는 데는 시간이 필요합니다.',
    stone: 'amazonite',
    stoneNote: '치우침을 다스리는 조화의 돌',
  },
  {
    id: 15,
    slug: 'major-15-devil',
    nameKo: '악마',
    nameEn: 'The Devil',
    numeral: 'XV',
    symbol: '▼',
    keywords: ['집착', '자각', '해방'],
    message:
      '끊어야 하는 줄 알면서 붙잡고 있는 것이 있습니다. 오늘은 그 사슬이 사실 잠겨 있지 않다는 걸 알아차리는 날이에요. 벗어나는 첫걸음은 인정하는 것부터입니다.',
    stone: 'onyx',
    stoneNote: '집착을 끊어내는 정화와 보호의 돌',
  },
  {
    id: 16,
    slug: 'major-16-tower',
    nameKo: '탑',
    nameEn: 'The Tower',
    numeral: 'XVI',
    symbol: '✕',
    keywords: ['격변', '각성', '재건'],
    message:
      '무너지는 것은 애초에 흔들리고 있던 것들입니다. 놀랍고 아프지만 오늘의 균열이 당신을 더 안전한 자리로 옮겨 놓습니다. 지금은 나를 먼저 지키세요.',
    stone: 'onyx',
    stoneNote: '격변 속에서 나를 지켜주는 돌',
  },
  {
    id: 17,
    slug: 'major-17-star',
    nameKo: '별',
    nameEn: 'The Star',
    numeral: 'XVII',
    symbol: '★',
    keywords: ['희망', '치유', '소망'],
    message:
      '길고 어두운 시간을 지나온 당신에게 오늘은 숨 돌릴 자리가 주어집니다. 조용히 품어온 바람을 다시 꺼내 보세요. 회복은 이미 시작됐습니다.',
    stone: 'amazonite',
    stoneNote: '희망의 물빛을 닮은 치유의 돌',
  },
  {
    id: 18,
    slug: 'major-18-moon',
    nameKo: '달',
    nameEn: 'The Moon',
    numeral: 'XVIII',
    symbol: '○',
    keywords: ['불안', '직관', '무의식'],
    message:
      '보이는 것이 전부가 아닙니다. 오늘은 불안이 상황보다 크게 느껴지는 날이니 성급한 결론은 미뤄 두세요. 안개는 반드시 걷힙니다.',
    stone: 'amethyst',
    stoneNote: '불안을 가라앉히고 직관을 밝히는 돌',
  },
  {
    id: 19,
    slug: 'major-19-sun',
    nameKo: '태양',
    nameEn: 'The Sun',
    numeral: 'XIX',
    symbol: '◉',
    keywords: ['성공', '활력', '긍정'],
    message:
      '감출 것 없이 그대로 드러내도 좋은 날입니다. 오늘의 당신은 있는 그대로 환하고, 그 온기가 사람을 부릅니다. 좋은 소식은 밝은 곳에서 옵니다.',
    stone: 'citrine',
    stoneNote: '햇살의 활력과 긍정을 담은 돌',
  },
  {
    id: 20,
    slug: 'major-20-judgement',
    nameKo: '심판',
    nameEn: 'Judgement',
    numeral: 'XX',
    symbol: '☆',
    keywords: ['각성', '결산', '재도전'],
    message:
      '오래 미뤄둔 일이 당신을 다시 부릅니다. 오늘은 지난 시간을 탓하기보다 매듭을 짓는 쪽으로 마음을 쓰세요. 다시 시작할 자격은 이미 있습니다.',
    stone: 'lapis',
    stoneNote: '부름에 답하게 하는 각성의 돌',
  },
  {
    id: 21,
    slug: 'major-21-world',
    nameKo: '세계',
    nameEn: 'The World',
    numeral: 'XXI',
    symbol: '◆',
    keywords: ['완성', '성취', '통합'],
    message:
      '한 바퀴가 완성됩니다. 애쓴 시간이 하나의 모양으로 마무리되는 날이니 스스로에게 수고했다고 말해 주세요. 끝나는 자리에서 다음 문이 열립니다.',
    stone: 'clear-quartz',
    stoneNote: '완성과 통합, 모든 기운을 아우르는 돌',
  },
]

export const cardBySlug = (slug: string) => CARDS.find((c) => c.slug === slug)
export const cardById = (id: number) => CARDS.find((c) => c.id === id)

/** ?card= 쿼리 파싱. 범위를 벗어나면 특가 없음(undefined). */
export function parseCardId(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v)
  return Number.isInteger(n) && n >= 0 && n <= 21 ? n : undefined
}
