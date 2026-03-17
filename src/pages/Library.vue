<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Motion, AnimatePresence } from 'motion-v'
import { X, ChevronLeft } from 'lucide-vue-next'
import {
  type TarotCard as TarotCardType,
  type MinorArcanaCard,
  type DisplayCard,
  type Suit,
  useDeckConfig,
  splitKeywords,
  getCardNumber,
} from '@/data'
import { useI18n } from 'vue-i18n'
import { useTarot } from '@/composables/useTarot'
import { HoloTarot, TarotCard } from '@/components/tarot'
import DeckCover from '@/components/deck/DeckCover.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const {
  holoPreset,
  majorArcana,
  minorArcana,
  suits,
  currentDeckId: globalDeckId,
  setDeckId,
} = useTarot()
const { decks, getDeckConfig } = useDeckConfig()

// 从路由参数获取当前牌组 ID
const selectedDeckId = computed(() => (route.params.deckId as string) || null)

// 卡牌详情弹窗
const selectedCard = ref<DisplayCard | null>(null)
const showDetail = ref(false)

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

// 卡牌缩小后显示详情
const OPEN_GUARD_MS = 400
const onCardZoom = (card: DisplayCard, zoomed: boolean) => {
  if (deckDetailEnteredAt.value && Date.now() - deckDetailEnteredAt.value < OPEN_GUARD_MS) return

  if (!zoomed && selectedCard.value?.id === card.id) {
    // 卡牌缩小时显示详情弹窗
    showDetail.value = true
  } else if (zoomed) {
    selectedCard.value = card
  }
}

// 关闭详情弹窗
const closeDetail = () => {
  showDetail.value = false
  selectedCard.value = null
}

// 获取选中卡牌的编号（用于显示）
const selectedCardNumber = computed(() => {
  if (!selectedCard.value) return undefined
  return getCardNumber(selectedCard.value)
})

// 将 MinorArcanaCard 转换为兼容 TarotCardType 的格式
const toDisplayCard = (card: MinorArcanaCard): TarotCardType & MinorArcanaCard => {
  return {
    ...card,
    number: String(card.rank),
  } as TarotCardType & MinorArcanaCard
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
              <HoloTarot
                v-for="card in majorArcana"
                :key="card.id"
                :card="card"
                :deck-id="selectedDeckId!"
                :holo-preset="holoPreset"
                :clickable="false"
                static
                class="library-card"
                @zoom="(zoomed: boolean) => onCardZoom(card, zoomed)"
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
                  <HoloTarot
                    v-for="card in minorArcana[suit]"
                    :key="card.id"
                    :card="toDisplayCard(card)"
                    :deck-id="selectedDeckId!"
                    :holo-preset="holoPreset"
                    :clickable="false"
                    static
                    class="library-card"
                    @zoom="(zoomed: boolean) => onCardZoom(card, zoomed)"
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
        v-if="showDetail && selectedCard"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
        @click.self="closeDetail"
      >
        <!-- Backdrop -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="closeDetail"
        />

        <!-- Modal Content - 响应式布局：移动端上下，桌面端左右 -->
        <Motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          :transition="{ duration: 0.25 }"
          class="card-detail-modal relative z-10 glass-card border border-gold/30"
        >
          <!-- 关闭按钮 -->
          <button
            class="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            @click="closeDetail"
          >
            <X class="w-4 h-4" />
          </button>

          <div class="card-detail-content">
            <!-- 左侧/上方：卡牌预览 -->
            <div class="card-preview-area">
              <TarotCard
                :card="selectedCard"
                :deck-id="selectedDeckId!"
                flipped
                class="card-preview"
              />
              <!-- 卡牌标题（移动端显示在图片下方） -->
              <div class="card-title-mobile">
                <h3 class="text-sm font-bold text-gold">{{ selectedCard.name }}</h3>
                <p class="text-xs text-muted-foreground">
                  {{ selectedCard.nameEn
                  }}{{ selectedCardNumber ? ` · ${selectedCardNumber}` : '' }}
                </p>
              </div>
            </div>

            <!-- 右侧/下方：卡牌信息 -->
            <div class="card-info-area">
              <!-- 卡牌标题（桌面端显示在信息区顶部） -->
              <div class="card-title-desktop">
                <h3 class="text-base font-bold text-gold">{{ selectedCard.name }}</h3>
                <p class="text-xs text-muted-foreground">
                  {{ selectedCard.nameEn
                  }}{{ selectedCardNumber ? ` · ${selectedCardNumber}` : '' }}
                </p>
              </div>

              <!-- Keywords -->
              <div>
                <h4 class="text-xs text-gold font-medium mb-1">{{ $t('library.keywords') }}</h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="kw in splitKeywords(selectedCard.keywords, locale)"
                    :key="kw"
                    class="px-1.5 py-0.5 bg-gold/10 text-gold rounded-full text-xs"
                  >
                    {{ kw }}
                  </span>
                </div>
              </div>

              <!-- Upright -->
              <div>
                <h4 class="text-xs text-green-400 font-medium mb-1">
                  ✦ {{ $t('library.uprightMeaning') }}
                </h4>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {{ selectedCard.upright }}
                </p>
              </div>

              <!-- Reversed -->
              <div>
                <h4 class="text-xs text-red-400 font-medium mb-1">
                  ✦ {{ $t('library.reversedMeaning') }}
                </h4>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {{ selectedCard.reversed }}
                </p>
              </div>

              <!-- Description -->
              <div v-if="selectedCard.description">
                <h4 class="text-xs text-gold font-medium mb-1">
                  {{ $t('library.cardDescription') }}
                </h4>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {{ selectedCard.description }}
                </p>
              </div>

              <!-- Note -->
              <div v-if="selectedCard.note">
                <h4 class="text-xs text-gold font-medium mb-1">{{ $t('library.symbolism') }}</h4>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ selectedCard.note }}</p>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
/* ========== 牌库卡牌 ========== */
.library-card {
  /* 宽度 100%，高度由 TarotCard 内部的 aspect-ratio 自适应 */
  --card-width: 100%;
  width: 100%;
  cursor: pointer;
}

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

/* ========== 卡牌详情弹窗 ========== */
.card-detail-modal {
  width: 100%;
  max-width: 320px;
  max-height: 85vh;
  overflow: hidden;
}

.card-detail-content {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

/* 卡牌预览区 */
.card-preview-area {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  gap: 8px;
}

.card-preview {
  /* 宽度固定，高度由 TarotCard 内部的 aspect-ratio 自适应 */
  width: 100px;
}

/* 移动端标题（图片下方） */
.card-title-mobile {
  text-align: center;
}

/* 桌面端标题（隐藏） */
.card-title-desktop {
  display: none;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 8px;
}

/* 卡牌信息区 */
.card-info-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ========== 桌面端：左右布局 ========== */
@media (min-width: 640px) {
  .card-detail-modal {
    max-width: 560px;
  }

  .card-detail-content {
    flex-direction: row;
    max-height: 70vh;
  }

  .card-preview-area {
    padding: 16px;
    justify-content: center;
    border-right: 1px solid rgba(255, 215, 0, 0.2);
  }

  .card-preview {
    width: 140px;
  }

  /* 移动端标题隐藏 */
  .card-title-mobile {
    display: none;
  }

  /* 桌面端标题显示 */
  .card-title-desktop {
    display: block;
  }

  .card-info-area {
    padding: 16px;
    width: 320px;
  }
}

/* ========== 大屏幕 ========== */
@media (min-width: 1024px) {
  .card-detail-modal {
    max-width: 640px;
  }

  .card-preview {
    width: 160px;
  }

  .card-info-area {
    width: 380px;
    gap: 12px;
  }
}
</style>
