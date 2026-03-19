<script setup lang="ts">
/**
 * Divination.vue - 占卜页
 *
 * 设计理念：暗夜优雅 (Dark Elegant)
 * - 流程：展示当前牌阵 + 问题输入 → 抽牌 → 翻牌
 * - 点击牌阵可跳转到牌阵选择页
 */
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Motion, AnimatePresence } from 'motion-v'
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import { useTimeoutFn } from '@vueuse/core'
import { HoloTarot } from '@/components/tarot'
import { useTarot } from '@/composables/useTarot'
import { useDevice } from '@/composables/useDevice'

const router = useRouter()
const { t } = useI18n()
const { isMobile } = useDevice()

const {
  currentSpread,
  drawnCards,
  holoPreset,
  currentDeckId,
  isDrawn,
  allFlipped,
  drawCards,
  flipCard,
  isCardFlipped,
  resetReading,
  spreads,
} = useTarot()

// ========== State ==========
const phase = ref<'input' | 'draw' | 'reveal'>('input')
const question = ref('')
const isAnimating = ref(false)
const drawKey = ref(0)
const cardRefs = ref<Record<number, InstanceType<typeof HoloTarot> | null>>({})

// 当前牌阵配置
const currentSpreadConfig = computed(() => spreads.value[String(currentSpread.value)])

// 牌阵描述映射
const spreadDescMap: Record<number, string> = {
  1: 'divination.spreadDesc1',
  3: 'divination.spreadDesc3',
  5: 'divination.spreadDesc5',
}

// ========== Handlers ==========
const handleStartDraw = async () => {
  if (isAnimating.value) return

  isAnimating.value = true
  phase.value = 'draw'

  await new Promise(resolve => setTimeout(resolve, 400))

  drawCards()
  drawKey.value++

  await nextTick()
  useTimeoutFn(() => {
    isAnimating.value = false
    phase.value = 'reveal'
  }, 500)
}

const handleFlip = (cardId: string) => {
  flipCard(cardId)
}

const setCardRef = (el: unknown, index: number) => {
  cardRefs.value[index] = el as InstanceType<typeof HoloTarot> | null
}

const handleReset = async () => {
  if (isAnimating.value) return
  isAnimating.value = true

  Object.values(cardRefs.value).forEach(cardRef => {
    if (cardRef && 'reset' in cardRef) {
      ;(cardRef as { reset: () => void }).reset()
    }
  })

  await new Promise(resolve => setTimeout(resolve, 350))
  resetReading()
  drawKey.value++
  phase.value = 'input'

  await nextTick()
  useTimeoutFn(() => {
    isAnimating.value = false
  }, 100)
}

const goToReading = () => {
  if (allFlipped.value) {
    router.push('/reading')
  }
}

const goBack = () => {
  if (phase.value === 'input') {
    router.push('/')
  } else {
    handleReset()
  }
}

const goToSpreads = () => {
  router.push('/spreads')
}

// 初始化时检查状态
watch(
  () => router.currentRoute.value.path,
  path => {
    if (path === '/divination' && isDrawn.value) {
      phase.value = 'reveal'
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="divination-page" :class="{ 'is-mobile': isMobile }">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack" :aria-label="t('divination.backLabel')">
      <ArrowLeft class="w-5 h-5" />
    </button>

    <!-- 阶段 1: 问题输入 -->
    <AnimatePresence mode="wait">
      <Motion
        v-if="phase === 'input'"
        key="input"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -20 }"
        :transition="{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }"
        class="input-phase"
      >
        <!-- 页面标题 -->
        <div class="phase-header">
          <Sparkles class="w-6 h-6 text-accent" />
          <h1 class="phase-title">{{ t('divination.title') }}</h1>
        </div>

        <!-- 当前牌阵（可点击更换） -->
        <button class="spread-selector" @click="goToSpreads">
          <div class="spread-info">
            <span class="spread-name">{{ currentSpreadConfig?.name }}</span>
            <span class="spread-desc">{{ t(spreadDescMap[currentSpread] || '') }}</span>
          </div>
          <div class="spread-change">
            <span>{{ t('divination.changeSpread') }}</span>
            <ChevronRight class="w-4 h-4" />
          </div>
        </button>

        <!-- 问题输入 -->
        <div class="question-input">
          <label class="input-label">{{ t('divination.questionLabel') }}</label>
          <textarea
            v-model="question"
            class="question-textarea"
            :placeholder="t('divination.questionPlaceholder')"
            rows="3"
          />
        </div>

        <!-- 开始按钮 -->
        <button class="start-btn" @click="handleStartDraw" :disabled="isAnimating">
          <span>{{ t('divination.startButton') }}</span>
          <ChevronRight class="w-5 h-5" />
        </button>
      </Motion>

      <!-- 阶段 2&3: 抽牌/翻牌 -->
      <Motion
        v-else
        :key="'reveal-' + drawKey"
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.95 }"
        :transition="{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }"
        class="reveal-phase"
      >
        <!-- 牌阵信息 -->
        <div class="spread-header">
          <span class="spread-badge">{{ currentSpreadConfig?.name }}</span>
        </div>

        <!-- 卡牌展示区 -->
        <div class="cards-stage" :class="`spread-${currentSpread}`">
          <div
            v-for="(card, index) in drawnCards"
            :key="card.id"
            :class="['card-slot', `row-${card.row ?? 0}`, `col-${card.col ?? 0}`]"
            :style="{ '--card-delay': `${index * 0.1}s` }"
          >
            <HoloTarot
              :ref="el => setCardRef(el, index)"
              :card="card"
              :position="card.position"
              :spread-type="currentSpread"
              :holo-preset="holoPreset"
              :deck-id="currentDeckId"
              :clickable="!isAnimating"
              :flipped="isCardFlipped(card.id)"
              @flip="handleFlip"
            />
          </div>
        </div>

        <!-- 底部操作区 -->
        <div class="reveal-actions">
          <button class="btn-ghost" :disabled="isAnimating" @click="handleReset">
            {{ t('divination.redrawButton') }}
          </button>
          <AnimatePresence>
            <Motion
              v-if="allFlipped"
              :initial="{ opacity: 0, scale: 0.9 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.3 }"
            >
              <button class="btn-accent" @click="goToReading">
                <span>{{ t('divination.viewReadingButton') }}</span>
                <ChevronRight class="w-4 h-4" />
              </button>
            </Motion>
          </AnimatePresence>
          <span v-if="!allFlipped && phase === 'reveal'" class="hint-text">
            {{ t('divination.flipHint') }}
          </span>
        </div>
      </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
/**
 * 占卜页样式
 * 设计系统：暗夜优雅 (Dark Elegant)
 */

.divination-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  padding-bottom: calc(var(--space-8) + var(--safe-bottom));
  overflow: hidden;
}

/* ========== 返回按钮 ========== */
.back-btn {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
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

.back-btn:hover {
  color: var(--fg-default);
  border-color: var(--border-default);
  background: var(--bg-elevated);
}

/* ========== 输入阶段 ========== */
.input-phase {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  padding-top: var(--space-8);
}

.phase-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
}

.text-accent {
  color: var(--accent);
}

.phase-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--fg-bright);
  margin: 0;
}

/* ========== 牌阵选择器 ========== */
.spread-selector {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.spread-selector:hover {
  border-color: var(--accent);
  background: var(--bg-overlay);
}

.spread-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.spread-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--fg-default);
}

.spread-desc {
  font-size: var(--text-sm);
  color: var(--fg-muted);
}

.spread-change {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--accent);
}

/* ========== 问题输入 ========== */
.question-input {
  width: 100%;
}

.input-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin-bottom: var(--space-2);
}

.question-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-void);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--fg-default);
  font-size: var(--text-sm);
  resize: none;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.question-textarea::placeholder {
  color: var(--fg-subtle);
}

.question-textarea:focus {
  border-color: var(--accent);
}

/* ========== 开始按钮 ========== */
.start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  background: var(--gradient-accent);
  color: var(--fg-on-accent);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  box-shadow: var(--glow-common);
  transition: all var(--duration-fast) var(--ease-spring);
}

.start-btn:hover:not(:disabled) {
  box-shadow: var(--glow-rare);
  transform: translateY(-1px);
}

.start-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========== 翻牌阶段 ========== */
.reveal-phase {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--space-8);
}

.spread-header {
  margin-bottom: var(--space-4);
}

.spread-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* ========== 卡牌舞台 ========== */
.cards-stage {
  flex: 1;
  display: grid;
  gap: var(--space-3);
  place-content: center;
  padding: var(--space-4);
  perspective: 1000px;
}

.spread-1 {
  grid-template-columns: 1fr;
}

.spread-3 {
  grid-template-columns: repeat(3, 1fr);
}

.spread-5 {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
}

.card-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cardAppear 0.5s var(--ease-spring) forwards;
  animation-delay: var(--card-delay, 0s);
  opacity: 0;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.6) translateY(40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 5牌阵布局 */
.spread-5 .row-0.col-1 {
  grid-area: 1 / 2;
}
.spread-5 .row-1.col-0 {
  grid-area: 2 / 1;
}
.spread-5 .row-1.col-1 {
  grid-area: 2 / 2;
}
.spread-5 .row-1.col-2 {
  grid-area: 2 / 3;
}
.spread-5 .row-2.col-1 {
  grid-area: 3 / 2;
}

/* ========== 底部操作区 ========== */
.reveal-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
}

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

.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

.hint-text {
  font-size: var(--text-sm);
  color: var(--fg-subtle);
}

/* ========== 响应式 ========== */
@media (min-width: 768px) {
  .input-phase {
    max-width: 480px;
  }
}

/* 横屏模式 */
@media (orientation: landscape) and (max-height: 500px) {
  .divination-page {
    padding: var(--space-3);
  }

  .input-phase {
    gap: var(--space-3);
    padding-top: var(--space-4);
  }

  .phase-header {
    flex-direction: row;
  }

  .cards-stage {
    padding: var(--space-2);
  }
}
</style>
