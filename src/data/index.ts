import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import baseConfig from './tarot-base.json'
import zhCards from '@/i18n/locales/cards/zh.json'
import enCards from '@/i18n/locales/cards/en.json'

// 导入牌组元数据
import chineseMeta from '@/assets/tarot/chinese/meta.json'
import riderMeta from '@/assets/tarot/rider/meta.json'

// ============ 牌组配置 ============

export interface DeckMeta {
  id: string
  source: string
  width: number
  height: number
  /** 宽高比 (width / height)，数字类型 */
  aspectRatio: number
}

export interface DeckConfig {
  id: string
  hasImages: boolean
  meta?: DeckMeta
}

export interface DeckDisplayConfig extends DeckConfig {
  name: string
  description: string
  aspectRatio: number
}

/** 牌组元数据映射 */
const DECK_META: Record<string, DeckMeta> = {
  chinese: chineseMeta as DeckMeta,
  rider: riderMeta as DeckMeta,
}

/** 可用牌组 ID 列表（静态配置） */
export const DECK_IDS: DeckConfig[] = [
  { id: 'emoji', hasImages: false },
  { id: 'chinese', hasImages: true, meta: DECK_META.chinese },
  { id: 'rider', hasImages: true, meta: DECK_META.rider },
]

/** 默认牌组 ID */
export const DEFAULT_DECK_ID = 'rider'

/** 默认卡牌宽高比 (标准韦特: 199/340) */
export const DEFAULT_ASPECT_RATIO = 0.585

/** 获取牌组配置（需要在 setup 中调用以获取翻译） */
export function useDeckConfig() {
  const { t } = useI18n({ useScope: 'global' })

  const decks = computed(() =>
    DECK_IDS.map(deck => ({
      ...deck,
      name: t(`decks.${deck.id}.name`),
      description: t(`decks.${deck.id}.description`),
      aspectRatio: deck.meta?.aspectRatio ?? DEFAULT_ASPECT_RATIO,
    }))
  )

  const getDeckConfig = (deckId: string) => {
    return decks.value.find(d => d.id === deckId)
  }

  const getDeckAspectRatio = (deckId: string): number => {
    const deck = DECK_IDS.find(d => d.id === deckId)
    return deck?.meta?.aspectRatio ?? DEFAULT_ASPECT_RATIO
  }

  return { decks, getDeckConfig, getDeckAspectRatio }
}

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
  'fool',
  'magician',
  'high-priestess',
  'empress',
  'emperor',
  'hierophant',
  'lovers',
  'chariot',
  'strength',
  'hermit',
  'fortune-wheel',
  'justice',
  'hanged-man',
  'death',
  'temperance',
  'devil',
  'tower',
  'stars',
  'moon',
  'sun',
  'judgement',
  'world',
  // 权杖 22-35
  'ace-wands',
  'two-wands',
  'three-wands',
  'four-wands',
  'five-wands',
  'six-wands',
  'seven-wands',
  'eight-wands',
  'nine-wands',
  'ten-wands',
  'page-wands',
  'knight-wands',
  'queen-wands',
  'king-wands',
  // 圣杯 36-49
  'ace-cups',
  'two-cups',
  'three-cups',
  'four-cups',
  'five-cups',
  'six-cups',
  'seven-cups',
  'eight-cups',
  'nine-cups',
  'ten-cups',
  'page-cups',
  'knight-cups',
  'queen-cups',
  'king-cups',
  // 宝剑 50-63
  'ace-swords',
  'two-swords',
  'three-swords',
  'four-swords',
  'five-swords',
  'six-swords',
  'seven-swords',
  'eight-swords',
  'nine-swords',
  'ten-swords',
  'page-swords',
  'knight-swords',
  'queen-swords',
  'king-swords',
  // 星币 64-77
  'ace-pentacles',
  'two-pentacles',
  'three-pentacles',
  'four-pentacles',
  'five-pentacles',
  'six-pentacles',
  'seven-pentacles',
  'eight-pentacles',
  'nine-pentacles',
  'ten-pentacles',
  'page-pentacles',
  'knight-pentacles',
  'queen-pentacles',
  'king-pentacles',
] as const

/** 根据语言环境获取关键词分隔符 */
export function getKeywordSeparator(locale: string): string {
  return locale === 'zh' ? '、' : ', '
}

/** 分割关键词字符串为数组 */
export function splitKeywords(keywords: string, locale: string): string[] {
  const sep = getKeywordSeparator(locale)
  return keywords
    .split(sep)
    .map(k => k.trim())
    .filter(Boolean)
}

export function getCardEnglishName(cardIndex: number): string {
  return CARD_NAMES[cardIndex] || 'unknown'
}

export function getCardFilename(cardIndex: number): string {
  const paddedIndex = String(cardIndex).padStart(2, '0')
  return `${paddedIndex}-${getCardEnglishName(cardIndex)}.jpg`
}

/** 获取牌组静态配置（仅 hasImages，不含翻译） */
export function getDeckStaticConfig(deckId: string): DeckConfig | undefined {
  return DECK_IDS.find(d => d.id === deckId)
}

// ============ 卡牌数据类型 ============

/** 卡牌基础字段 - TarotCard 和 MinorArcanaCard 共用 */
export interface BaseCard {
  id: string
  name: string
  nameEn: string
  keywords: string
  symbol: string
  upright: string
  reversed: string
  description?: string
  note?: string
}

/** 大阿尔卡纳卡牌 */
export interface TarotCard extends BaseCard {
  number?: string
  zodiac?: string
}

/** 小阿尔卡纳卡牌 */
export interface MinorArcanaCard extends BaseCard {
  suit: Suit
  rank: number | CourtRank
}

/** 统一的卡牌展示类型 - 用于 Library 等需要同时处理大小阿尔卡纳的场景 */
export type DisplayCard = TarotCard | MinorArcanaCard

/** 类型守卫：判断是否为小阿尔卡纳 */
export function isMinorArcana(card: DisplayCard): card is MinorArcanaCard {
  return 'suit' in card && 'rank' in card
}

/** 获取卡牌编号（用于显示） */
export function getCardNumber(card: DisplayCard): string | undefined {
  if (isMinorArcana(card)) {
    return String(card.rank)
  }
  return (card as TarotCard).number
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

// ============ 多语言数据层 ============

const cardDataMap: Record<string, typeof zhCards> = { zh: zhCards, en: enCards }

function getCardData(locale: string) {
  return cardDataMap[locale] || cardDataMap.en
}

/** 获取当前语言的配置（非响应式，用于初始化/静态场景） */
export function getStaticCardData(locale: string) {
  const data = getCardData(locale)
  return {
    spreads: data.spreads as Record<string, SpreadConfig>,
    tips: data.tips as { text: string }[],
    suits: data.suits as Record<Suit, SuitConfig>,
    majorArcana: data.majorArcana as TarotCard[],
    minorArcana: data.minorArcana as Record<Suit, MinorArcanaCard[]>,
  }
}

/**
 * 响应式牌义数据 composable，根据 vue-i18n locale 自动切换
 * 需在 setup 中调用
 */
export function useCardData() {
  const { locale } = useI18n({ useScope: 'global' })

  const cardData = computed(() => getCardData(locale.value))
  const spreads = computed(() => cardData.value.spreads as Record<string, SpreadConfig>)
  const tips = computed(() => cardData.value.tips as { text: string }[])
  const suits = computed(() => cardData.value.suits as Record<Suit, SuitConfig>)
  const majorArcana = computed(() => cardData.value.majorArcana as TarotCard[])
  const minorArcana = computed(() => cardData.value.minorArcana as Record<Suit, MinorArcanaCard[]>)

  const getSpreadConfig = (type: SpreadType): SpreadConfig => {
    return spreads.value[String(type)]
  }

  const getSpreadPositions = (type: SpreadType): SpreadPosition[] => {
    return spreads.value[String(type)]?.positions || []
  }

  const getAllMinorArcana = (): MinorArcanaCard[] => {
    const m = minorArcana.value
    return [...m.wands, ...m.cups, ...m.swords, ...m.pentacles]
  }

  const getMinorArcanaBySuit = (suit: Suit): MinorArcanaCard[] => {
    return minorArcana.value[suit] || []
  }

  const getAllCards = (): TarotCard[] => {
    const minorCards = getAllMinorArcana().map(card => ({
      ...card,
      number: typeof card.rank === 'number' ? String(card.rank) : card.rank,
    }))
    return [...majorArcana.value, ...minorCards]
  }

  return {
    locale,
    spreads,
    tips,
    suits,
    majorArcana,
    minorArcana,
    getSpreadConfig,
    getSpreadPositions,
    getAllMinorArcana,
    getMinorArcanaBySuit,
    getAllCards,
  }
}

// ============ 逆位模式配置 ============

/** 逆位模式 ID */
export type ReversedMode = 'classic' | 'light' | 'heavy' | 'minimal'

/** 逆位模式配置 */
export interface ReversedModeConfig {
  id: ReversedMode
  probability: number
  nameKey: string
  descKey: string
}

/** 逆位模式列表 */
export const REVERSED_MODES: ReversedModeConfig[] = [
  { id: 'classic', probability: 0.5, nameKey: 'settings.reversedModes.classic', descKey: 'settings.reversedModes.classicDesc' },
  { id: 'light', probability: 0.3, nameKey: 'settings.reversedModes.light', descKey: 'settings.reversedModes.lightDesc' },
  { id: 'heavy', probability: 0.7, nameKey: 'settings.reversedModes.heavy', descKey: 'settings.reversedModes.heavyDesc' },
  { id: 'minimal', probability: 0.1, nameKey: 'settings.reversedModes.minimal', descKey: 'settings.reversedModes.minimalDesc' },
]

/** 默认逆位模式 */
export const DEFAULT_REVERSED_MODE: ReversedMode = 'classic'

/** 获取逆位概率 */
export function getReversedProbability(mode: ReversedMode): number {
  return REVERSED_MODES.find(m => m.id === mode)?.probability ?? 0.5
}

/** 旧版兼容：默认逆位概率（经典模式 50%） */
export const REVERSED_PROBABILITY = baseConfig.config.reversedProbability

// ============ 抽牌与摘要逻辑 ============

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function drawCards(
  count: SpreadType,
  useFullDeck: boolean,
  locale: string,
  reversedProbability: number = 0.5
): DrawnCard[] {
  const data = getStaticCardData(locale)
  const deck = useFullDeck
    ? [
        ...data.majorArcana,
        ...Object.values(data.minorArcana)
          .flat()
          .map(card => ({
            ...card,
            number: typeof card.rank === 'number' ? String(card.rank) : card.rank,
          })),
      ]
    : data.majorArcana
  const shuffled = shuffle(deck)
  const positions = data.spreads[String(count)]?.positions || []

  return shuffled.slice(0, count).map((card, i) => ({
    ...card,
    isReversed: Math.random() < reversedProbability,
    position: positions[i]?.name || '',
    row: positions[i]?.row || 0,
    col: positions[i]?.col || 0,
  }))
}

export function generateSummary(
  cards: DrawnCard[],
  spreadType: SpreadType,
  locale: string
): string {
  if (cards.length === 0) return ''

  if (locale === 'zh') {
    return generateSummaryZh(cards, spreadType)
  }
  return generateSummaryEn(cards, spreadType)
}

function generateSummaryZh(cards: DrawnCard[], spreadType: SpreadType): string {
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

function generateSummaryEn(cards: DrawnCard[], spreadType: SpreadType): string {
  if (spreadType === 1) {
    const card = cards[0]
    const kw = card.keywords.split(', ')[0] || card.keywords
    let text = `Today's guidance is "${card.name}"${card.isReversed ? ' (Reversed)' : ''}.`
    text += card.isReversed
      ? ` This card reminds you to be mindful of: ${card.reversed.split(', ')[0]}. Today may require reflection on ${kw}-related matters.`
      : ` This is a message about ${card.keywords}. Today is a good day for ${card.upright.split(', ')[0]}.`
    return text
  } else if (spreadType === 3) {
    let text = `Looking at the energy flow from past to future: `
    text += `"${cards[0].name}"${cards[0].isReversed ? ' (Reversed)' : ''} from the past has influenced your current situation. `
    text += `"${cards[1].name}"${cards[1].isReversed ? ' (Reversed)' : ''} is the core challenge you face now. `
    text += `"${cards[2].name}"${cards[2].isReversed ? ' (Reversed)' : ''} points to the direction of future development.`
    return text
  } else if (spreadType === 5) {
    let text = `The five-card spread reveals the complete energy landscape: `
    text += `Your current state is "${cards[0].name}", the challenge is "${cards[1].name}". `
    text += `"${cards[2].name}" from the past laid the groundwork, `
    text += `and the future moves toward "${cards[3].name}". `
    text += `Overall, "${cards[4].name}" is the core advice for you.`
    return text
  }
  return ''
}
