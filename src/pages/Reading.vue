<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import TarotCard from '@/components/tarot/TarotCard.vue'
import { useTarot } from '@/composables/useTarot'

const router = useRouter()
const { drawnCards, summary, isDrawn, resetReading, currentDeckId, holoType } = useTarot()

onMounted(() => {
  if (!isDrawn.value) {
    router.replace('/')
  }
})

const goBack = () => {
  router.push('/')
}

const handleReset = () => {
  resetReading()
  router.push('/')
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header Bar -->
    <header class="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 border-b border-gold/15 bg-background/50 backdrop-blur-sm">
      <Button variant="ghost" size="sm" @click="goBack">
        <ArrowLeft class="w-4 h-4 mr-1" />
        <span class="hidden sm:inline">返回</span>
      </Button>
      
      <h2 class="text-sm md:text-lg font-bold gold-title">✦ 牌阵解读 ✦</h2>
      
      <Button variant="outline" size="sm" @click="handleReset">
        <RefreshCw class="w-4 h-4 sm:mr-1" />
        <span class="hidden sm:inline">重新抽牌</span>
      </Button>
    </header>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-6">
      <div class="max-w-2xl mx-auto space-y-4">
        <!-- Card Interpretations -->
        <Motion
          v-for="(card, index) in drawnCards"
          :key="card.id"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.4, delay: index * 0.15 }"
        >
          <div class="glass-card p-4 md:p-6">
            <div class="reading-card-layout">
              <!-- 左侧：静态卡片展示 -->
              <div class="reading-card-left">
                <div class="reading-card-wrapper">
                  <TarotCard
                    :card="card"
                    :deck-id="currentDeckId"
                    :holo-type="holoType"
                    :clickable="false"
                    static
                  />
                </div>
              </div>
              
              <!-- 右侧：卡片信息和解读 -->
              <div class="reading-card-right">
                <!-- 卡片标题 -->
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 class="text-lg md:text-xl font-semibold text-gold">{{ card.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ card.position }}</p>
                  </div>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium flex-shrink-0',
                      card.isReversed 
                        ? 'bg-red-900/50 text-red-300' 
                        : 'bg-green-900/50 text-green-300'
                    ]"
                  >
                    {{ card.isReversed ? '逆位' : '正位' }}
                  </span>
                </div>
                
                <!-- 关键词 -->
                <div class="flex flex-wrap gap-1.5 mb-4">
                  <span 
                    v-for="kw in card.keywords.split('、')" 
                    :key="kw"
                    class="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs"
                  >
                    {{ kw }}
                  </span>
                </div>
                
                <!-- 牌义解读 -->
                <div class="space-y-3 text-sm md:text-base">
                  <div>
                    <h4 class="text-foreground font-medium mb-1.5">牌义解读</h4>
                    <p class="text-muted-foreground leading-relaxed">
                      {{ card.isReversed ? card.reversed : card.upright }}
                    </p>
                  </div>
                  
                  <div v-if="card.note">
                    <h4 class="text-foreground font-medium mb-1.5">象征意义</h4>
                    <p class="text-muted-foreground leading-relaxed">{{ card.note }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Summary Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: drawnCards.length * 0.15 }"
        >
          <div class="glass-card p-4 md:p-6 border border-gold/20 bg-gold/5">
            <h3 class="text-lg md:text-xl font-semibold text-gold mb-4">✦ 综合指引 ✦</h3>
            <p class="text-muted-foreground leading-loose text-sm md:text-base">{{ summary }}</p>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reading-card-layout {
  display: flex;
  gap: 1rem;
}

.reading-card-left {
  flex-shrink: 0;
}

.reading-card-right {
  flex: 1;
  min-width: 0;
}

.reading-card-wrapper {
  --card-width: 90px;
}

@media (min-width: 640px) {
  .reading-card-layout {
    gap: 1.5rem;
  }
  
  .reading-card-wrapper {
    --card-width: 110px;
  }
}

@media (min-width: 768px) {
  .reading-card-wrapper {
    --card-width: 130px;
  }
}

.reading-card-wrapper :deep(.card-wrapper) {
  width: var(--card-width);
  height: calc(var(--card-width) * 1.709);
}
</style>
