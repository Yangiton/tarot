<script setup lang="ts">
/**
 * HoloTarot - 全息塔罗牌组件
 *
 * 双层架构：
 * .holo-tarot (外层) - 控制位移到中心 (translate3d) + 层级控制 (z-index, isolation)
 *   └── .card-container (内层) - 控制翻转 (rotateY) + 放大旋转 (rotateY + scale)
 *         ├── HoloFoil.back-wrapper (Back 面, glare=0)
 *         │     └── TarotCard (side="back")
 *         └── HoloFoil.front-wrapper (Front 面, glare>0)
 *               └── TarotCard (side="front")
 *
 * 状态机：'back' → 'front' → 'zoom-in' → 'zoom-out' → 'front'
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { DrawnCard, SpreadType, TarotCard as TarotCardType } from '@/data'
import { DEFAULT_DECK_ID, useDeckConfig } from '@/data'
import TarotCard from './TarotCard.vue'
import HoloFoil from '../holo/HoloFoil.vue'
import { getHoloPreset } from '../holo/presets'

// ========== Props ==========
interface Props {
  card?: DrawnCard | TarotCardType
  position?: string
  clickable?: boolean
  flipDuration?: number
  zoomDuration?: number
  spreadType?: SpreadType
  holoPreset?: string
  deckId?: string
  gyroscope?: boolean
  static?: boolean
  flipped?: boolean
  zoomable?: boolean
  zoomScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  flipDuration: 700,
  zoomDuration: 800,
  spreadType: 3,
  holoPreset: 'normal',
  deckId: DEFAULT_DECK_ID,
  gyroscope: true,
  static: false,
  flipped: false,
  zoomable: true,
  zoomScale: 1.75,
})

// ========== Emits ==========
const emit = defineEmits<{
  flip: [cardId: string]
  flipComplete: []
  click: []
  zoom: [zoomed: boolean]
}>()

// ========== State ==========
type CardState = 'back' | 'front' | 'zoom-in' | 'zoom-out'

const rootRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const state = ref<CardState>(props.static || props.flipped ? 'front' : 'back')
const isAnimating = ref(false)
const translateX = ref(0)
const translateY = ref(0)

const mountedAt = ref(0)
const CLICK_GUARD_MS = 300

// 鼠标位置追踪
let lastMouseX = 0
let lastMouseY = 0

// ========== 牌组配置 ==========
const { getDeckAspectRatio } = useDeckConfig()

// ========== 计算属性 ==========
const isReversed = computed(() => (props.card as DrawnCard)?.isReversed ?? false)
const labelPosition = computed(() => (props.spreadType <= 3 ? 'bottom' : 'inside'))
const deckRatio = computed(() => getDeckAspectRatio(props.deckId))
const presetConfig = computed(() => getHoloPreset(props.holoPreset || 'normal'))

// 派生状态（保留兼容性）
const isFlipped = computed(() => state.value === 'front' || state.value === 'zoom-out')
const isFlipping = computed(() => isAnimating.value && state.value === 'front')
const isZoomed = computed(() => state.value === 'zoom-in')

const cssVars = computed(() => ({
  '--flip-duration': `${props.flipDuration}ms`,
  '--zoom-duration': `${props.zoomDuration}ms`,
  '--zoom-scale': String(props.zoomScale),
  '--translate-x': `${translateX.value}px`,
  '--translate-y': `${translateY.value}px`,
  '--card-aspect-ratio': String(deckRatio.value),
}))

// ========== 工具函数 ==========

/** 使用 transitionend 事件替代 setTimeout */
const onTransitionEnd = (callback: () => void) => {
  const target = containerRef.value
  if (!target) {
    callback()
    return
  }

  const handler = (e: TransitionEvent) => {
    if (e.propertyName === 'transform' && e.target === target) {
      target.removeEventListener('transitionend', handler)
      callback()
    }
  }
  target.addEventListener('transitionend', handler)
}

/** 计算移动到视口中心所需的偏移量 */
const calcZoomOffset = () => {
  if (!rootRef.value) return

  const rect = rootRef.value.getBoundingClientRect()
  translateX.value = window.innerWidth / 2 - (rect.left + rect.width / 2)
  translateY.value = window.innerHeight / 2 - (rect.top + rect.height / 2)
}

/** 触发 tilt 效果（翻转/缩放后立即激活） */
const triggerTilt = () => {
  if (!rootRef.value) return
  rootRef.value.dispatchEvent(
    new MouseEvent('mousemove', {
      clientX: lastMouseX,
      clientY: lastMouseY,
      bubbles: true,
    })
  )
}

const trackMouse = (e: MouseEvent) => {
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

// ========== 核心动作 ==========

const flip = () => {
  if (isAnimating.value || state.value !== 'back') return

  isAnimating.value = true
  state.value = 'front'
  emit('flip', props.card?.id || '')

  onTransitionEnd(() => {
    isAnimating.value = false
    emit('flipComplete')
    triggerTilt()
  })
}

const zoomIn = () => {
  if (isAnimating.value || state.value !== 'front' || !props.zoomable) return

  isAnimating.value = true
  calcZoomOffset()
  state.value = 'zoom-in'
  emit('zoom', true)

  onTransitionEnd(() => {
    isAnimating.value = false
    triggerTilt()
    document.addEventListener('click', handleGlobalClick, { capture: true })
    document.addEventListener('keydown', handleKeydown)
  })
}

const zoomOut = () => {
  if (isAnimating.value || state.value !== 'zoom-in') return

  document.removeEventListener('click', handleGlobalClick, { capture: true })
  document.removeEventListener('keydown', handleKeydown)

  isAnimating.value = true
  state.value = 'zoom-out'
  emit('zoom', false)

  onTransitionEnd(() => {
    state.value = 'front'
    translateX.value = 0
    translateY.value = 0
    isAnimating.value = false
    triggerTilt()
  })
}

// ========== 事件处理 ==========

const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('click')

  if (Date.now() - mountedAt.value < CLICK_GUARD_MS) return
  if (isAnimating.value) return
  if (!props.card) return

  // zoom-in 状态由全局事件处理
  if (state.value === 'zoom-in') return

  // 静态模式（已翻转）→ 放大
  if (props.static) {
    if (props.zoomable) zoomIn()
    return
  }

  if (!props.clickable) return

  // Back → 翻转到 Front
  if (state.value === 'back') {
    flip()
    return
  }

  // Front → 放大
  if (state.value === 'front' && props.zoomable) {
    zoomIn()
  }
}

const handleGlobalClick = () => {
  zoomOut()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') zoomOut()
}

const handleResize = () => {
  if (state.value === 'zoom-in') calcZoomOffset()
}

const reset = () => {
  state.value = props.static || props.flipped ? 'front' : 'back'
  isAnimating.value = false
  translateX.value = 0
  translateY.value = 0
  document.removeEventListener('click', handleGlobalClick, { capture: true })
  document.removeEventListener('keydown', handleKeydown)
}

// ========== 生命周期 ==========

watch(
  () => [props.static, props.flipped],
  ([staticVal, flippedVal]) => {
    if ((staticVal || flippedVal) && state.value === 'back') {
      state.value = 'front'
    }
  }
)

onMounted(() => {
  mountedAt.value = Date.now()
  window.addEventListener('resize', handleResize)
  document.addEventListener('mousemove', trackMouse)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', trackMouse)
  document.removeEventListener('click', handleGlobalClick, { capture: true })
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  flip,
  reset,
  zoomIn,
  zoomOut,
  isFlipped,
  isFlipping,
  isZoomed,
  state,
})
</script>

<template>
  <!-- 外层：控制位移到中心 + 层级控制 -->
  <div
    ref="rootRef"
    class="holo-tarot"
    :class="{
      'zoom-in': state === 'zoom-in',
      'zoom-out': state === 'zoom-out',
    }"
    :style="cssVars"
    @click="handleClick"
  >
    <!-- 内层：控制翻转 + 放大旋转 -->
    <div
      ref="containerRef"
      class="card-container"
      :class="{
        flipped: state === 'front' || state === 'zoom-out',
        'zoom-in': state === 'zoom-in',
        'zoom-out': state === 'zoom-out',
      }"
    >
      <!-- Back 面：hover-tilt 仅 tilt，无 glare -->
      <HoloFoil
        class="back-wrapper"
        :preset="holoPreset"
        :glare-intensity="0"
        :gyroscope="gyroscope"
      >
        <TarotCard :card="card" :deck-id="deckId" side="back" />
      </HoloFoil>

      <!-- Front 面：hover-tilt 有 tilt + glare -->
      <HoloFoil
        class="front-wrapper"
        :preset="holoPreset"
        :glare-intensity="presetConfig.glareIntensity ?? 1.2"
        :gyroscope="gyroscope"
      >
        <TarotCard :card="card" :reversed="isReversed" :deck-id="deckId" side="front" />
      </HoloFoil>
    </div>

    <!-- 位置标签 -->
    <span
      v-if="position && !static && state !== 'zoom-in' && state !== 'zoom-out'"
      class="position-label"
      :class="labelPosition === 'inside' ? 'label-inside' : 'label-bottom'"
    >
      {{ position }}
    </span>
  </div>
</template>

<style scoped>
/**
 * 双层架构 CSS
 *
 * 外层 .holo-tarot: 控制位移 (translate3d) + 层级 (z-index, isolation)
 * 内层 .card-container: 控制翻转 (rotateY) + 缩放 (scale)
 */

.holo-tarot {
  --card-width: 80px;
  --card-radius: 8px;
  --card-aspect-ratio: 0.585;
  --flip-duration: 700ms;
  --zoom-duration: 800ms;
  --zoom-scale: 1.75;
  --translate-x: 0px;
  --translate-y: 0px;

  position: relative;
  width: var(--card-width);
  aspect-ratio: var(--card-aspect-ratio);
  cursor: pointer;
  transition: transform var(--zoom-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 放大状态：外层移动到中心 + 提升层级 */
.holo-tarot.zoom-in {
  transform: translate3d(var(--translate-x), var(--translate-y), 0);
  z-index: 99999;
  isolation: isolate;
}

/* 缩小中：外层回到原位 + 保持层级 */
.holo-tarot.zoom-out {
  transform: translate3d(0, 0, 0);
  z-index: 99999;
  isolation: isolate;
}

/* ========== 内层：3D 翻转容器 ========== */
.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: perspective(800px);
  transition: transform var(--flip-duration) cubic-bezier(0.4, 0.2, 0.2, 1);
}

/* 翻转状态 */
.card-container.flipped {
  transform: perspective(800px) rotateY(180deg);
}

/* 放大状态：旋转 540° + 缩放 */
.card-container.zoom-in {
  transform: perspective(800px) rotateY(540deg) scale(var(--zoom-scale));
  transition: transform var(--zoom-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 缩小中：回到翻转位置 (180°) */
.card-container.zoom-out {
  transform: perspective(800px) rotateY(180deg);
  transition: transform var(--zoom-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ========== HoloFoil 包装器 ========== */
.back-wrapper,
.front-wrapper {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.front-wrapper {
  transform: rotateY(180deg);
}

/* ========== 位置标签 ========== */
.position-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
  font-size: 0.65rem;
  color: var(--gold, #d4af37);
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.label-bottom {
  bottom: -1.5rem;
}

.label-inside {
  bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.85);
}

/* ========== 响应式 ========== */
@media (min-width: 640px) {
  .holo-tarot {
    --card-width: 100px;
  }
}

@media (min-width: 768px) {
  .holo-tarot {
    --card-width: 110px;
  }
}

@media (min-width: 1024px) {
  .holo-tarot {
    --card-width: 120px;
  }
}

@media (min-width: 1280px) {
  .holo-tarot {
    --card-width: 140px;
  }
}
</style>
