<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { useTarot } from '@/composables/useTarot'

const router = useRouter()
const { drawnCards, summary, isDrawn, resetReading } = useTarot()

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
          <div class="glass-card p-4 md:p-6 border-l-4 border-l-gold">
            <!-- Card Header -->
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl md:text-4xl">{{ card.symbol }}</span>
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-semibold text-gold">{{ card.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ card.position }}</p>
              </div>
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  card.isReversed 
                    ? 'bg-red-900/50 text-red-300' 
                    : 'bg-green-900/50 text-green-300'
                ]"
              >
                {{ card.isReversed ? '逆位' : '正位' }}
              </span>
            </div>
            
            <!-- Card Content -->
            <div class="space-y-4 text-sm md:text-base">
              <div>
                <h4 class="text-foreground font-medium mb-2">牌义解读</h4>
                <p class="text-muted-foreground leading-relaxed">
                  {{ card.isReversed ? card.reversed : card.upright }}
                </p>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="kw in card.keywords.split('、')" 
                  :key="kw"
                  class="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs"
                >
                  {{ kw }}
                </span>
              </div>
              
              <div v-if="card.note">
                <h4 class="text-foreground font-medium mb-2">象征意义</h4>
                <p class="text-muted-foreground leading-relaxed">{{ card.note }}</p>
              </div>
              
              <div v-if="card.description">
                <h4 class="text-foreground font-medium mb-2">卡面描述</h4>
                <p class="text-muted-foreground leading-relaxed">{{ card.description }}</p>
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
