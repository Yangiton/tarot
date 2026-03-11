import { computed } from 'vue'
import { useStorage, useCounter } from '@vueuse/core'
import { 
  type DrawnCard, 
  type SpreadType, 
  drawCards as drawCardsUtil, 
  generateSummary,
  getSpreadConfig,
  DEFAULT_DECK_ID
} from '@/data'
import type { HoloType } from '@/directives/vHoloFoil'

const currentSpread = useStorage<SpreadType>('tarot-spread', 3)
const drawnCards = useStorage<DrawnCard[]>('tarot-cards', [])
const holoType = useStorage<HoloType>('tarot-holo-type', 'normal')
const currentDeckId = useStorage<string>('tarot-deck-id', DEFAULT_DECK_ID)
const { count: flippedCount, inc: incFlipped, reset: resetFlipped } = useCounter(0)

export function useTarot() {
  const isDrawn = computed(() => drawnCards.value.length > 0)
  const allFlipped = computed(() => isDrawn.value && flippedCount.value >= drawnCards.value.length)
  const summary = computed(() => generateSummary(drawnCards.value, currentSpread.value))
  const spreadConfig = computed(() => getSpreadConfig(currentSpread.value))

  const selectSpread = (count: SpreadType) => {
    if (currentSpread.value !== count) {
      currentSpread.value = count
      // 切换牌阵时自动重置
      drawnCards.value = []
      resetFlipped()
    }
  }

  const drawCards = () => {
    drawnCards.value = drawCardsUtil(currentSpread.value)
    resetFlipped()
  }

  const flipCard = () => {
    incFlipped()
  }

  const resetReading = () => {
    drawnCards.value = []
    resetFlipped()
  }

  const setHoloType = (type: HoloType) => {
    holoType.value = type
  }

  const setDeckId = (deckId: string) => {
    currentDeckId.value = deckId
  }

  return {
    currentSpread,
    drawnCards,
    flippedCount,
    holoType,
    currentDeckId,
    isDrawn,
    allFlipped,
    summary,
    spreadConfig,
    selectSpread,
    drawCards,
    flipCard,
    resetReading,
    setHoloType,
    setDeckId
  }
}
