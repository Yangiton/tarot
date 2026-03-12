<script setup lang="ts">
import { useIntervalFn, useCycleList } from '@vueuse/core'
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-vue-next'
import { useTarot } from '@/composables/useTarot'

const { tips } = useTarot()

const { state: currentTip, index: currentIndex, next, prev, go } = useCycleList(tips)

const handleNext = () => {
  next()
}
const handlePrev = () => {
  prev()
}
const handleGo = (i: number) => {
  go(i)
}

useIntervalFn(handleNext, 8000)
</script>

<template>
  <div class="max-w-xl mx-auto glass-card p-4 mb-4 border-gold/20">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 text-gold text-sm font-medium">
        <Lightbulb class="w-4 h-4" />
        <span>{{ $t('home.tipsTitle') }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="w-7 h-7 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors"
          @click="handlePrev"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-xs text-muted-foreground min-w-[40px] text-center">
          {{ currentIndex + 1 }}/{{ tips.length }}
        </span>
        <button
          class="w-7 h-7 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors"
          @click="handleNext"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="tips-content">
      <p class="text-sm text-muted-foreground leading-relaxed" v-html="currentTip.text"></p>
    </div>

    <div class="flex justify-center gap-1.5 mt-3">
      <span
        v-for="(_, index) in tips"
        :key="index"
        :class="[
          'h-1.5 rounded-full cursor-pointer transition-all',
          index === currentIndex ? 'w-5 bg-gold' : 'w-1.5 bg-gold/30 hover:bg-gold/50',
        ]"
        @click="handleGo(index)"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.tips-content {
  height: 2.6em;
  line-height: 1.3em;
  overflow: hidden;
}
</style>
