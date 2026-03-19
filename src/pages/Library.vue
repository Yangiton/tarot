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
  <div class="library-page">
    <!-- Header -->
    <header class="library-header">
      <div class="header-content">
        <!-- 返回按钮（在牌组详情时显示） -->
        <button v-if="selectedDeckId" class="back-btn" @click="backToList">
          <ChevronLeft class="w-4 h-4" />
          <span class="hidden sm:inline">{{ $t('library.backToDecks') }}</span>
        </button>

        <h1 class="page-title">
          {{ selectedDeckId ? currentDeck?.name : $t('library.title') }}
        </h1>
      </div>
      <p class="page-subtitle">
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
            <h2 class="section-title">
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
            <h2 class="section-title">
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
                <h3 class="detail-card-name">{{ selectedCard.name }}</h3>
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
                <h3 class="detail-card-name">{{ selectedCard.name }}</h3>
                <p class="text-xs text-muted-foreground">
                  {{ selectedCard.nameEn
                  }}{{ selectedCardNumber ? ` · ${selectedCardNumber}` : '' }}
                </p>
              </div>

              <!-- Keywords -->
              <div>
                <h4 class="detail-section-title">{{ $t('library.keywords') }}</h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="kw in splitKeywords(selectedCard.keywords, locale)"
                    :key="kw"
                    class="keyword-badge"
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
                <h4 class="detail-section-title">
                  {{ $t('library.cardDescription') }}
                </h4>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {{ selectedCard.description }}
                </p>
              </div>

              <!-- Note -->
              <div v-if="selectedCard.note">
                <h4 class="detail-section-title">{{ $t('library.symbolism') }}</h4>
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
/**
 * 牌库页样式
 * 设计系统：暗夜优雅 (Dark Elegant)
 */

.library-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ========== Header ========== */
.library-header {
  position: relative;
  flex-shrink: 0;
  text-align: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-overlay);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.back-btn {
  position: absolute;
  left: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.back-btn:hover {
  color: var(--accent);
}

.page-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--accent);
  margin: 0;
}

@media (min-width: 768px) {
  .page-title {
    font-size: var(--text-xl);
  }
}

.page-subtitle {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  margin-top: var(--space-half);
}

/* ========== 牌库卡牌 ========== */
.library-card {
  --card-width: 100%;
  width: 100%;
  cursor: pointer;
}

/* ========== 牌组网格 ========== */
.deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--space-4);
  justify-items: center;
}

@media (min-width: 640px) {
  .deck-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-5);
  }
}

@media (min-width: 1024px) {
  .deck-grid {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: var(--space-6);
  }
}

/* ========== 区块标题 ========== */
.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent);
  margin-bottom: var(--space-1);
}

@media (min-width: 768px) {
  .section-title {
    font-size: var(--text-lg);
    margin-bottom: var(--space-2);
  }
}

/* ========== 详情卡片名 ========== */
.detail-card-name {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--accent);
  margin: 0;
}

@media (min-width: 640px) {
  .detail-card-name {
    font-size: var(--text-base);
  }
}

/* ========== 详情区块标题 ========== */
.detail-section-title {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--accent);
  margin-bottom: var(--space-1);
}

/* ========== 关键词徽章 ========== */
.keyword-badge {
  padding: 2px 6px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

/* ========== 花色区块 ========== */
.suit-section h3 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--fg-default);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (min-width: 768px) {
  .suit-section h3 {
    font-size: var(--text-base);
  }
}

/* ========== 卡牌详情弹窗 ========== */
.card-detail-modal {
  width: 100%;
  max-width: 320px;
  max-height: 85vh;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
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
  padding: var(--space-3);
  gap: var(--space-2);
}

.card-preview {
  width: 100px;
}

/* 移动端标题 */
.card-title-mobile {
  text-align: center;
}

.card-title-mobile h3 {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--accent);
  margin: 0;
}

.card-title-mobile p {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  margin: 0;
}

/* 桌面端标题 */
.card-title-desktop {
  display: none;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-default);
  margin-bottom: var(--space-2);
}

.card-title-desktop h3 {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--accent);
  margin: 0;
}

.card-title-desktop p {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  margin: 0;
}

/* 卡牌信息区 */
.card-info-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--space-3) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2half);
}

.card-info-area h4 {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-1);
}

.card-info-area p {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  line-height: var(--leading-relaxed);
  margin: 0;
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
    padding: var(--space-4);
    justify-content: center;
    border-right: 1px solid var(--border-default);
  }

  .card-preview {
    width: 140px;
  }

  .card-title-mobile {
    display: none;
  }

  .card-title-desktop {
    display: block;
  }

  .card-info-area {
    padding: var(--space-4);
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
    gap: var(--space-3);
  }
}

/* ========== 关键词标签 ========== */
.card-info-area .flex-wrap span {
  padding: var(--space-half) var(--space-1half);
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}
</style>
