import tarotData from './tarot.json'

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

export interface DrawnCard extends TarotCard {
  isReversed: boolean
  position: string
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
export const spreads = tarotData.spreads as Record<string, string[]>
export const tips = tarotData.tips
export const majorArcana = tarotData.majorArcana as TarotCard[]
export const suits = tarotData.suits as Record<Suit, SuitConfig>
export const minorArcana = tarotData.minorArcana as Record<Suit, MinorArcanaCard[]>

export const REVERSED_PROBABILITY = config.reversedProbability

export function getSpreadPositions(type: SpreadType): string[] {
  return spreads[String(type)] || []
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
    position: positions[i]
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
