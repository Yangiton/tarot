<script setup lang="ts">
/**
 * Reading.vue - 解读页
 *
 * 设计理念：沉浸式阅读体验，每张牌有自己的舞台
 * - 水平滑动卡片轮播
 * - 点击卡牌可放大查看
 * - 底部展示解读内容
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Motion, AnimatePresence } from 'motion-v'
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useSwipe } from '@vueuse/core'
import Button from '@/components/ui/button.vue'
import { HoloTarot } from '@/components/tarot'
import { useTarot } from '@/composables/useTarot'
import { splitKeywords } from '@/data'

const router = useRouter()
const { locale, t } = useI18n()
const { drawnCards, summary, isDrawn, resetReading, currentDeckId, holoPreset } = useTarot()

// 当前选中的卡牌索引
const currentIndex = ref(0)
const carouselRef = ref<HTMLElement | null>(null)

// 当前卡牌
const currentCard = computed(() => drawnCards.value[currentIndex.value])
const totalCards = computed(() => drawnCards.value.length)

// 是否显示导航箭头（多张牌时）
const showNavigation = computed(() => totalCards.value > 1)

// 滑动手势
const { direction } = useSwipe(carouselRef, {
  onSwipeEnd() {
    if (direction.value === 'left' && currentIndex.value < totalCards.value - 1) {
      nextCard()
    } else if (direction.value === 'right' && currentIndex.value > 0) {
      prevCard()
    }
  },
})

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextCard = () => {
  if (currentIndex.value < totalCards.value - 1) {
    currentIndex.value++
  }
}

const goToCard = (index: number) => {
  currentIndex.value = index
}

onMounted(() => {
  if (!isDrawn.value) {
    router.replace('/')
  }
})

const goBack = () => {
  router.push('/')
}

const handleReset = () => {
  resetReading()
  router.push('/')
}
</script>

<template>
  <div class="reading-page">
    <!-- Header Bar -->
    <header class="reading-header">
      <Button variant="ghost" size="sm" class="back-btn" @click="goBack">
        <ArrowLeft class="w-4 h-4" />
      </Button>

      <div class="header-center">
        <span class="page-indicator">{{ currentIndex + 1 }} / {{ totalCards }}</span>
      </div>

      <Button variant="ghost" size="sm" class="reset-btn" @click="handleReset">
        <RefreshCw class="w-4 h-4" />
      </Button>
    </header>

    <!-- 卡牌轮播区域 -->
    <div ref="carouselRef" class="card-carousel">
      <!-- 左箭头 -->
      <button
        v-if="showNavigation && currentIndex > 0"
        class="nav-arrow nav-prev"
        @click="prevCard"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <!-- 卡牌展示 -->
      <div class="card-stage">
        <AnimatePresence mode="wait">
          <Motion
            v-if="currentCard"
            :key="currentCard.id"
            :initial="{ opacity: 0, scale: 0.9, x: direction === 'left' ? 50 : -50 }"
            :animate="{ opacity: 1, scale: 1, x: 0 }"
            :exit="{ opacity: 0, scale: 0.9, x: direction === 'left' ? -50 : 50 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
            class="card-container"
          >
            <HoloTarot
              :card="currentCard"
              :deck-id="currentDeckId"
              :holo-preset="holoPreset"
              :clickable="true"
              :zoomable="true"
              static
            />
          </Motion>
        </AnimatePresence>
      </div>

      <!-- 右箭头 -->
      <button
        v-if="showNavigation && currentIndex < totalCards - 1"
        class="nav-arrow nav-next"
        @click="nextCard"
      >
        <ChevronRight class="w-6 h-6" />
      </button>
    </div>

    <!-- 卡牌信息和状态 -->
    <div v-if="currentCard" class="card-info">
      <div class="card-title-row">
        <span class="card-number">{{ currentCard.number }}</span>
        <h2 class="card-name">{{ currentCard.name }}</h2>
        <span :class="['status-tag', currentCard.isReversed ? 'tag-reversed' : 'tag-upright']">
          {{ currentCard.isReversed ? t('reading.reversed') : t('reading.upright') }}
        </span>
      </div>
      <p class="card-position">{{ currentCard.position }}</p>
    </div>

    <!-- 分页指示器 -->
    <div v-if="showNavigation" class="pagination-dots">
      <button
        v-for="(_, index) in drawnCards"
        :key="index"
        :class="['dot', { active: index === currentIndex }]"
        @click="goToCard(index)"
      />
    </div>

    <!-- 解读内容 -->
    <div class="reading-content custom-scrollbar">
      <AnimatePresence mode="wait">
        <Motion
          v-if="currentCard"
          :key="currentCard.id + '-content'"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -10 }"
          :transition="{ duration: 0.3 }"
          class="content-inner"
        >
          <!-- 关键词 -->
          <div class="keywords-section">
            <h4 class="section-title">{{ t('reading.keywords') }}</h4>
            <div class="keywords-list">
              <span
                v-for="kw in splitKeywords(currentCard.keywords, locale)"
                :key="kw"
                class="keyword-tag"
              >
                {{ kw }}
              </span>
            </div>
          </div>

          <!-- 牌义解读 -->
          <div class="interpretation-section">
            <h4 class="section-title">✦ {{ t('reading.interpretation') }}</h4>
            <p class="interpretation-text">
              {{ currentCard.isReversed ? currentCard.reversed : currentCard.upright }}
            </p>
          </div>

          <!-- 象征意义 -->
          <div v-if="currentCard.note" class="symbolism-section">
            <h4 class="section-title">✦ {{ t('reading.symbolism') }}</h4>
            <p class="symbolism-text">{{ currentCard.note }}</p>
          </div>
        </Motion>
      </AnimatePresence>

      <!-- 综合指引（最后一张牌后显示） -->
      <Motion
        v-if="currentIndex === totalCards - 1 && summary"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        class="summary-section"
      >
        <div class="summary-card glass-card">
          <h3 class="summary-title">{{ t('reading.summary') }}</h3>
          <p class="summary-text">{{ summary }}</p>
        </div>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
/**
 * 解读页样式
 * 设计系统：暗夜优雅 (Dark Elegant)
 */

.reading-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ========== Header ========== */
.reading-header {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-overlay);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.page-indicator {
  font-size: var(--text-sm);
  color: var(--accent);
  font-weight: var(--font-medium);
}

.back-btn,
.reset-btn {
  color: var(--fg-muted);
  transition: color var(--duration-fast) var(--ease-out);
}

.back-btn:hover,
.reset-btn:hover {
  color: var(--accent);
}

/* ========== 卡牌轮播 ========== */
.card-carousel {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-12);
  min-height: 280px;
}

.card-stage {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  --card-width: 160px;
}

@media (min-width: 640px) {
  .card-container {
    --card-width: 180px;
  }
}

/* 导航箭头 */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--fg-muted);
  transition: all var(--duration-fast) var(--ease-out);
  z-index: var(--z-elevated);
}

.nav-arrow:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.nav-prev {
  left: var(--space-2);
}

.nav-next {
  right: var(--space-2);
}

/* ========== 卡牌信息 ========== */
.card-info {
  flex-shrink: 0;
  text-align: center;
  padding: 0 var(--space-4) var(--space-4);
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.card-number {
  font-size: var(--text-sm);
  color: var(--fg-subtle);
  font-weight: var(--font-medium);
}

.card-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--fg-bright);
  margin: 0;
}

.status-tag {
  padding: var(--space-half) var(--space-2half);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.tag-upright {
  background: var(--upright-soft);
  color: var(--upright);
  border: 1px solid var(--upright);
}

.tag-reversed {
  background: var(--reversed-soft);
  color: var(--reversed);
  border: 1px solid var(--reversed);
}

.card-position {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin-top: var(--space-1);
}

/* ========== 分页指示器 ========== */
.pagination-dots {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) 0 var(--space-4);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--void-700);
  border: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.dot.active {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.dot:hover:not(.active) {
  background: var(--accent-soft);
}

/* ========== 解读内容 ========== */
.reading-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--space-4) var(--space-6);
}

.content-inner {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent);
  margin-bottom: var(--space-2);
}

.keywords-section {
  margin-bottom: var(--space-5);
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.keyword-tag {
  padding: var(--space-1) var(--space-3);
  background: var(--accent-soft);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--accent);
}

.interpretation-section,
.symbolism-section {
  margin-bottom: var(--space-5);
}

.interpretation-text,
.symbolism-text {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--fg-muted);
}

/* ========== 综合指引 ========== */
.summary-section {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-default);
}

.summary-card {
  padding: var(--space-5);
  border: 1px solid var(--border-glow);
  background: var(--accent-soft);
  border-radius: var(--radius-xl);
}

.summary-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--accent);
  text-align: center;
  margin-bottom: var(--space-3);
}

.summary-text {
  font-size: var(--text-sm);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}
</style>
