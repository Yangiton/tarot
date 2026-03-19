<script setup lang="ts">
/**
 * Home.vue - Daily Fortune 首页
 *
 * 设计理念：暗夜优雅 (Dark Elegant)
 * - 极简仪式感：大尺寸卡牌居中展示
 * - 沉浸式体验：无导航干扰，点击翻牌直接揭示
 * - 无跳变：始终显示 HoloTarot，背面→正面翻转
 */
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Motion, AnimatePresence } from 'motion-v'
import { Settings, Sparkles, ChevronRight, RotateCcw } from 'lucide-vue-next'
import { useTimeoutFn } from '@vueuse/core'
import { HoloTarot } from '@/components/tarot'
import { useTarot } from '@/composables/useTarot'
import { useDevice } from '@/composables/useDevice'

const { t } = useI18n()
const router = useRouter()
const { isMobile } = useDevice()

const {
  currentSpread,
  drawnCards,
  holoPreset,
  currentDeckId,
  isDrawn,
  drawCards,
  flipCard,
  isCardFlipped,
  resetReading,
  selectSpread,
} = useTarot()

// ========== State ==========
const holoTarotRef = ref<InstanceType<typeof HoloTarot> | null>(null)
const isAnimating = ref(false)
const showActions = ref(false)
const hasInitialized = ref(false)

// Daily Fortune 模式：单卡
const isDailyMode = computed(() => currentSpread.value === 1)
const dailyCard = computed(() =>
  isDailyMode.value && drawnCards.value.length > 0 ? drawnCards.value[0] : null
)
const isCardRevealed = computed(() => dailyCard.value && isCardFlipped(dailyCard.value.id))

// 确保首页是单卡模式，并自动抽卡
watch(
  () => router.currentRoute.value.path,
  path => {
    if (path === '/' && currentSpread.value !== 1) {
      selectSpread(1)
    }
  },
  { immediate: true }
)

// 初始化时自动抽卡（如果还没抽过）
onMounted(() => {
  if (!isDrawn.value) {
    drawCards()
  }
  hasInitialized.value = true

  // 如果已翻牌，直接显示操作按钮
  if (isCardRevealed.value) {
    showActions.value = true
  }
})

// 翻牌后显示操作按钮
watch(isCardRevealed, revealed => {
  if (revealed) {
    useTimeoutFn(() => {
      showActions.value = true
    }, 500)
  } else {
    showActions.value = false
  }
})

// ========== Handlers ==========
const handleFlip = (cardId: string) => {
  flipCard(cardId)
}

const handleReset = async () => {
  if (isAnimating.value) return
  isAnimating.value = true
  showActions.value = false

  // 先重置翻牌状态
  holoTarotRef.value?.reset?.()

  await new Promise(resolve => setTimeout(resolve, 400))

  // 重新抽卡
  resetReading()
  drawCards()

  useTimeoutFn(() => {
    isAnimating.value = false
  }, 100)
}

const goToReading = () => {
  router.push('/reading')
}

const goToSettings = () => {
  router.push('/settings')
}

const goToMoreSpreads = () => {
  router.push('/spreads')
}
</script>

<template>
  <div class="daily-fortune" :class="{ 'is-mobile': isMobile }">
    <!-- 极简设置入口 -->
    <button class="settings-btn" @click="goToSettings" :aria-label="t('nav.settings')">
      <Settings class="w-5 h-5" />
    </button>

    <!-- 引导文字（未翻牌时） -->
    <AnimatePresence>
      <Motion
        v-if="!isCardRevealed && hasInitialized"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -10 }"
        :transition="{ duration: 0.3 }"
        class="guide-header"
      >
        <p class="guide-text">{{ t('home.guideText') }}</p>
      </Motion>
    </AnimatePresence>

    <!-- 大尺寸卡牌区域 -->
    <div class="card-stage">
      <HoloTarot
        v-if="dailyCard"
        ref="holoTarotRef"
        :card="dailyCard"
        :holo-preset="holoPreset"
        :deck-id="currentDeckId"
        :clickable="!isAnimating"
        :flipped="isCardRevealed ?? false"
        :zoomable="isCardRevealed ?? false"
        :gyroscope="true"
        :zoom-scale="2.5"
        class="daily-card"
        @flip="handleFlip"
      />
    </div>

    <!-- 卡牌信息区 -->
    <AnimatePresence>
      <Motion
        v-if="isCardRevealed && dailyCard"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 12 }"
        :transition="{ duration: 0.5, delay: 0.2, ease: [0.22, 1.2, 0.36, 1] }"
        class="card-info"
      >
        <div class="card-header">
          <span class="card-number">{{ dailyCard.number }}</span>
          <h2 class="card-name">{{ dailyCard.name }}</h2>
        </div>
        <span :class="['orientation-tag', dailyCard.isReversed ? 'is-reversed' : 'is-upright']">
          {{ dailyCard.isReversed ? t('reading.reversed') : t('reading.upright') }}
        </span>
        <p class="card-keywords">{{ dailyCard.keywords }}</p>
      </Motion>
    </AnimatePresence>

    <!-- 底部操作区 -->
    <div class="action-bar">
      <AnimatePresence>
        <Motion
          v-if="showActions"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }"
          class="action-buttons"
        >
          <button class="btn-ghost" :disabled="isAnimating" @click="handleReset">
            <RotateCcw class="w-4 h-4" />
            <span>{{ t('divination.redrawButton') }}</span>
          </button>
          <button class="btn-accent" @click="goToReading">
            <span>{{ t('divination.viewReadingButton') }}</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </Motion>
      </AnimatePresence>

      <!-- 更多牌阵入口 -->
      <AnimatePresence>
        <Motion
          v-if="showActions"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.3, delay: 0.2 }"
          class="more-spreads"
        >
          <button class="spread-link" @click="goToMoreSpreads">
            <Sparkles class="w-4 h-4" />
            <span>{{ t('home.exploreMoreSpreads') }}</span>
          </button>
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>

<style scoped>
/**
 * Daily Fortune 页面样式
 * 设计系统：暗夜优雅 (Dark Elegant)
 * 
 * 特点：
 * - 大尺寸卡牌居中展示
 * - 无跳变：始终显示 HoloTarot
 * - 点击翻牌直接揭示
 */

.daily-fortune {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  padding-top: var(--space-8);
  padding-bottom: calc(var(--space-6) + var(--safe-bottom));
  overflow: hidden;
}

/* ========== 极简设置按钮 ========== */
.settings-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  color: var(--fg-subtle);
  background: transparent;
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) var(--ease-out);
  z-index: var(--z-elevated);
}

.settings-btn:hover {
  color: var(--fg-default);
  border-color: var(--border-default);
  background: var(--bg-elevated);
}

.settings-btn:active {
  transform: scale(0.95);
}

/* ========== 引导文字 ========== */
.guide-header {
  position: absolute;
  top: var(--space-16);
  left: 0;
  right: 0;
  text-align: center;
}

.guide-text {
  font-size: var(--text-sm);
  color: var(--fg-muted);
}

/* ========== 大尺寸卡牌舞台 ========== */
.card-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  perspective: 1000px;
}

/* 卡牌尺寸 - 大占比 */
.daily-card {
  width: min(70vw, 280px);
}

@media (min-width: 640px) {
  .daily-card {
    width: min(50vw, 320px);
  }
}

@media (min-width: 768px) {
  .daily-card {
    width: min(45vw, 360px);
  }
}

@media (min-width: 1024px) {
  .daily-card {
    width: min(35vw, 380px);
  }
}

/* ========== 卡牌信息 ========== */
.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  text-align: center;
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.card-number {
  font-size: var(--text-sm);
  color: var(--fg-subtle);
  font-weight: var(--font-medium);
}

.card-name {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--fg-bright);
  margin: 0;
}

.orientation-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.orientation-tag.is-upright {
  background: var(--upright-soft);
  color: var(--upright);
  border: 1px solid var(--upright);
}

.orientation-tag.is-reversed {
  background: var(--reversed-soft);
  color: var(--reversed);
  border: 1px solid var(--reversed);
}

.card-keywords {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin: 0;
}

/* ========== 底部操作区 ========== */
.action-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  min-height: 70px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* Ghost 按钮 */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--fg-muted);
  background: transparent;
  border: 1px solid var(--border-default);
  transition: all var(--duration-fast) var(--ease-spring);
  cursor: pointer;
}

.btn-ghost:hover:not(:disabled) {
  color: var(--fg-default);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.btn-ghost:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Accent 按钮 */
.btn-accent {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--fg-on-accent);
  background: var(--gradient-accent);
  border: none;
  box-shadow: var(--glow-common);
  transition: all var(--duration-fast) var(--ease-spring);
  cursor: pointer;
}

.btn-accent:hover {
  box-shadow: var(--glow-rare);
  transform: translateY(-1px);
}

.btn-accent:active {
  transform: translateY(0) scale(0.98);
}

/* 更多牌阵入口 */
.more-spreads {
  margin-top: var(--space-1);
}

.spread-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  color: var(--fg-subtle);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.spread-link:hover {
  color: var(--accent);
}

/* ========== 响应式 ========== */
@media (min-width: 768px) {
  .settings-btn {
    top: var(--space-6);
    right: var(--space-6);
  }

  .guide-header {
    top: var(--space-20);
  }
}

/* 横屏模式 */
@media (orientation: landscape) and (max-height: 500px) {
  .daily-fortune {
    flex-direction: row;
    padding: var(--space-3);
    padding-top: var(--space-3);
  }

  .guide-header {
    display: none;
  }

  .card-stage {
    flex: 0 0 auto;
  }

  .daily-card {
    width: min(35vh, 200px);
  }

  .card-info {
    padding: var(--space-2);
  }

  .card-name {
    font-size: var(--text-xl);
  }

  .action-bar {
    min-height: auto;
    gap: var(--space-2);
  }
}
</style>
