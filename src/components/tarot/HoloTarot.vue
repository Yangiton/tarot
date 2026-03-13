<script setup lang="ts">
/**
 * HoloTarot - 全息塔罗牌组件
 *
 * 组合 HoloFoil + TarotCard 实现：
 * 1. 卡牌渲染（正反面）
 * 2. 点击 3D 翻转
 * 3. Tilt 倾斜效果
 * 4. Holo 全息效果
 * 5. 点击放大（翻牌后）
 *
 * 结构：
 * .holo-tarot (根容器，定义尺寸)
 *   HoloFoil (hover-tilt 全息效果)
 *     TarotCard (卡牌渲染 + 翻转)
 *   .position-label (牌位标签)
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { DrawnCard, SpreadType, TarotCard as TarotCardType } from '@/data'
import { DEFAULT_DECK_ID } from '@/data'
import TarotCard from './TarotCard.vue'
import HoloFoil from '../holo/HoloFoil.vue'

// ========== Props ==========
interface Props {
  /** 卡牌数据 */
  card?: DrawnCard | TarotCardType
  /** 牌位名称 */
  position?: string
  /** 是否可点击翻转 */
  clickable?: boolean
  /** 翻转动画时长(ms) */
  flipDuration?: number
  /** 牌阵类型（影响标签位置） */
  spreadType?: SpreadType
  /** 全息预设 */
  holoPreset?: string
  /** 牌组 ID */
  deckId?: string
  /** 启用陀螺仪 */
  gyroscope?: boolean
  /** 静态模式（直接显示正面，不可翻转） */
  static?: boolean
  /** 是否已翻开（外部控制） */
  flipped?: boolean
  /** 启用放大功能 */
  zoomable?: boolean
  /** 放大比例 */
  zoomScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  flipDuration: 600,
  spreadType: 3,
  holoPreset: 'normal',
  deckId: DEFAULT_DECK_ID,
  gyroscope: true,
  static: false,
  flipped: false,
  zoomable: true,
  zoomScale: 2.5,
})

// ========== Emits ==========
const emit = defineEmits<{
  flip: [cardId: string]
  flipComplete: []
  click: []
  zoom: [zoomed: boolean]
}>()

// ========== State ==========
const rootRef = ref<HTMLElement | null>(null)
const isFlipped = ref(props.static || props.flipped)
const isFlipping = ref(false)
const isZoomed = ref(false)
const translateX = ref(0)
const translateY = ref(0)

// 挂载后短暂冷却期，防止点击穿透
const mountedAt = ref(0)
const CLICK_GUARD_MS = 300

// ========== 计算属性 ==========

/** 是否逆位 */
const isReversed = computed(() => (props.card as DrawnCard)?.isReversed ?? false)

/** 位置标签位置 */
const labelPosition = computed(() => (props.spreadType <= 3 ? 'bottom' : 'inside'))

/** CSS 变量 */
const cssVars = computed(() => ({
  '--flip-duration': `${props.flipDuration}ms`,
  '--zoom-scale': props.zoomScale,
  '--translate-x': `${translateX.value}px`,
  '--translate-y': `${translateY.value}px`,
}))

// ========== 方法 ==========

/** 计算放大后的居中偏移 */
const calcZoomOffset = () => {
  if (!rootRef.value) return

  const rect = rootRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 计算卡牌中心到视口中心的距离
  const cardCenterX = rect.left + rect.width / 2
  const cardCenterY = rect.top + rect.height / 2
  const viewportCenterX = viewportWidth / 2
  const viewportCenterY = viewportHeight / 2

  translateX.value = viewportCenterX - cardCenterX
  translateY.value = viewportCenterY - cardCenterY
}

const handleClick = (e: MouseEvent) => {
  emit('click')

  // 防止组件刚挂载时的点击穿透
  if (Date.now() - mountedAt.value < CLICK_GUARD_MS) {
    return
  }

  // 如果已放大，点击则缩小
  if (isZoomed.value) {
    zoomOut()
    e.stopPropagation()
    return
  }

  // 没有卡牌数据时不处理
  if (!props.card) return

  // static 模式：已显示正面，只能放大不能翻牌
  if (props.static) {
    if (props.zoomable) {
      zoomIn()
    }
    return
  }

  // 非 static 模式需要 clickable
  if (!props.clickable) return

  // 未翻牌时点击翻牌
  if (!isFlipped.value && !isFlipping.value) {
    flip()
    return
  }

  // 已翻牌且可放大，则放大
  if (isFlipped.value && props.zoomable && !isFlipping.value) {
    zoomIn()
  }
}

const flip = () => {
  if (isFlipping.value || isFlipped.value) return

  isFlipping.value = true
  isFlipped.value = true
  emit('flip', props.card?.id || '')

  setTimeout(() => {
    isFlipping.value = false
    emit('flipComplete')
  }, props.flipDuration)
}

const zoomIn = () => {
  if (isZoomed.value || !props.zoomable) return

  calcZoomOffset()
  isZoomed.value = true
  emit('zoom', true)

  // 添加全局点击监听
  setTimeout(() => {
    document.addEventListener('click', handleGlobalClick)
    document.addEventListener('keydown', handleKeydown)
  }, 100)
}

const zoomOut = () => {
  if (!isZoomed.value) return

  isZoomed.value = false
  translateX.value = 0
  translateY.value = 0
  emit('zoom', false)

  // 移除全局监听
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('keydown', handleKeydown)
}

const handleGlobalClick = (e: MouseEvent) => {
  // 点击卡牌外部时缩小
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    zoomOut()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    zoomOut()
  }
}

const reset = () => {
  isFlipped.value = props.static || props.flipped
  isFlipping.value = false
  zoomOut()
}

// 监听 static/flipped prop 变化
watch(
  () => [props.static, props.flipped],
  ([staticVal, flippedVal]) => {
    isFlipped.value = staticVal || flippedVal
  }
)

// 窗口大小变化时重新计算偏移
const handleResize = () => {
  if (isZoomed.value) {
    calcZoomOffset()
  }
}

onMounted(() => {
  mountedAt.value = Date.now()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('keydown', handleKeydown)
})

// ========== 暴露 ==========
defineExpose({
  flip,
  reset,
  zoomIn,
  zoomOut,
  isFlipped,
  isFlipping,
  isZoomed,
})
</script>

<template>
  <div
    ref="rootRef"
    class="holo-tarot"
    :class="{
      'is-zoomed': isZoomed,
      'is-flipped': isFlipped,
      'is-flipping': isFlipping,
    }"
    :style="cssVars"
    @click="handleClick"
  >
    <!-- 全息效果容器 -->
    <HoloFoil
      :preset="holoPreset"
      :disabled="isFlipping || holoPreset === 'none'"
      :gyroscope="gyroscope"
      border-radius="var(--card-radius, 8px)"
    >
      <!-- 塔罗牌（含翻转） -->
      <TarotCard
        ref="tarotCardRef"
        :card="card"
        :flipped="isFlipped"
        :reversed="isReversed"
        :deck-id="deckId"
        :flip-duration="flipDuration"
      />
    </HoloFoil>

    <!-- 位置标签 -->
    <span
      v-if="position && !static && !isZoomed"
      class="position-label"
      :class="labelPosition === 'inside' ? 'label-inside' : 'label-bottom'"
    >
      {{ position }}
    </span>
  </div>
</template>

<style scoped>
/* ========== 根容器 ========== */
.holo-tarot {
  --card-width: 80px;
  --card-radius: 8px;
  --flip-duration: 600ms;
  --zoom-scale: 2.5;
  --translate-x: 0px;
  --translate-y: 0px;
  --zoom-duration: 400ms;

  position: relative;
  width: var(--card-width);
  cursor: pointer;
  transition:
    transform var(--zoom-duration) cubic-bezier(0.34, 1.56, 0.64, 1),
    z-index 0s;
}

/* 翻牌动画时提升层级，避免被其他卡片遮盖 */
.holo-tarot.is-flipping {
  z-index: 100 !important;
}

/* 放大状态 - 确保层级最高 */
.holo-tarot.is-zoomed {
  position: relative;
  z-index: 9999 !important;
  transform: translate3d(var(--translate-x), var(--translate-y), 0.1px) scale(var(--zoom-scale));
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

/* ========== 响应式尺寸 ========== */
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
