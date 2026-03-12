<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { ChevronDown } from 'lucide-vue-next'
import { REVERSED_PROBABILITY, spreads, type SpreadType } from '@/data'
import { useTarot } from '@/composables/useTarot'
import type { HoloType } from '@/directives/vHoloFoil'

const { currentSpread, selectSpread, holoType, setHoloType, useFullDeck, setUseFullDeck } =
  useTarot()

const reversedPercent = Math.round(REVERSED_PROBABILITY * 100)

const spreadOptions = computed(() => {
  return Object.entries(spreads).map(([key, config]) => ({
    value: Number(key) as SpreadType,
    name: config.name,
    description: config.description,
    count: config.positions.length,
  }))
})

const currentSpreadConfig = computed(() => {
  return spreads[String(currentSpread.value)]
})

// 全息效果类型选项
const holoOptions: { value: HoloType; name: string; description: string }[] = [
  { value: 'normal', name: '普通全息', description: '经典彩虹条纹效果' },
  { value: 'cosmos', name: '宇宙全息', description: '梦幻星空背景' },
  { value: 'rainbow', name: '彩虹全息', description: '强烈彩虹渐变' },
  { value: 'galaxy', name: '银河全息', description: '深空星云效果' },
  { value: 'radiant', name: '光辉全息', description: '金属放射状' },
  { value: 'pixel', name: '像素全息', description: '复古点阵效果' },
]

const currentHoloConfig = computed(() => {
  return holoOptions.find(o => o.value === holoType.value)
})

const handleSpreadChange = (e: Event) => {
  const value = Number((e.target as HTMLSelectElement).value) as SpreadType
  selectSpread(value)
}

const handleHoloChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as HoloType
  setHoloType(value)
}

// 牌组范围选项
const deckRangeOptions = [
  { value: false, name: '大阿尔卡纳', description: '22张代表人生重大主题的牌' },
  {
    value: true,
    name: '完整牌组',
    description: '78张牌（大阿尔卡纳 + 小阿尔卡纳）',
  },
]

const handleDeckRangeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value === 'true'
  setUseFullDeck(value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-3 md:py-4 px-4 border-b border-gold/15">
      <h1 class="text-base md:text-xl font-bold gold-title">✦ 设置 ✦</h1>
      <p class="text-muted-foreground text-[10px] md:text-xs mt-0.5">个性化你的占卜体验</p>
    </header>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-6">
      <div class="max-w-lg mx-auto space-y-6">
        <!-- Reading Settings -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4 }"
        >
          <section>
            <h2
              class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15"
            >
              占卜设置
            </h2>

            <div class="space-y-3">
              <!-- 牌阵选择 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">牌阵选择</p>
                    <p class="text-xs text-muted-foreground mt-1">选择占卜使用的牌阵</p>
                  </div>
                </div>

                <div class="relative">
                  <select :value="currentSpread" @change="handleSpreadChange" class="spread-select">
                    <option v-for="opt in spreadOptions" :key="opt.value" :value="opt.value">
                      {{ opt.name }} ({{ opt.count }}张)
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none"
                  />
                </div>

                <p class="text-xs text-muted-foreground mt-2 pl-1">
                  {{ currentSpreadConfig?.description }}
                </p>
              </div>

              <!-- 逆位概率 -->
              <div class="glass-card p-4 flex items-center justify-between">
                <div>
                  <p class="text-sm md:text-base text-foreground">逆位概率</p>
                  <p class="text-xs text-muted-foreground mt-1">抽牌时出现逆位的概率</p>
                </div>
                <span class="px-3 py-1.5 bg-gold/15 text-gold rounded-full text-sm">
                  {{ reversedPercent }}%
                </span>
              </div>

              <!-- 牌组范围 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">牌组范围</p>
                    <p class="text-xs text-muted-foreground mt-1">选择抽牌使用的牌组范围</p>
                  </div>
                </div>

                <div class="relative">
                  <select
                    :value="useFullDeck"
                    @change="handleDeckRangeChange"
                    class="spread-select"
                  >
                    <option
                      v-for="opt in deckRangeOptions"
                      :key="String(opt.value)"
                      :value="opt.value"
                    >
                      {{ opt.name }}
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none"
                  />
                </div>

                <p class="text-xs text-muted-foreground mt-2 pl-1">
                  {{ deckRangeOptions.find(o => o.value === useFullDeck)?.description }}
                </p>
              </div>
            </div>
          </section>
        </Motion>

        <!-- Visual Effects -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.05 }"
        >
          <section>
            <h2
              class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15"
            >
              视觉效果
            </h2>

            <div class="space-y-3">
              <!-- 全息效果 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">全息效果</p>
                    <p class="text-xs text-muted-foreground mt-1">选择卡片的全息光效类型</p>
                  </div>
                </div>

                <div class="relative">
                  <select :value="holoType" @change="handleHoloChange" class="spread-select">
                    <option v-for="opt in holoOptions" :key="opt.value" :value="opt.value">
                      {{ opt.name }}
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none"
                  />
                </div>

                <p class="text-xs text-muted-foreground mt-2 pl-1">
                  {{ currentHoloConfig?.description }}
                </p>
              </div>
            </div>
          </section>
        </Motion>

        <!-- About Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.1 }"
        >
          <section>
            <h2
              class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15"
            >
              关于
            </h2>

            <div
              class="glass-card p-4 md:p-6 space-y-3 text-sm text-muted-foreground leading-relaxed"
            >
              <p>
                本应用基于经典的<span class="text-gold">韦特塔罗</span>（Rider-Waite Tarot），
                由亚瑟·韦特于 1909 年设计。
              </p>
              <p>
                塔罗牌是一面镜子，反映的是你内心深处的智慧。答案一直都在你心中，牌只是帮你看清它。
              </p>
              <p class="text-xs text-muted-foreground/60 italic">
                塔罗牌仅供娱乐和自我反思，不构成任何决策建议。
              </p>
            </div>
          </section>
        </Motion>

        <!-- Version -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.2 }"
        >
          <section>
            <h2
              class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15"
            >
              版本
            </h2>
            <p class="text-sm text-muted-foreground">v0.1.0</p>
          </section>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spread-select {
  @apply w-full py-2.5 px-4 pr-10;
  @apply bg-background/50 border border-gold/30 rounded-lg;
  @apply text-sm text-foreground;
  @apply appearance-none cursor-pointer;
  @apply focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30;
  @apply transition-colors;
}

.spread-select option {
  @apply bg-background text-foreground py-2;
}
</style>
