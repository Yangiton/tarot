/**
 * useTarot - 塔罗牌应用核心状态管理
 *
 * 功能：
 * 1. 管理牌阵、抽牌、翻牌状态
 * 2. 持久化存储（localStorage）
 * 3. 全息效果和牌组设置
 *
 * 使用 useStorage 持久化的数据：
 * - currentSpread: 当前牌阵类型 (1/3/5)
 * - drawnCards: 已抽取的卡牌数组
 * - holoPreset: 全息效果预设 ID
 * - currentDeckId: 当前牌组 ID
 * - useFullDeck: 是否使用完整牌组（含小阿尔卡纳）
 */
import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  type DrawnCard,
  type DrawnCardRef,
  type SpreadType,
  type ReversedMode,
  drawCardsRef,
  generateSummary,
  getReversedProbability,
  DEFAULT_DECK_ID,
  DEFAULT_REVERSED_MODE,
  useCardData,
} from '@/data'

// ========== 持久化状态（模块级别，确保单例） ==========

const currentSpread = useStorage<SpreadType>('tarot-spread', 3)
/** 抽牌结果（语言无关，只存 id + 状态） */
const drawnCardRefs = useStorage<DrawnCardRef[]>('tarot-card-refs', [])
const flippedCardIds = useStorage<Set<string>>('tarot-flipped-ids', new Set(), localStorage, {
  serializer: {
    read: (v: string) => new Set(JSON.parse(v || '[]')),
    write: (v: Set<string>) => JSON.stringify([...v]),
  },
})
const holoPreset = useStorage<string>('tarot-holo-preset', 'normal')
const currentDeckId = useStorage<string>('tarot-deck-id', DEFAULT_DECK_ID)
const useFullDeck = useStorage<boolean>('tarot-use-full-deck', false)
const reversedMode = useStorage<ReversedMode>('tarot-reversed-mode', DEFAULT_REVERSED_MODE)

// 翻牌计数器（基于持久化的 flippedCardIds）
const flippedCount = computed(() => flippedCardIds.value.size)

/**
 * 验证 DrawnCardRef 数据结构
 */
function isValidDrawnCardRef(card: unknown): card is DrawnCardRef {
  if (!card || typeof card !== 'object') return false
  const c = card as Record<string, unknown>
  return (
    typeof c.id === 'string' &&
    typeof c.isReversed === 'boolean' &&
    typeof c.positionIndex === 'number' &&
    typeof c.row === 'number' &&
    typeof c.col === 'number'
  )
}

// 初始化时验证存储的数据
watch(
  () => drawnCardRefs.value,
  cards => {
    if (cards && cards.length > 0) {
      const validCards = cards.filter(isValidDrawnCardRef)
      if (validCards.length !== cards.length) {
        console.warn(`[useTarot] 检测到无效卡牌数据，已清理`)
        drawnCardRefs.value = validCards
      }
    }
  },
  { immediate: true }
)

export function useTarot() {
  const { locale } = useI18n({ useScope: 'global' })
  const {
    spreads,
    tips,
    suits,
    majorArcana,
    minorArcana,
    getSpreadConfig,
    getPositionName,
    getAllMinorArcana,
    getAllCards,
    getCardById,
  } = useCardData()

  // ========== 计算属性 ==========

  /** 是否已抽牌 */
  const isDrawn = computed(() => drawnCardRefs.value.length > 0)

  /** 是否所有牌都已翻开 */
  const allFlipped = computed(
    () => isDrawn.value && flippedCount.value >= drawnCardRefs.value.length
  )

  /**
   * 展示用的卡牌数据（响应式多语言）
   * 根据 drawnCardRefs 中的 id 查询当前语言的完整卡牌信息
   */
  const drawnCards = computed<DrawnCard[]>(() => {
    return drawnCardRefs.value.map(ref => {
      const card = getCardById(ref.id)
      if (!card) {
        return {
          id: ref.id,
          name: ref.id,
          nameEn: ref.id,
          keywords: '',
          symbol: '❓',
          upright: '',
          reversed: '',
          isReversed: ref.isReversed,
          position: getPositionName(currentSpread.value, ref.positionIndex),
          row: ref.row,
          col: ref.col,
        }
      }
      return {
        ...card,
        number: 'number' in card ? card.number : 'rank' in card ? String(card.rank) : undefined,
        isReversed: ref.isReversed,
        position: getPositionName(currentSpread.value, ref.positionIndex),
        row: ref.row,
        col: ref.col,
      }
    })
  })

  /** 解读摘要 */
  const summary = computed(() =>
    generateSummary(drawnCards.value, currentSpread.value, locale.value)
  )

  /** 当前牌阵配置 */
  const spreadConfig = computed(() => getSpreadConfig(currentSpread.value))

  // ========== 操作方法 ==========

  /** 选择牌阵类型 */
  const selectSpread = (count: SpreadType) => {
    if (currentSpread.value !== count) {
      currentSpread.value = count
      drawnCardRefs.value = []
      flippedCardIds.value = new Set()
    }
  }

  /** 执行抽牌 */
  const drawCards = () => {
    const probability = getReversedProbability(reversedMode.value)
    drawnCardRefs.value = drawCardsRef(currentSpread.value, useFullDeck.value, probability)
    flippedCardIds.value = new Set()
  }

  /** 翻开一张牌 */
  const flipCard = (cardId?: string) => {
    if (cardId) {
      const newSet = new Set(flippedCardIds.value)
      newSet.add(cardId)
      flippedCardIds.value = newSet
    }
  }

  /** 检查卡牌是否已翻开 */
  const isCardFlipped = (cardId: string) => {
    return flippedCardIds.value.has(cardId)
  }

  /** 重置阅读（清空抽牌结果） */
  const resetReading = () => {
    drawnCardRefs.value = []
    flippedCardIds.value = new Set()
  }

  /** 设置全息效果预设 */
  const setHoloPreset = (preset: string) => {
    holoPreset.value = preset
  }

  /** 设置牌组 ID */
  const setDeckId = (deckId: string) => {
    currentDeckId.value = deckId
  }

  /** 设置是否使用完整牌组 */
  const setUseFullDeck = (value: boolean) => {
    useFullDeck.value = value
    drawnCardRefs.value = []
    flippedCardIds.value = new Set()
  }

  /** 设置逆位模式 */
  const setReversedMode = (mode: ReversedMode) => {
    reversedMode.value = mode
  }

  return {
    // 状态
    currentSpread,
    drawnCards,
    flippedCount,
    flippedCardIds,
    holoPreset,
    currentDeckId,
    useFullDeck,
    reversedMode,

    // 计算属性
    isDrawn,
    allFlipped,
    summary,
    spreadConfig,

    // 数据
    spreads,
    tips,
    suits,
    majorArcana,
    minorArcana,
    getAllMinorArcana,
    getAllCards,

    // 方法
    selectSpread,
    drawCards,
    flipCard,
    isCardFlipped,
    resetReading,
    setHoloPreset,
    setDeckId,
    setUseFullDeck,
    setReversedMode,
  }
}
