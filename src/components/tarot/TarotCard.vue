<script setup lang="ts">
/**
 * TarotCard - 塔罗牌渲染组件
 *
 * 职责：
 * 1. 渲染卡牌内容（正面或背面）
 * 2. 支持图片牌组和 emoji 文字牌组
 *
 * 不负责：
 * - 3D 翻转动画（由 HoloTarot 处理）
 * - tilt/glare 效果（由 HoloFoil 处理）
 */
import { ref, computed, watch } from 'vue'
import type { TarotCard as TarotCardType, DrawnCard, DisplayCard } from '@/data'
import { DEFAULT_DECK_ID, getCardEnglishName, getCardNumber } from '@/data'
import { getCardImageUrl, isImageDeck } from '@/data/card-images'

// ========== Props ==========
interface Props {
  card?: TarotCardType | DrawnCard | DisplayCard
  reversed?: boolean
  deckId?: string
  side?: 'front' | 'back'
}

const props = withDefaults(defineProps<Props>(), {
  reversed: false,
  deckId: DEFAULT_DECK_ID,
  side: 'front',
})

// ========== State ==========
const imageLoaded = ref(false)
const imageError = ref(false)

// ========== 计算属性 ==========
const useImages = computed(() => isImageDeck(props.deckId))

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

const cardImageUrl = computed(() => getCardImageUrl(cardIndex.value, props.deckId))
const cardEnglishName = computed(() => getCardEnglishName(cardIndex.value))

const isReversed = computed(() => {
  if (props.reversed) return true
  return (props.card as DrawnCard)?.isReversed ?? false
})

const cardNumber = computed(() => {
  if (!props.card) return undefined
  return getCardNumber(props.card as DisplayCard)
})

const showFront = computed(() => props.side === 'front')

// ========== 方法 ==========
const onImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

const onImageError = () => {
  imageError.value = true
  imageLoaded.value = false
}

watch(
  () => props.deckId,
  () => {
    imageLoaded.value = false
    imageError.value = false
  }
)
</script>

<template>
  <div class="tarot-card" :class="{ reversed: isReversed && showFront }">
    <!-- 正面内容 -->
    <template v-if="showFront && card">
      <img
        v-if="useImages"
        :src="cardImageUrl"
        :alt="cardEnglishName"
        class="card-image"
        :class="{ loaded: imageLoaded && !imageError }"
        loading="lazy"
        @load="onImageLoad"
        @error="onImageError"
      />

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

    <!-- 背面内容 - 简约神秘风格 -->
    <template v-else>
      <div class="card-back">
        <div class="back-symbol">✦</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/**
 * TarotCard 纯渲染组件样式
 * 
 * 重要：
 * 1. 使用 display: grid 实现层叠布局
 * 2. 设置 z-index: -1 让内容在 hover-tilt 的 glare (::before) 之下
 *    hover-tilt 的 glare 是通过 ::part(tilt)::before 实现的
 *    伪元素默认 z-index: auto，所以我们把内容设为负值
 */
.tarot-card {
  --card-radius: 8px;

  position: relative;
  z-index: -1;
  display: grid;
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius);
  overflow: hidden;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
}

/* 所有直接子元素放在同一个 grid cell */
.tarot-card > * {
  grid-area: 1 / 1;
}

.tarot-card.reversed {
  transform: rotate(180deg);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-image.loaded {
  opacity: 1;
}

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

.card-number {
  font-size: clamp(0.5rem, 2vw, 0.75rem);
  color: var(--accent);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.card-symbol {
  font-size: clamp(1.5rem, 8vw, 3rem);
  line-height: 1;
}

.card-name {
  font-size: clamp(0.625rem, 3vw, 1rem);
  color: var(--accent);
  font-weight: 600;
  margin-top: 0.5rem;
}

.card-name-en {
  font-size: clamp(0.5rem, 2vw, 0.7rem);
  color: var(--text-muted, #888);
  margin-top: 0.25rem;
}

/* ========== 卡背样式 - 简约神秘风格 ========== */
.card-back {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  overflow: hidden;
}

/* 装饰边框 - 外层 */
.card-back::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: calc(var(--card-radius) - 4px);
  border: 2px solid rgba(224, 123, 90, 0.35);
  pointer-events: none;
}

/* 装饰边框 - 内层 */
.card-back::after {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: calc(var(--card-radius) - 8px);
  border: 1px solid rgba(224, 123, 90, 0.2);
  pointer-events: none;
}

/* 中央符号 */
.back-symbol {
  position: relative;
  z-index: 1;
  font-size: clamp(2rem, 12vw, 3rem);
  color: var(--primary-500, #e07b5a);
  opacity: 0.7;
  text-shadow: 0 0 20px rgba(224, 123, 90, 0.3);
}
</style>
