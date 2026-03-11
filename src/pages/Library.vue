<script setup lang="ts">
import { ref } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { X } from 'lucide-vue-next'
import { majorArcana, type TarotCard } from '@/data'

const selectedCard = ref<TarotCard | null>(null)

const openCard = (card: TarotCard) => {
  selectedCard.value = card
}

const closeCard = () => {
  selectedCard.value = null
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-3 md:py-4 px-4 border-b border-gold/15">
      <h1 class="text-base md:text-xl font-bold gold-title">✦ 牌库 ✦</h1>
      <p class="text-muted-foreground text-[10px] md:text-xs mt-0.5">探索塔罗的奥秘</p>
    </header>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-4 md:py-6">
      <div class="max-w-4xl mx-auto">
        <!-- Major Arcana Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <section class="mb-8">
            <h2 class="text-sm md:text-lg font-semibold text-gold mb-1 md:mb-2">
              大阿尔卡纳 (Major Arcana)
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              22张代表人生重大主题的牌
            </p>
            
            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 md:gap-3">
              <div
                v-for="card in majorArcana"
                :key="card.id"
                class="card-item glass-card p-2 md:p-3 text-center cursor-pointer hover:border-gold/50 transition-all hover:-translate-y-1"
                @click="openCard(card)"
              >
                <span class="text-xl md:text-2xl block mb-1">{{ card.symbol }}</span>
                <span class="text-[8px] md:text-[10px] text-muted-foreground block">{{ card.number }}</span>
                <span class="text-[10px] md:text-xs text-foreground block mt-0.5 truncate">{{ card.name }}</span>
              </div>
            </div>
          </section>
        </Motion>

        <!-- Minor Arcana Section (Coming Soon) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <section class="opacity-60">
            <h2 class="text-sm md:text-lg font-semibold text-gold mb-1 md:mb-2">
              小阿尔卡纳 (Minor Arcana)
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              56张反映日常生活细节的牌
            </p>
            
            <div class="glass-card p-4 md:p-6 text-center border-dashed">
              <span class="text-gold text-xs md:text-sm">即将推出</span>
            </div>
          </section>
        </Motion>
      </div>
    </div>

    <!-- Card Detail Modal -->
    <AnimatePresence>
      <div
        v-if="selectedCard"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeCard"
      >
        <!-- Backdrop -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="closeCard"
        />
        
        <!-- Modal Content -->
        <Motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          :transition="{ duration: 0.25 }"
          class="relative z-10 w-full max-w-md max-h-[85vh] overflow-hidden glass-card border border-gold/30"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-3 md:p-4 border-b border-gold/20">
            <div class="flex items-center gap-3">
              <span class="text-3xl md:text-4xl">{{ selectedCard.symbol }}</span>
              <div>
                <h3 class="text-base md:text-lg font-bold text-gold">{{ selectedCard.name }}</h3>
                <p class="text-xs text-muted-foreground">{{ selectedCard.nameEn }} · {{ selectedCard.number }}</p>
              </div>
            </div>
            <button 
              class="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              @click="closeCard"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-3 md:p-4 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-4">
            <!-- Keywords -->
            <div>
              <h4 class="text-xs text-gold font-medium mb-2">关键词</h4>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="kw in selectedCard.keywords.split('、')" 
                  :key="kw"
                  class="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs"
                >
                  {{ kw }}
                </span>
              </div>
            </div>
            
            <!-- Upright -->
            <div>
              <h4 class="text-xs text-green-400 font-medium mb-2">✦ 正位含义</h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">{{ selectedCard.upright }}</p>
            </div>
            
            <!-- Reversed -->
            <div>
              <h4 class="text-xs text-red-400 font-medium mb-2">✦ 逆位含义</h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">{{ selectedCard.reversed }}</p>
            </div>
            
            <!-- Description -->
            <div v-if="selectedCard.description">
              <h4 class="text-xs text-gold font-medium mb-2">卡面描述</h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">{{ selectedCard.description }}</p>
            </div>
            
            <!-- Note -->
            <div v-if="selectedCard.note">
              <h4 class="text-xs text-gold font-medium mb-2">象征意义</h4>
              <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">{{ selectedCard.note }}</p>
            </div>
          </div>
        </Motion>
      </div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.card-item {
  transition: all 0.2s ease;
}

.card-item:active {
  transform: scale(0.95);
}
</style>
