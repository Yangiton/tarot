<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { X, ChevronDown } from 'lucide-vue-next'
import { majorArcana, type TarotCard, DECKS, getDeckConfig, getCardEnglishName } from '@/data'
import { getCardImageUrl, isImageDeck } from '@/data/card-images'
import { useTarot } from '@/composables/useTarot'
import { vHoloFoil } from '@/directives/vHoloFoil'
import TarotCardComponent from '@/components/tarot/TarotCard.vue'

const { currentDeckId, setDeckId, holoType } = useTarot()

const selectedCard = ref<TarotCard | null>(null)
const showDeckPicker = ref(false)

const currentDeck = computed(() => getDeckConfig(currentDeckId.value) || DECKS[1])
const useImages = computed(() => isImageDeck(currentDeckId.value))

const openCard = (card: TarotCard) => {
  selectedCard.value = card
}

const closeCard = () => {
  selectedCard.value = null
}

const selectDeck = (deckId: string) => {
  setDeckId(deckId)
  showDeckPicker.value = false
}

const getCardIndex = (card: TarotCard): number => {
  // id 格式: "major-0", "major-1", ... "major-21"
  const match = card.id.match(/(\d+)$/)
  return match ? parseInt(match[1], 10) : 0
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-3 md:py-4 px-4 border-b border-gold/15">
      <h1 class="text-base md:text-xl font-bold gold-title">✦ 牌库 ✦</h1>
      <p class="text-muted-foreground text-[10px] md:text-xs mt-0.5">探索塔罗的奥秘</p>
      
      <!-- 牌组切换按钮 -->
      <div class="relative inline-block mt-2">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-full text-xs text-gold transition-colors"
          @click="showDeckPicker = !showDeckPicker"
        >
          <span>{{ currentDeck.name }}</span>
          <ChevronDown class="w-3.5 h-3.5" :class="showDeckPicker && 'rotate-180'" />
        </button>
        
        <!-- 牌组选择器下拉 -->
        <Transition name="fade">
          <div
            v-if="showDeckPicker"
            class="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 min-w-[200px] glass-card border border-gold/30 rounded-lg overflow-hidden"
          >
            <button
              v-for="deck in DECKS"
              :key="deck.id"
              class="w-full px-4 py-2.5 text-left hover:bg-gold/10 transition-colors"
              :class="deck.id === currentDeckId && 'bg-gold/15'"
              @click="selectDeck(deck.id)"
            >
              <span class="text-xs font-medium text-foreground block">{{ deck.name }}</span>
              <span class="text-[10px] text-muted-foreground">{{ deck.description }}</span>
            </button>
          </div>
        </Transition>
      </div>
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
            
            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4">
              <TarotCardComponent
                v-for="card in majorArcana"
                :key="card.id"
                :card="card"
                :deck-id="currentDeckId"
                :holo-type="holoType"
                static
                @click="openCard(card)"
              />
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
              <!-- 图片牌组显示缩略图 -->
              <template v-if="useImages">
                <div
                  v-holo-foil="{ type: holoType }"
                  class="w-12 h-16 md:w-14 md:h-20 rounded overflow-hidden flex-shrink-0"
                >
                  <img
                    :src="getCardImageUrl(getCardIndex(selectedCard), currentDeckId)"
                    :alt="getCardEnglishName(getCardIndex(selectedCard))"
                    class="w-full h-full object-cover"
                  />
                </div>
              </template>
              <template v-else>
                <span class="text-3xl md:text-4xl">{{ selectedCard.symbol }}</span>
              </template>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
