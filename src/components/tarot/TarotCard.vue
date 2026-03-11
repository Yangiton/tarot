<script setup lang="ts">
import { ref } from 'vue'
import type { DrawnCard } from '@/data'

interface Props {
  card?: DrawnCard
  position?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true
})

const emit = defineEmits<{
  flip: []
}>()

const isFlipped = ref(false)

const handleClick = () => {
  if (!props.clickable || isFlipped.value || !props.card) return
  isFlipped.value = true
  emit('flip')
}

const reset = () => {
  isFlipped.value = false
}

defineExpose({ reset, isFlipped })
</script>

<template>
  <div class="card-slot">
    <div 
      class="card" 
      :class="{ flipped: isFlipped }"
      @click="handleClick"
    >
      <!-- 卡背 -->
      <div class="card-face card-back">
        <div class="card-back-design">
          <span class="card-back-symbol">✦</span>
        </div>
      </div>
      
      <!-- 卡正面 -->
      <div 
        class="card-face card-front" 
        :class="{ 'is-reversed': card?.isReversed }"
        v-if="card"
      >
        <span class="card-number">{{ card.number }}</span>
        <div class="card-image">{{ card.symbol }}</div>
        <span class="card-name">{{ card.name }}</span>
        <span class="card-name-en">{{ card.nameEn }}</span>
        <span class="card-keywords">{{ card.keywords }}</span>
      </div>
    </div>
    <span class="position-label" v-if="position">{{ position }}</span>
  </div>
</template>

<style scoped>
.card-slot {
  position: relative;
  width: 140px;
  height: 230px;
  perspective: 800px;
}

@media (min-width: 768px) {
  .card-slot {
    width: 160px;
    height: 260px;
  }
}

@media (min-width: 1024px) {
  .card-slot {
    width: 180px;
    height: 300px;
  }
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .card {
    border-radius: 15px;
  }
}

.card:hover {
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 25px rgba(255, 215, 0, 0.25),
    0 0 50px rgba(255, 215, 0, 0.1);
}

.card.flipped { 
  transform: rotateY(180deg); 
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: inherit;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 卡背面 */
.card-back {
  background: 
    radial-gradient(circle at 30% 30%, rgba(100, 50, 150, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(50, 50, 150, 0.8) 0%, transparent 50%),
    linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #0f0f1e 100%);
  border: 2px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .card-back {
    border-width: 3px;
  }
}

.card-back::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(255, 215, 0, 0.03) 10deg,
      transparent 20deg
    );
  animation: rotate-bg 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate-bg {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-back-design {
  width: 80%;
  height: 85%;
  border: 2px solid var(--gold);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255, 215, 0, 0.02) 8px, rgba(255, 215, 0, 0.02) 16px),
    repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255, 215, 0, 0.02) 8px, rgba(255, 215, 0, 0.02) 16px);
  position: relative;
  z-index: 1;
  box-shadow: 
    inset 0 0 20px rgba(255, 215, 0, 0.1),
    0 0 15px rgba(255, 215, 0, 0.1);
}

.card-back-symbol {
  font-size: 2.5rem;
  color: var(--gold);
  text-shadow: 
    0 0 15px rgba(255, 215, 0, 0.8),
    0 0 30px rgba(255, 215, 0, 0.5);
  animation: pulse-glow 2.5s ease-in-out infinite;
}

@media (min-width: 768px) {
  .card-back-symbol {
    font-size: 3.5rem;
  }
}

@keyframes pulse-glow {
  0%, 100% { 
    text-shadow: 
      0 0 15px rgba(255, 215, 0, 0.8),
      0 0 30px rgba(255, 215, 0, 0.5);
    transform: scale(1);
  }
  50% { 
    text-shadow: 
      0 0 25px rgba(255, 215, 0, 1),
      0 0 50px rgba(255, 215, 0, 0.7);
    transform: scale(1.05);
  }
}

/* 卡正面 */
.card-front {
  background: linear-gradient(180deg, #f8f4eb 0%, #ebe3d3 50%, #ddd4c4 100%);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid var(--gold-dark);
  position: relative;
}

@media (min-width: 768px) {
  .card-front {
    padding: 15px;
    border-width: 3px;
  }
}

.card-front.is-reversed {
  transform: rotateY(180deg) rotate(180deg);
}

.card-front::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.4) 0%, 
    transparent 40%,
    transparent 60%,
    rgba(0, 0, 0, 0.05) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.card-number { 
  font-size: 0.75rem; 
  color: #8b7355; 
  font-weight: 600; 
  position: relative;
  z-index: 2;
}

.card-image {
  width: 90%;
  height: 50%;
  margin: 6px 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c9b898 100%);
  border: 1px solid var(--gold-dark);
  position: relative;
  z-index: 2;
  box-shadow: 
    inset 0 2px 6px rgba(255, 255, 255, 0.4), 
    inset 0 -2px 6px rgba(0, 0, 0, 0.1),
    0 3px 10px rgba(0, 0, 0, 0.12);
}

@media (min-width: 768px) {
  .card-image {
    font-size: 2.5rem;
    height: 55%;
    margin: 8px 0;
  }
}

@media (min-width: 1024px) {
  .card-image {
    font-size: 3rem;
  }
}

.card-name { 
  font-size: 0.85rem; 
  font-weight: 700; 
  color: #4a3728; 
  text-align: center; 
  margin: 4px 0; 
  position: relative;
  z-index: 2;
}

@media (min-width: 768px) {
  .card-name {
    font-size: 1rem;
    margin: 5px 0;
  }
}

.card-name-en { 
  font-size: 0.6rem; 
  color: #8b7355; 
  text-align: center; 
  position: relative;
  z-index: 2;
}

@media (min-width: 768px) {
  .card-name-en {
    font-size: 0.7rem;
  }
}

.card-keywords { 
  font-size: 0.55rem; 
  color: #6b5a4a; 
  text-align: center; 
  margin-top: 4px; 
  position: relative;
  z-index: 2;
}

@media (min-width: 768px) {
  .card-keywords {
    font-size: 0.65rem;
  }
}

.position-label {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
}

@media (min-width: 768px) {
  .position-label {
    bottom: -28px;
    font-size: 0.85rem;
  }
}
</style>
