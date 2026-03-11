import tarotData from './tarot.json'

// ============ 牌组配置 ============

export interface DeckConfig {
  id: string
  name: string
  nameEn: string
  description: string
  hasImages: boolean
}

/** 可用牌组列表 */
export const DECKS: DeckConfig[] = [
  {
    id: '0',
    name: 'Emoji 牌组',
    nameEn: 'Emoji Deck',
    description: '使用 Emoji 符号表示的简约牌组',
    hasImages: false,
  },
  {
    id: '178',
    name: '莱德·韦特塔罗牌',
    nameEn: 'Rider-Waite Tarot',
    description: '1909 年经典版本，最广泛使用的塔罗牌',
    hasImages: true,
  },
]

/** 默认牌组 ID */
export const DEFAULT_DECK_ID = '178'

/** CDN 基础地址 */
const CDN_BASE = 'https://t.8s8s.com/photo/tarotphoto'

/**
 * 78 张塔罗牌英文名（0-77）
 * 0-21: 大阿尔卡纳
 * 22-35: 权杖 (Wands)
 * 36-49: 圣杯 (Cups)
 * 50-63: 宝剑 (Swords)
 * 64-77: 星币 (Pentacles)
 */
export const CARD_NAMES = [
  // 大阿尔卡纳 0-21
  'fool', 'magician', 'high-priestess', 'empress', 'emperor',
  'hierophant', 'lovers', 'chariot', 'strength', 'hermit',
  'fortune-wheel', 'justice', 'hanged-man', 'death', 'temperance',
  'devil', 'tower', 'stars', 'moon', 'sun', 'judgement', 'world',
  // 权杖 22-35
  'ace-wands', 'two-wands', 'three-wands', 'four-wands', 'five-wands',
  'six-wands', 'seven-wands', 'eight-wands', 'nine-wands', 'ten-wands',
  'page-wands', 'knight-wands', 'queen-wands', 'king-wands',
  // 圣杯 36-49
  'ace-cups', 'two-cups', 'three-cups', 'four-cups', 'five-cups',
  'six-cups', 'seven-cups', 'eight-cups', 'nine-cups', 'ten-cups',
  'page-cups', 'knight-cups', 'queen-cups', 'king-cups',
  // 宝剑 50-63
  'ace-swords', 'two-swords', 'three-swords', 'four-swords', 'five-swords',
  'six-swords', 'seven-swords', 'eight-swords', 'nine-swords', 'ten-swords',
  'page-swords', 'knight-swords', 'queen-swords', 'king-swords',
  // 星币 64-77
  'ace-pentacles', 'two-pentacles', 'three-pentacles', 'four-pentacles', 'five-pentacles',
  'six-pentacles', 'seven-pentacles', 'eight-pentacles', 'nine-pentacles', 'ten-pentacles',
  'page-pentacles', 'knight-pentacles', 'queen-pentacles', 'king-pentacles',
] as const

/**
 * 根据卡牌序号获取英文名
 */
export function getCardEnglishName(cardIndex: number): string {
  return CARD_NAMES[cardIndex] || 'unknown'
}

/**
 * 获取卡牌图片文件名
 */
export function getCardFilename(cardIndex: number): string {
  const paddedIndex = String(cardIndex).padStart(2, '0')
  return `${paddedIndex}-${getCardEnglishName(cardIndex)}.jpg`
}

/**
 * 获取卡牌图片 URL（CDN）
 */
export function getCardCdnUrl(cardIndex: number, deckId = DEFAULT_DECK_ID): string {
  return `${CDN_BASE}/${deckId}/${getCardEnglishName(cardIndex)}.jpg`
}

/**
 * 获取牌组配置
 */
export function getDeckConfig(deckId: string): DeckConfig | undefined {
  return DECKS.find(d => d.id === deckId)
}

// ============ 卡牌数据类型 ============

export interface TarotCard {
  id: string
  number?: string
  name: string
  nameEn: string
  keywords: string
  symbol: string
  upright: string
  reversed: string
  description?: string
  note?: string
  zodiac?: string
}

export interface MinorArcanaCard {
  id: string
  suit: Suit
  rank: number | CourtRank
  name: string
  nameEn: string
  keywords: string
  symbol: string
  upright: string
  reversed: string
  description?: string
  note?: string
}

export interface SpreadPosition {
  name: string
  row: number
  col: number
}

export interface SpreadConfig {
  name: string
  description: string
  positions: SpreadPosition[]
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean
  position: string
  row: number
  col: number
}

export type SpreadType = 1 | 3 | 5
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type CourtRank = 'page' | 'knight' | 'queen' | 'king'

export interface SuitConfig {
  name: string
  nameEn: string
  element: string
  symbol: string
  domain: string
  zodiac: string
}

export const config = tarotData.config
export const spreads = tarotData.spreads as Record<string, SpreadConfig>
export const tips = tarotData.tips
export const majorArcana = tarotData.majorArcana as TarotCard[]
export const suits = tarotData.suits as Record<Suit, SuitConfig>
export const minorArcana = tarotData.minorArcana as Record<Suit, MinorArcanaCard[]>

export const REVERSED_PROBABILITY = config.reversedProbability

export function getSpreadConfig(type: SpreadType): SpreadConfig {
  return spreads[String(type)]
}

export function getSpreadPositions(type: SpreadType): SpreadPosition[] {
  return spreads[String(type)]?.positions || []
}

export function getAllMinorArcana(): MinorArcanaCard[] {
  return [
    ...minorArcana.wands,
    ...minorArcana.cups,
    ...minorArcana.swords,
    ...minorArcana.pentacles
  ]
}

export function getMinorArcanaBySuit(suit: Suit): MinorArcanaCard[] {
  return minorArcana[suit] || []
}

export function getAllCards(): TarotCard[] {
  const minorCards = getAllMinorArcana().map(card => ({
    ...card,
    number: typeof card.rank === 'number' ? String(card.rank) : card.rank
  }))
  return [...majorArcana, ...minorCards]
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function drawCards(count: SpreadType, useFullDeck = false): DrawnCard[] {
  const deck = useFullDeck ? getAllCards() : majorArcana
  const shuffled = shuffle(deck)
  const positions = getSpreadPositions(count)
  
  return shuffled.slice(0, count).map((card, i) => ({
    ...card,
    isReversed: Math.random() < REVERSED_PROBABILITY,
    position: positions[i].name,
    row: positions[i].row,
    col: positions[i].col
  }))
}

export function generateSummary(cards: DrawnCard[], spreadType: SpreadType): string {
  if (cards.length === 0) return ''
  
  if (spreadType === 1) {
    const card = cards[0]
    let text = `今日的指引是「${card.name}」${card.isReversed ? '（逆位）' : ''}。`
    text += card.isReversed 
      ? `这张牌提醒你注意：${card.reversed.split('、')[0]}。今天可能需要反思${card.keywords.split('、')[0]}相关的问题。`
      : `这是一个关于${card.keywords}的信息。今天适合${card.upright.split('、')[0]}。`
    return text
  } else if (spreadType === 3) {
    let text = `从过去到未来的能量流动来看：`
    text += `过去的「${cards[0].name}」${cards[0].isReversed ? '（逆位）' : ''}影响了你的现状，`
    text += `目前「${cards[1].name}」${cards[1].isReversed ? '（逆位）' : ''}是你面对的核心课题，`
    text += `而「${cards[2].name}」${cards[2].isReversed ? '（逆位）' : ''}指向了未来的发展方向。`
    return text
  } else if (spreadType === 5) {
    let text = `五牌阵揭示了完整的能量图景：`
    text += `你目前的状态是「${cards[0].name}」，面临的挑战是「${cards[1].name}」。`
    text += `过去的「${cards[2].name}」为现在奠定了基础，`
    text += `未来将朝「${cards[3].name}」的方向发展。`
    text += `综合来看，「${cards[4].name}」是给你的核心建议。`
    return text
  }
  return ''
}
