<script setup lang="ts">
import { ref, computed } from 'vue'
import TarotCard from './components/TarotCard.vue'
import { drawCards, type DrawnCard } from './utils/tarot'

const drawnCards = ref<DrawnCard[]>([])
const isDrawing = ref(false)
const spreadType = ref<'single' | 'three'>('single')

const spreadName = computed(() => 
  spreadType.value === 'single' ? '单牌占卜' : '三牌阵'
)

async function handleDraw() {
  isDrawing.value = true
  drawnCards.value = []
  
  await new Promise(r => setTimeout(r, 500))
  
  const count = spreadType.value === 'single' ? 1 : 3
  drawnCards.value = drawCards(count)
  isDrawing.value = false
}

function reset() {
  drawnCards.value = []
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Tarot</h1>
      <p class="subtitle">探索内心的指引</p>
    </header>

    <main class="main">
      <div v-if="drawnCards.length === 0" class="draw-section">
        <div class="spread-selector">
          <button 
            :class="['spread-btn', { active: spreadType === 'single' }]"
            @click="spreadType = 'single'"
          >
            单牌占卜
          </button>
          <button 
            :class="['spread-btn', { active: spreadType === 'three' }]"
            @click="spreadType = 'three'"
          >
            三牌阵
          </button>
        </div>
        
        <p class="hint">
          {{ spreadType === 'single' 
            ? '抽取一张牌，获得当下的指引' 
            : '过去 - 现在 - 未来' }}
        </p>
        
        <button 
          class="draw-btn" 
          @click="handleDraw"
          :disabled="isDrawing"
        >
          <span v-if="isDrawing" class="loading"></span>
          <span v-else>抽牌</span>
        </button>
      </div>

      <div v-else class="result-section">
        <h2 class="spread-title">{{ spreadName }}</h2>
        
        <div class="cards-container" :class="{ 'single': drawnCards.length === 1 }">
          <div 
            v-for="(card, index) in drawnCards" 
            :key="card.card.id"
            class="card-wrapper"
          >
            <p v-if="drawnCards.length === 3" class="position-label">
              {{ ['过去', '现在', '未来'][index] }}
            </p>
            <TarotCard :card="card" />
          </div>
        </div>

        <button class="reset-btn" @click="reset">重新抽牌</button>
      </div>
    </main>

    <footer class="footer">
      <p>塔罗牌仅供娱乐和自我反思，不构成任何决策建议</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 2rem 1rem;
}

.header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle {
  color: #94a3b8;
  margin-top: 0.5rem;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.draw-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spread-selector {
  display: flex;
  gap: 0.5rem;
}

.spread-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.spread-btn:hover {
  border-color: #6366f1;
  color: #e2e8f0;
}

.spread-btn.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.hint {
  color: #64748b;
  text-align: center;
}

.draw-btn {
  padding: 1rem 3rem;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 1rem;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 150px;
  min-height: 56px;
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
}

.draw-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff40;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.spread-title {
  color: #e2e8f0;
  font-weight: 500;
}

.cards-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cards-container.single {
  justify-content: center;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.position-label {
  color: #94a3b8;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.reset-btn {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid #334155;
  color: #94a3b8;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #6366f1;
  color: #e2e8f0;
}

.footer {
  text-align: center;
  padding: 2rem 1rem;
  color: #475569;
  font-size: 0.75rem;
}
</style>
