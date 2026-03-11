<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Motion, AnimatePresence } from 'motion-v'
import TipsBox from '@/components/TipsBox.vue'
import TarotCard from '@/components/tarot/TarotCard.vue'
import AppFooter from '@/components/AppFooter.vue'
import Button from '@/components/ui/button.vue'
import { useTarot } from '@/composables/useTarot'

const router = useRouter()
const {
  currentSpread,
  drawnCards,
  isDrawn,
  allFlipped,
  positions,
  selectSpread,
  drawCards,
  flipCard,
  resetReading
} = useTarot()

const spreads = [
  { count: 1, name: '单牌' },
  { count: 3, name: '三牌阵' },
  { count: 5, name: '五牌阵' }
] as const

const cardRefs = ref<Record<number, any>>({})

const setCardRef = (el: unknown, index: number) => {
  cardRefs.value[index] = el
}

const dateDisplay = computed(() => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
  }
  return now.toLocaleDateString('zh-CN', options)
})

const hint = computed(() => {
  if (!isDrawn.value) return '选择牌阵，然后点击抽牌'
  if (!allFlipped.value) return '点击卡牌翻开查看'
  return '点击下方查看解读'
})

const handleSelectSpread = (count: number) => {
  selectSpread(count as 1 | 3 | 5)
}

const handleDraw = () => {
  drawCards()
}

const handleFlip = () => {
  flipCard()
}

const handleReset = () => {
  resetReading()
  Object.values(cardRefs.value).forEach((ref: any) => ref?.reset?.())
}

const goToReading = () => {
  if (allFlipped.value) {
    router.push('/reading')
  }
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden px-4 md:px-8">
    <!-- Header -->
    <Motion
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <header class="text-center py-4 md:py-6 flex-shrink-0">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold gold-title">
          ✦ 塔罗牌占卜 ✦
        </h1>
        <p class="text-muted-foreground text-sm md:text-base mt-1 tracking-widest">
          聆听宇宙的低语
        </p>
        <p class="text-muted-foreground/60 text-xs md:text-sm mt-2">
          {{ dateDisplay }}
        </p>
      </header>
    </Motion>

    <!-- Tips (PC only) -->
    <div class="hidden md:block flex-shrink-0">
      <TipsBox />
    </div>

    <!-- Spread Selector -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
    >
      <div class="flex justify-center gap-2 md:gap-3 py-3 flex-shrink-0">
        <button 
          v-for="spread in spreads" 
          :key="spread.count"
          :class="[
            'px-4 md:px-6 py-2 text-sm md:text-base rounded-full border-2 transition-all',
            currentSpread === spread.count 
              ? 'bg-gradient-to-r from-gold to-gold-light text-background border-transparent shadow-lg shadow-gold/30' 
              : 'border-gold/50 text-gold hover:border-gold hover:bg-gold/10',
            isDrawn ? 'opacity-50 cursor-not-allowed' : ''
          ]"
          :disabled="isDrawn"
          @click="handleSelectSpread(spread.count)"
        >
          {{ spread.name }}
        </button>
      </div>
    </Motion>

    <!-- Cards Area -->
    <div class="flex-1 flex justify-center items-center gap-3 md:gap-5 min-h-0 py-4">
      <AnimatePresence>
        <Motion
          v-for="(card, index) in drawnCards"
          :key="card.id + '-' + index"
          :initial="{ opacity: 0, scale: 0.8, y: 30 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.8 }"
          :transition="{ duration: 0.4, delay: index * 0.1 }"
          class="card-wrapper"
        >
          <TarotCard 
            :ref="(el) => setCardRef(el, index)"
            :card="card"
            :position="positions[index]"
            :clickable="true"
            @flip="handleFlip"
          />
        </Motion>
      </AnimatePresence>
      
      <Motion
        v-if="!isDrawn"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        class="text-muted-foreground text-center"
      >
        <p class="text-sm md:text-base">选择牌阵后点击抽牌</p>
      </Motion>
    </div>

    <!-- Action Area -->
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
    >
      <div class="flex-shrink-0 text-center py-4 min-h-[100px] flex flex-col justify-center items-center gap-3">
        <Button 
          v-if="!isDrawn" 
          size="lg"
          @click="handleDraw"
        >
          开始抽牌
        </Button>
        
        <template v-else>
          <p class="text-sm text-muted-foreground">{{ hint }}</p>
          <div class="flex gap-3">
            <Button variant="outline" size="sm" @click="handleReset">
              重新抽牌
            </Button>
            <Button 
              v-if="allFlipped"
              size="sm"
              @click="goToReading"
            >
              查看解读 →
            </Button>
          </div>
        </template>
      </div>
    </Motion>

    <!-- Footer (PC only) -->
    <div class="hidden md:block flex-shrink-0">
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  @apply transition-transform hover:-translate-y-2;
}
</style>
