<script setup lang="ts">
/**
 * TarotCard - 塔罗牌渲染组件（含3D翻转）
 *
 * 结构：
 * .tarot-card (perspective 容器)
 *   .card-inner (transform-style: preserve-3d)
 *     .card-back (背面，默认可见)
 *     .card-front (正面，默认隐藏，翻转后可见)
 *
 * 翻转原理：
 * - 使用 backface-visibility: hidden 隐藏背面
 * - 通过 rotateY 实现 3D 翻转
 * - .flipped 类控制翻转状态
 */
import { ref, computed, watch } from 'vue'
import type { TarotCard as TarotCardType, DrawnCard, DisplayCard } from '@/data'
import { DEFAULT_DECK_ID, getCardEnglishName, useDeckConfig, getCardNumber } from '@/data'
import { getCardImageUrl, isImageDeck } from '@/data/card-images'
import cardBackImage from '@/assets/back/0.png'

// ========== Props ==========
interface Props {
  /** 卡牌数据 */
  card?: TarotCardType | DrawnCard | DisplayCard
  /** 是否已翻转（显示正面） */
  flipped?: boolean
  /** 是否逆位 */
  reversed?: boolean
  /** 牌组 ID */
  deckId?: string
  /** 翻转动画时长(ms) */
  flipDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  flipped: false,
  reversed: false,
  deckId: DEFAULT_DECK_ID,
  flipDuration: 600,
})

// ========== 牌组配置 ==========
const { getDeckAspectRatio } = useDeckConfig()

// ========== Emits ==========
const emit = defineEmits<{
  flipStart: []
  flipEnd: []
}>()

// ========== State ==========
const isFlipped = ref(props.flipped)
const imageLoaded = ref(false)
const imageError = ref(false)

// 监听 flipped prop 变化
watch(
  () => props.flipped,
  newVal => {
    if (newVal !== isFlipped.value) {
      isFlipped.value = newVal
      emit('flipStart')
      setTimeout(() => emit('flipEnd'), props.flipDuration)
    }
  }
)

// ========== 计算属性 ==========

/** 是否使用图片牌组 */
const useImages = computed(() => isImageDeck(props.deckId))

/** 计算卡牌索引 */
const cardIndex = computed(() => {
  if (!props.card?.id) return 0
  const id = props.card.id

  if (id.startsWith('major-')) {
    return parseInt(id.replace('major-', ''), 10) || 0
  }

  const match = id.match(/^minor-(\w+)-(.+)$/)
  if (match) {
    const [, suit, rank] = match
    const suitOffset: Record<string, number> = {
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
    const rankNum = courtRanks[rank] || parseInt(rank, 10)
    return (suitOffset[suit] || 22) + rankNum - 1
  }

  return 0
})

/** 卡牌图片 URL */
const cardImageUrl = computed(() => getCardImageUrl(cardIndex.value, props.deckId))

/** 卡牌英文名称 */
const cardEnglishName = computed(() => getCardEnglishName(cardIndex.value))

/** 是否显示逆位 */
const isReversed = computed(() => {
  if (props.reversed) return true
  return (props.card as DrawnCard)?.isReversed ?? false
})

/** 卡牌编号（用于文字牌组显示） */
const cardNumber = computed(() => {
  if (!props.card) return undefined
  return getCardNumber(props.card as DisplayCard)
})

/** 牌组宽高比 (width/height) */
const deckRatio = computed(() => getDeckAspectRatio(props.deckId))

/** CSS 变量 */
const cssVars = computed(() => ({
  '--flip-duration': `${props.flipDuration}ms`,
  '--card-aspect-ratio': deckRatio.value,
}))

// ========== 方法 ==========
const onImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

const onImageError = () => {
  imageError.value = true
  imageLoaded.value = false
}

/** 执行翻转 */
const flip = () => {
  isFlipped.value = !isFlipped.value
  emit('flipStart')
  setTimeout(() => emit('flipEnd'), props.flipDuration)
}

/** 重置到背面 */
const reset = () => {
  isFlipped.value = false
}

// ========== 暴露 ==========
defineExpose({
  flip,
  reset,
  isFlipped,
  imageLoaded,
  imageError,
})
</script>

<template>
  <div class="tarot-card" :style="cssVars">
    <div class="card-inner" :class="{ flipped: isFlipped }">
      <!-- 背面 -->
      <div class="card-face card-back">
        <img :src="cardBackImage" alt="Card Back" class="back-image" />
      </div>

      <!-- 正面 -->
      <div class="card-face card-front" :class="{ reversed: isReversed }">
        <template v-if="card">
          <!-- 图片牌组：图片始终渲染，通过样式控制显隐 -->
          <img
            v-if="useImages"
            :src="cardImageUrl"
            :alt="cardEnglishName"
            class="front-image"
            :class="{ loaded: imageLoaded && !imageError }"
            loading="lazy"
            @load="onImageLoad"
            @error="onImageError"
          />

          <!-- 文字牌组（或图片加载失败的 fallback） -->
          <div
            v-if="!useImages || imageError || !imageLoaded"
            class="card-fallback"
            :class="{ hidden: useImages && imageLoaded && !imageError }"
          >
            <span v-if="cardNumber" class="card-number">{{ cardNumber }}</span>
            <div class="card-symbol">{{ card.symbol }}</div>
            <span class="card-name">{{ card.name }}</span>
            <span class="card-name-en">{{ card.nameEn }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 根容器（透视容器） ========== */
.tarot-card {
  --flip-duration: 600ms;
  --card-radius: 8px;
  --card-aspect-ratio: 0.585; /* 默认韦特比例 199/340 */

  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
  perspective: 1300px;
}

/* ========== 内部容器（3D变换） ========== */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--flip-duration) ease-in-out;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

/* ========== 卡片面（共用样式） ========== */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius);
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* ========== 背面 ========== */
.card-back {
  transform: rotateY(0deg);
}

.back-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* ========== 正面 ========== */
.card-front {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
}

.card-front.reversed {
  transform: rotateY(180deg) rotate(180deg);
}

/* 正面图片 */
.front-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.front-image.loaded {
  opacity: 1;
}

/* 文字 fallback */
.card-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-align: center;
  transition: opacity 0.3s ease;
}

.card-fallback.hidden {
  opacity: 0;
  pointer-events: none;
}

/* 文字牌组样式 */
.card-number {
  font-size: clamp(0.5rem, 2vw, 0.75rem);
  color: var(--gold, #d4af37);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.card-symbol {
  font-size: clamp(1.5rem, 8vw, 3rem);
  line-height: 1;
}

.card-name {
  font-size: clamp(0.625rem, 3vw, 1rem);
  color: var(--gold, #d4af37);
  font-weight: 600;
  margin-top: 0.5rem;
  text-align: center;
}

.card-name-en {
  font-size: clamp(0.5rem, 2vw, 0.7rem);
  color: var(--text-muted, #888);
  margin-top: 0.25rem;
  text-align: center;
}
</style>
