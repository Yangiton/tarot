import { computed } from 'vue'
import { useStorage, useCounter } from '@vueuse/core'
import { 
  type DrawnCard, 
  type SpreadType, 
  drawCards as drawCardsUtil, 
  generateSummary,
  getSpreadPositions
} from '@/data'

const currentSpread = useStorage<SpreadType>('tarot-spread', 3)
const drawnCards = useStorage<DrawnCard[]>('tarot-cards', [])
const { count: flippedCount, inc: incFlipped, reset: resetFlipped } = useCounter(0)

export function useTarot() {
  const isDrawn = computed(() => drawnCards.value.length > 0)
  const allFlipped = computed(() => isDrawn.value && flippedCount.value >= drawnCards.value.length)
  const summary = computed(() => generateSummary(drawnCards.value, currentSpread.value))
  const positions = computed(() => getSpreadPositions(currentSpread.value))

  const selectSpread = (count: SpreadType) => {
    currentSpread.value = count
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
    positions,
    selectSpread,
    drawCards,
    flipCard,
    resetReading
  }
}
