<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DrawnCard } from '../utils/tarot'

const props = defineProps<{
  card: DrawnCard
}>()

const isFlipped = ref(false)
const isRevealed = ref(false)

onMounted(() => {
  setTimeout(() => {
    isFlipped.value = true
    setTimeout(() => {
      isRevealed.value = true
    }, 300)
  }, 100)
})
</script>

<template>
  <div class="tarot-card" :class="{ flipped: isFlipped }">
    <div class="card-inner">
      <div class="card-back">
        <div class="card-pattern">
          <div class="star"></div>
        </div>
      </div>
      <div class="card-front" :class="{ reversed: card.isReversed }">
        <div class="card-content">
          <span class="card-number">{{ card.card.number }}</span>
          <div class="card-symbol">{{ card.card.symbol }}</div>
          <h3 class="card-name">{{ card.card.name }}</h3>
          <p class="card-name-en">{{ card.card.nameEn }}</p>
          <p v-if="card.isReversed" class="reversed-label">逆位</p>
        </div>
        <div v-if="isRevealed" class="card-meaning">
          <p>{{ card.isReversed ? card.card.reversedMeaning : card.card.uprightMeaning }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-card {
  width: 200px;
  height: 320px;
  perspective: 1000px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.tarot-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4338ca;
}

.card-pattern {
  width: 80%;
  height: 90%;
  border: 1px solid #6366f180;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    radial-gradient(circle at 50% 50%, transparent 30%, #312e8140 31%, transparent 32%),
    repeating-linear-gradient(45deg, transparent, transparent 10px, #4338ca20 10px, #4338ca20 11px);
}

.star {
  width: 60px;
  height: 60px;
  background: #fcd34d;
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
}

.card-front {
  background: linear-gradient(180deg, #1e293b, #0f172a);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  border: 2px solid #334155;
}

.card-front.reversed {
  transform: rotateY(180deg) rotate(180deg);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
}

.card-number {
  font-size: 0.75rem;
  color: #6366f1;
  font-weight: 600;
}

.card-symbol {
  font-size: 3rem;
  margin: 0.5rem 0;
}

.card-name {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin: 0.5rem 0 0.25rem;
}

.card-name-en {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.reversed-label {
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #7c3aed40;
  color: #a78bfa;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.card-meaning {
  padding: 0.75rem;
  background: #1e1b4b80;
  border-top: 1px solid #334155;
}

.card-meaning p {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.5;
}
</style>
