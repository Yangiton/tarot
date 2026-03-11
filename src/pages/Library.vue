<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { X, ChevronDown } from 'lucide-vue-next'
import { 
  majorArcana, 
  minorArcana, 
  suits,
  type TarotCard, 
  type MinorArcanaCard,
  type Suit,
  DECKS, 
  getDeckConfig, 
  getCardEnglishName 
} from '@/data'
import { getCardImageUrl, isImageDeck } from '@/data/card-images'
import { useTarot } from '@/composables/useTarot'
import { vHoloFoil } from '@/directives/vHoloFoil'
import TarotCardComponent from '@/components/tarot/TarotCard.vue'

const { currentDeckId, setDeckId, holoType } = useTarot()

const selectedCard = ref<TarotCard | MinorArcanaCard | null>(null)
const showDeckPicker = ref(false)

const currentDeck = computed(() => getDeckConfig(currentDeckId.value) || DECKS[1])
const useImages = computed(() => isImageDeck(currentDeckId.value))

// 花色顺序和配置
const suitOrder: Suit[] = ['wands', 'cups', 'swords', 'pentacles']

const openCard = (card: TarotCard | MinorArcanaCard) => {
  selectedCard.value = card
}

const closeCard = () => {
  selectedCard.value = null
}

const selectDeck = (deckId: string) => {
  setDeckId(deckId)
  showDeckPicker.value = false
}

/**
 * 根据卡片获取图片索引 (0-77)
 * major-0 ~ major-21 => 0-21
 * minor-wands-1~10, page, knight, queen, king => 22-35
 * minor-cups-... => 36-49
 * minor-swords-... => 50-63
 * minor-pentacles-... => 64-77
 */
const getCardIndex = (card: TarotCard | MinorArcanaCard): number => {
  const id = card.id
  
  // 大阿尔卡纳: major-0 ~ major-21
  if (id.startsWith('major-')) {
    const num = parseInt(id.replace('major-', ''), 10)
    return isNaN(num) ? 0 : num
  }
  
  // 小阿尔卡纳: minor-{suit}-{rank}
  const match = id.match(/^minor-(\w+)-(.+)$/)
  if (match) {
    const suit = match[1] as Suit
    const rankStr = match[2]
    const suitOffset: Record<Suit, number> = {
      wands: 22,
      cups: 36,
      swords: 50,
      pentacles: 64
    }
    // 宫廷牌映射
    const courtRanks: Record<string, number> = {
      page: 11,
      knight: 12,
      queen: 13,
      king: 14
    }
    const rank = courtRanks[rankStr] || parseInt(rankStr, 10)
    return (suitOffset[suit] || 22) + rank - 1
  }
  
  return 0
}

// 将 MinorArcanaCard 转换为兼容 TarotCard 的格式
const toDisplayCard = (card: MinorArcanaCard): TarotCard & MinorArcanaCard => {
  return {
    ...card,
    number: String(card.rank)
  } as TarotCard & MinorArcanaCard
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

        <!-- Minor Arcana Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <section>
            <h2 class="text-sm md:text-lg font-semibold text-gold mb-1 md:mb-2">
              小阿尔卡纳 (Minor Arcana)
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              56张反映日常生活细节的牌
            </p>
            
            <!-- 四种花色 -->
            <div class="space-y-6">
              <div v-for="suit in suitOrder" :key="suit" class="suit-section">
                <h3 class="text-xs md:text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span class="text-base">{{ suits[suit].symbol }}</span>
                  <span>{{ suits[suit].name }} ({{ suits[suit].nameEn }})</span>
                  <span class="text-muted-foreground text-[10px]">· {{ suits[suit].element === 'fire' ? '🔥 火' : suits[suit].element === 'water' ? '💧 水' : suits[suit].element === 'air' ? '💨 风' : '🌍 土' }}</span>
                </h3>
                <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 gap-3 md:gap-4">
                  <TarotCardComponent
                    v-for="card in minorArcana[suit]"
                    :key="card.id"
                    :card="toDisplayCard(card)"
                    :deck-id="currentDeckId"
                    :holo-type="holoType"
                    static
                    @click="openCard(card)"
                  />
                </div>
              </div>
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
                <p class="text-xs text-muted-foreground">{{ selectedCard.nameEn }}{{ (selectedCard as TarotCard).number ? ` · ${(selectedCard as TarotCard).number}` : '' }}</p>
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
