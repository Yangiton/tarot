<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Motion, AnimatePresence } from 'motion-v'
import { X, ChevronLeft } from 'lucide-vue-next'
import {
  type TarotCard,
  type MinorArcanaCard,
  type Suit,
  useDeckConfig,
  splitKeywords,
} from '@/data'
import { getCardImageUrl, isImageDeck } from '@/data/card-images'
import { useI18n } from 'vue-i18n'
import { useTarot } from '@/composables/useTarot'
import { vHoloFoil } from '@/directives/vHoloFoil'
import TarotCardComponent from '@/components/tarot/TarotCard.vue'
import DeckCover from '@/components/deck/DeckCover.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const {
  holoType,
  majorArcana,
  minorArcana,
  suits,
  currentDeckId: globalDeckId,
  setDeckId,
} = useTarot()
const { decks, getDeckConfig, getDeckAspectRatio } = useDeckConfig()

// 从路由参数获取当前牌组 ID
const selectedDeckId = computed(() => (route.params.deckId as string) || null)

// 卡牌详情弹窗
const selectedCard = ref<TarotCard | MinorArcanaCard | null>(null)

// 路由刚进入牌组详情时的时间戳，用于忽略随后几百毫秒内的“合成点击”穿透
const deckDetailEnteredAt = ref<number>(0)
watch(
  () => route.params.deckId,
  deckId => {
    if (deckId) deckDetailEnteredAt.value = Date.now()
  },
  { immediate: true }
)

// 当前牌组配置
const currentDeck = computed(() =>
  selectedDeckId.value ? getDeckConfig(selectedDeckId.value) : null
)
const currentAspectRatio = computed(() =>
  selectedDeckId.value ? getDeckAspectRatio(selectedDeckId.value) : 0.585
)
const useImages = computed(() => (selectedDeckId.value ? isImageDeck(selectedDeckId.value) : false))

// 花色顺序
const suitOrder: Suit[] = ['wands', 'cups', 'swords', 'pentacles']

// 选择牌组进入详情（通过路由跳转）
const selectDeck = (deckId: string) => {
  router.push(`/library/${deckId}`)
}

// 返回牌组列表
const backToList = () => {
  router.push('/library')
}

// 设置默认牌组
const handleSetDefault = (deckId: string) => {
  setDeckId(deckId)
}

// 打开卡牌详情（路由刚切换后 400ms 内忽略，防止移动端合成点击穿透）
const OPEN_GUARD_MS = 400
const openCard = (card: TarotCard | MinorArcanaCard) => {
  if (deckDetailEnteredAt.value && Date.now() - deckDetailEnteredAt.value < OPEN_GUARD_MS) return
  selectedCard.value = card
}

const closeCard = () => {
  selectedCard.value = null
}

// 将 MinorArcanaCard 转换为兼容 TarotCard 的格式
const toDisplayCard = (card: MinorArcanaCard): TarotCard & MinorArcanaCard => {
  return {
    ...card,
    number: String(card.rank),
  } as TarotCard & MinorArcanaCard
}

/**
 * 根据卡片获取图片索引 (0-77)
 */
const getCardIndex = (card: TarotCard | MinorArcanaCard): number => {
  const id = card.id

  if (id.startsWith('major-')) {
    const num = parseInt(id.replace('major-', ''), 10)
    return isNaN(num) ? 0 : num
  }

  const match = id.match(/^minor-(\w+)-(.+)$/)
  if (match) {
    const suit = match[1] as Suit
    const rankStr = match[2]
    const suitOffset: Record<Suit, number> = {
      wands: 22,
      cups: 36,
      swords: 50,
      pentacles: 64,
    }
    const courtRanks: Record<string, number> = {
      page: 11,
      knight: 12,
      queen: 13,
      king: 14,
    }
    const rank = courtRanks[rankStr] || parseInt(rankStr, 10)
    return (suitOffset[suit] || 22) + rank - 1
  }

  return 0
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-3 md:py-4 px-4 border-b border-gold/15">
      <div class="flex items-center justify-center gap-2">
        <!-- 返回按钮（在牌组详情时显示） -->
        <button
          v-if="selectedDeckId"
          class="absolute left-4 flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
          @click="backToList"
        >
          <ChevronLeft class="w-4 h-4" />
          <span class="text-xs hidden sm:inline">{{ $t('library.backToDecks') }}</span>
        </button>

        <h1 class="text-base md:text-xl font-bold gold-title">
          {{ selectedDeckId ? currentDeck?.name : $t('library.title') }}
        </h1>
      </div>
      <p class="text-muted-foreground text-[10px] md:text-xs mt-0.5">
        {{ selectedDeckId ? currentDeck?.description : $t('library.subtitle') }}
      </p>
    </header>

    <!-- 牌组列表视图 -->
    <div v-if="!selectedDeckId" class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-6">
      <div class="max-w-4xl mx-auto">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4 }"
        >
          <div class="deck-grid">
            <DeckCover
              v-for="deck in decks"
              :key="deck.id"
              :deck="deck"
              :selected="deck.id === globalDeckId"
              @select="selectDeck"
              @set-default="handleSetDefault"
            />
          </div>
        </Motion>
      </div>
    </div>

    <!-- 牌组详情视图（78张牌） -->
    <div v-else class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-4 md:py-6">
      <div class="max-w-4xl mx-auto">
        <!-- Major Arcana Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4 }"
        >
          <section class="mb-8">
            <h2 class="text-sm md:text-lg font-semibold text-gold mb-1 md:mb-2">
              {{ $t('library.majorArcanaFull') }}
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              {{ $t('library.majorArcanaDesc') }}
            </p>

            <div
              class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4"
            >
              <TarotCardComponent
                v-for="card in majorArcana"
                :key="card.id"
                :card="card"
                :deck-id="selectedDeckId!"
                :holo-type="holoType"
                :aspect-ratio="currentAspectRatio"
                static
                @click="openCard(card)"
              />
            </div>
          </section>
        </Motion>

        <!-- Minor Arcana Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.15 }"
        >
          <section>
            <h2 class="text-sm md:text-lg font-semibold text-gold mb-1 md:mb-2">
              {{ $t('library.minorArcanaFull') }}
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              {{ $t('library.minorArcanaDesc') }}
            </p>

            <!-- 四种花色 -->
            <div class="space-y-8">
              <div v-for="suit in suitOrder" :key="suit" class="suit-section">
                <h3
                  class="text-sm md:text-base font-semibold text-foreground mb-4 flex items-center gap-2"
                >
                  <span class="text-lg md:text-xl">{{ suits[suit].symbol }}</span>
                  <span>{{ suits[suit].name }} ({{ suits[suit].nameEn }})</span>
                  <span class="text-muted-foreground text-xs"
                    >· {{ $t('library.elements.' + suits[suit].element) }}</span
                  >
                </h3>
                <div
                  class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 gap-3 md:gap-4"
                >
                  <TarotCardComponent
                    v-for="card in minorArcana[suit]"
                    :key="card.id"
                    :card="toDisplayCard(card)"
                    :deck-id="selectedDeckId!"
                    :holo-type="holoType"
                    :aspect-ratio="currentAspectRatio"
                    static
                    @click="openCard(card)"
                  />
                </div>
              </div>
            </div>
          </section>
        </Motion>
      </div>
    </div>

    <!-- Card Detail Modal -->
    <AnimatePresence>
      <div
        v-if="selectedCard"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeCard"
      >
        <!-- Backdrop -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="closeCard"
        />

        <!-- Modal Content -->
        <Motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          :transition="{ duration: 0.25 }"
          class="relative z-10 w-full max-w-md max-h-[85vh] overflow-hidden glass-card border border-gold/30"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-3 md:p-4 border-b border-gold/20">
            <div class="flex items-center gap-3">
              <!-- 图片牌组显示缩略图 -->
              <template v-if="useImages && selectedDeckId">
                <div
                  v-holo-foil="{ type: holoType }"
                  class="w-12 h-16 md:w-14 md:h-20 rounded overflow-hidden flex-shrink-0"
                  :style="{ aspectRatio: currentAspectRatio }"
                >
                  <img
                    :src="getCardImageUrl(getCardIndex(selectedCard), selectedDeckId)"
                    :alt="selectedCard.nameEn"
                    class="w-full h-full object-cover"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                  />
                </div>
              </template>
              <template v-else>
                <span class="text-3xl md:text-4xl">{{ selectedCard.symbol }}</span>
              </template>
              <div>
                <h3 class="text-base md:text-lg font-bold text-gold">{{ selectedCard.name }}</h3>
                <p class="text-xs text-muted-foreground">
                  {{ selectedCard.nameEn
                  }}{{
                    (selectedCard as TarotCard).number
                      ? ` · ${(selectedCard as TarotCard).number}`
                      : ''
                  }}
                </p>
              </div>
            </div>
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              @click="closeCard"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-3 md:p-4 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-4">
            <!-- Keywords -->
            <div>
              <h4 class="text-xs text-gold font-medium mb-2">{{ $t('library.keywords') }}</h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="kw in splitKeywords(selectedCard.keywords, locale)"
                  :key="kw"
                  class="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs"
                >
                  {{ kw }}
                </span>
              </div>
            </div>

            <!-- Upright -->
            <div>
              <h4 class="text-xs text-green-400 font-medium mb-2">
                {{ $t('library.uprightMeaning') }}
              </h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {{ selectedCard.upright }}
              </p>
            </div>

            <!-- Reversed -->
            <div>
              <h4 class="text-xs text-red-400 font-medium mb-2">
                {{ $t('library.reversedMeaning') }}
              </h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {{ selectedCard.reversed }}
              </p>
            </div>

            <!-- Description -->
            <div v-if="selectedCard.description">
              <h4 class="text-xs text-gold font-medium mb-2">
                {{ $t('library.cardDescription') }}
              </h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {{ selectedCard.description }}
              </p>
            </div>

            <!-- Note -->
            <div v-if="selectedCard.note">
              <h4 class="text-xs text-gold font-medium mb-2">{{ $t('library.symbolism') }}</h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {{ selectedCard.note }}
              </p>
            </div>
          </div>
        </Motion>
      </div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
/* ========== 牌组网格 ========== */
.deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
  justify-items: center;
}

@media (min-width: 640px) {
  .deck-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .deck-grid {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 24px;
  }
}
</style>
