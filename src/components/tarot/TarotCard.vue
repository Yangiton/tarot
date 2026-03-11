<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DrawnCard, SpreadType } from '@/data'

interface Props {
  card?: DrawnCard
  position?: string
  clickable?: boolean
  flipDuration?: number
  spreadType?: SpreadType
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  flipDuration: 600,
  spreadType: 3
})

// 根据牌阵类型决定标签位置：1、3 牌阵放下方，5+ 牌阵放内部左侧
const labelPosition = computed(() => {
  return props.spreadType <= 3 ? 'bottom' : 'inside'
})

const emit = defineEmits<{
  flip: []
  flipComplete: []
}>()

const isFlipped = ref(false)

const handleClick = () => {
  if (!props.clickable || isFlipped.value || !props.card) return
  
  isFlipped.value = true
  emit('flip')
  
  setTimeout(() => {
    emit('flipComplete')
  }, props.flipDuration)
}

const reset = () => {
  isFlipped.value = false
}

defineExpose({ reset, isFlipped })
</script>

<template>
  <div class="card-container">
    <div 
      class="card"
      :class="{ 'is-flipped': isFlipped }"
      :style="{ '--flip-duration': `${flipDuration}ms` }"
      @click="handleClick"
    >
      <!-- 卡背面 (初始显示) -->
      <div class="card-face card-back">
        <slot name="back">
          <div class="card-back-content">
            <div class="card-back-border">
              <span class="card-back-symbol">✦</span>
            </div>
          </div>
        </slot>
      </div>
      
      <!-- 卡正面 (翻转后显示) -->
      <div 
        class="card-face card-front"
        :class="{ 'is-reversed': card?.isReversed }"
      >
        <slot name="front" :card="card">
          <template v-if="card">
            <span class="card-number">{{ card.number }}</span>
            <div class="card-image">{{ card.symbol }}</div>
            <span class="card-name">{{ card.name }}</span>
            <span class="card-name-en">{{ card.nameEn }}</span>
            <span class="card-keywords">{{ card.keywords }}</span>
          </template>
        </slot>
      </div>
    </div>
    
    <!-- 位置标签 -->
    <span 
      v-if="position" 
      class="position-label"
      :class="labelPosition === 'inside' ? 'label-inside' : 'label-bottom'"
    >{{ position }}</span>
  </div>
</template>

<style scoped>
/* ========== 容器 ========== */
.card-container {
  --card-width: 80px;
  --card-ratio: 1.6;
  --card-radius: 8px;
  --flip-duration: 600ms;
  
  position: relative;
  width: var(--card-width);
  height: calc(var(--card-width) * var(--card-ratio));
  perspective: 1000px;
}

/* sm: 640px+ */
@media (min-width: 640px) {
  .card-container {
    --card-width: 100px;
    --card-radius: 10px;
  }
}

/* md: 768px+ */
@media (min-width: 768px) {
  .card-container {
    --card-width: 110px;
    --card-radius: 12px;
  }
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  .card-container {
    --card-width: 120px;
    --card-radius: 14px;
  }
}

/* xl: 1280px+ */
@media (min-width: 1280px) {
  .card-container {
    --card-width: 140px;
    --card-radius: 16px;
  }
}

/* ========== 卡片主体 ========== */
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform var(--flip-duration) ease-in-out;
  border-radius: var(--card-radius);
}

/* 悬停效果 */
.card:not(.is-flipped):hover {
  transform: translateY(-6px) rotateX(5deg);
  transition: transform 0.3s ease;
}

.card:not(.is-flipped):hover .card-back {
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 215, 0, 0.2);
}

/* 翻转状态 - 关键：让两面同向旋转 */
.card.is-flipped {
  transform: rotateY(180deg);
}

/* ========== 卡片两面通用 ========== */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.25),
    0 8px 25px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* ========== 卡背面 ========== */
.card-back {
  transform: rotateY(0deg);
  background: linear-gradient(145deg, #2a1a4a 0%, #1a1a2e 50%, #0d0d1a 100%);
  border: 2px solid var(--gold);
}

@media (min-width: 768px) {
  .card-back {
    border-width: 3px;
  }
}

.card-back-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.card-back-border {
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--gold);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    linear-gradient(45deg, transparent 48%, rgba(255, 215, 0, 0.03) 50%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(255, 215, 0, 0.03) 50%, transparent 52%);
  background-size: 20px 20px;
}

.card-back-symbol {
  font-size: 1.5rem;
  color: var(--gold);
  text-shadow: 
    0 0 15px rgba(255, 215, 0, 0.7),
    0 0 30px rgba(255, 215, 0, 0.4);
  animation: glow-pulse 2.5s ease-in-out infinite;
}

@media (min-width: 640px) {
  .card-back-symbol {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .card-back-symbol {
    font-size: 2.5rem;
  }
}

@keyframes glow-pulse {
  0%, 100% { 
    opacity: 0.9;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.08);
  }
}

/* ========== 卡正面 ========== */
.card-front {
  transform: rotateY(-180deg);
  background: linear-gradient(180deg, #f8f4eb 0%, #ebe3d3 50%, #ddd4c4 100%);
  border: 2px solid var(--gold-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
}

@media (min-width: 640px) {
  .card-front {
    padding: 8px;
  }
}

@media (min-width: 768px) {
  .card-front {
    padding: 10px;
  }
}

@media (min-width: 1024px) {
  .card-front {
    border-width: 3px;
    padding: 12px;
  }
}

/* 逆位旋转 */
.card-front.is-reversed {
  transform: rotateY(-180deg) rotate(180deg);
}

/* 光泽层 */
.card-front::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    transparent 40%,
    transparent 60%,
    rgba(0, 0, 0, 0.03) 100%
  );
  pointer-events: none;
}

/* ========== 卡片正面内容 ========== */
.card-number { 
  font-size: 0.5rem; 
  color: #8b7355; 
  font-weight: 600;
  line-height: 1;
}

@media (min-width: 640px) {
  .card-number {
    font-size: 0.6rem;
  }
}

@media (min-width: 1024px) {
  .card-number {
    font-size: 0.7rem;
  }
}

.card-image {
  width: 90%;
  flex: 1;
  margin: 3px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c9b898 100%);
  border: 1px solid var(--gold-dark);
  box-shadow: 
    inset 0 1px 4px rgba(255, 255, 255, 0.4), 
    inset 0 -1px 4px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .card-image {
    font-size: 1.5rem;
    margin: 4px 0;
    border-radius: 5px;
  }
}

@media (min-width: 768px) {
  .card-image {
    font-size: 1.75rem;
    margin: 5px 0;
  }
}

@media (min-width: 1024px) {
  .card-image {
    font-size: 2rem;
    margin: 6px 0;
    border-radius: 6px;
  }
}

@media (min-width: 1280px) {
  .card-image {
    font-size: 2.5rem;
  }
}

.card-name { 
  font-size: 0.6rem; 
  font-weight: 700; 
  color: #4a3728; 
  text-align: center; 
  margin: 2px 0;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .card-name {
    font-size: 0.7rem;
    margin: 3px 0;
  }
}

@media (min-width: 1024px) {
  .card-name {
    font-size: 0.85rem;
    margin: 4px 0;
  }
}

.card-name-en { 
  font-size: 0.45rem; 
  color: #8b7355; 
  text-align: center;
  line-height: 1;
}

@media (min-width: 640px) {
  .card-name-en {
    font-size: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .card-name-en {
    font-size: 0.6rem;
  }
}

.card-keywords { 
  font-size: 0.4rem; 
  color: #6b5a4a; 
  text-align: center; 
  margin-top: 2px;
  line-height: 1.2;
  display: none;
}

@media (min-width: 640px) {
  .card-keywords {
    display: block;
    font-size: 0.45rem;
  }
}

@media (min-width: 1024px) {
  .card-keywords {
    font-size: 0.55rem;
    margin-top: 3px;
  }
}

/* ========== 位置标签 ========== */
.position-label {
  position: absolute;
  font-size: 0.6rem;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
  z-index: 10;
}

/* 标签在下方（1、3 牌阵）*/
.position-label.label-bottom {
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 640px) {
  .position-label.label-bottom {
    bottom: -20px;
    font-size: 0.7rem;
  }
}

@media (min-width: 1024px) {
  .position-label.label-bottom {
    bottom: -24px;
    font-size: 0.8rem;
  }
}

/* 标签在内部左侧（5+ 牌阵）*/
.position-label.label-inside {
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.45rem;
  color: var(--gold);
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 3px;
  border-radius: 3px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
}

@media (min-width: 640px) {
  .position-label.label-inside {
    left: 4px;
    font-size: 0.55rem;
    padding: 6px 4px;
    letter-spacing: 2px;
  }
}

@media (min-width: 1024px) {
  .position-label.label-inside {
    left: 5px;
    font-size: 0.65rem;
    padding: 8px 5px;
  }
}
</style>
