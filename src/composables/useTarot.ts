import { ref, computed } from 'vue'
import { 
  type DrawnCard, 
  type SpreadType, 
  drawCards as drawCardsUtil, 
  generateSummary,
  getSpreadPositions
} from '@/data'

const currentSpread = ref<SpreadType>(3)
const drawnCards = ref<DrawnCard[]>([])
const flippedCount = ref(0)

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
    flippedCount.value = 0
  }

  const flipCard = () => {
    flippedCount.value++
  }

  const resetReading = () => {
    drawnCards.value = []
    flippedCount.value = 0
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
