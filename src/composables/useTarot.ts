import { computed } from 'vue'
import { useStorage, useCounter } from '@vueuse/core'
import { 
  type DrawnCard, 
  type SpreadType, 
  drawCards as drawCardsUtil, 
  generateSummary,
  getSpreadConfig
} from '@/data'

const currentSpread = useStorage<SpreadType>('tarot-spread', 3)
const drawnCards = useStorage<DrawnCard[]>('tarot-cards', [])
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

  return {
    currentSpread,
    drawnCards,
    flippedCount,
    isDrawn,
    allFlipped,
    summary,
    spreadConfig,
    selectSpread,
    drawCards,
    flipCard,
    resetReading
  }
}
