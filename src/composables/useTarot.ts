import { computed } from 'vue'
import { useStorage, useCounter } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  type DrawnCard,
  type SpreadType,
  drawCards as drawCardsUtil,
  generateSummary,
  DEFAULT_DECK_ID,
  useCardData,
} from '@/data'
import type { HoloType } from '@/directives/vHoloFoil'

const currentSpread = useStorage<SpreadType>('tarot-spread', 3)
const drawnCards = useStorage<DrawnCard[]>('tarot-cards', [])
const holoType = useStorage<HoloType>('tarot-holo-type', 'normal')
const currentDeckId = useStorage<string>('tarot-deck-id', DEFAULT_DECK_ID)
const useFullDeck = useStorage<boolean>('tarot-use-full-deck', false)
const { count: flippedCount, inc: incFlipped, reset: resetFlipped } = useCounter(0)

export function useTarot() {
  const { locale } = useI18n()
  const {
    spreads,
    tips,
    suits,
    majorArcana,
    minorArcana,
    getSpreadConfig,
    getAllMinorArcana,
    getAllCards,
  } = useCardData()

  const isDrawn = computed(() => drawnCards.value.length > 0)
  const allFlipped = computed(() => isDrawn.value && flippedCount.value >= drawnCards.value.length)
  const summary = computed(() =>
    generateSummary(drawnCards.value, currentSpread.value, locale.value)
  )
  const spreadConfig = computed(() => getSpreadConfig(currentSpread.value))

  const selectSpread = (count: SpreadType) => {
    if (currentSpread.value !== count) {
      currentSpread.value = count
      drawnCards.value = []
      resetFlipped()
    }
  }

  const drawCards = () => {
    drawnCards.value = drawCardsUtil(currentSpread.value, useFullDeck.value, locale.value)
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

  const setUseFullDeck = (value: boolean) => {
    useFullDeck.value = value
    drawnCards.value = []
    resetFlipped()
  }

  return {
    currentSpread,
    drawnCards,
    flippedCount,
    holoType,
    currentDeckId,
    useFullDeck,
    isDrawn,
    allFlipped,
    summary,
    spreadConfig,
    spreads,
    tips,
    suits,
    majorArcana,
    minorArcana,
    getAllMinorArcana,
    getAllCards,
    selectSpread,
    drawCards,
    flipCard,
    resetReading,
    setHoloType,
    setDeckId,
    setUseFullDeck,
  }
}
