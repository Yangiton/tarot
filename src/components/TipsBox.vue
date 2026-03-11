<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-vue-next'
import { tips } from '@/data'

const currentIndex = ref(0)
let timer: number | null = null

const nextTip = () => {
  currentIndex.value = (currentIndex.value + 1) % tips.length
}

const prevTip = () => {
  currentIndex.value = (currentIndex.value - 1 + tips.length) % tips.length
}

onMounted(() => {
  timer = window.setInterval(nextTip, 8000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="max-w-xl mx-auto glass-card p-4 mb-4 border-gold/20">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 text-gold text-sm font-medium">
        <Lightbulb class="w-4 h-4" />
        <span>占卜小贴士</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          class="w-7 h-7 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors"
          @click="prevTip"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-xs text-muted-foreground min-w-[40px] text-center">
          {{ currentIndex + 1 }}/{{ tips.length }}
        </span>
        <button 
          class="w-7 h-7 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors"
          @click="nextTip"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div class="tips-content">
      <p 
        class="text-sm text-muted-foreground leading-relaxed"
        v-html="tips[currentIndex].text"
      ></p>
    </div>
    
    <div class="flex justify-center gap-1.5 mt-3">
      <span 
        v-for="(_, index) in tips" 
        :key="index"
        :class="[
          'h-1.5 rounded-full cursor-pointer transition-all',
          index === currentIndex ? 'w-5 bg-gold' : 'w-1.5 bg-gold/30 hover:bg-gold/50'
        ]"
        @click="currentIndex = index"
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
