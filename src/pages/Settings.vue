<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Motion } from 'motion-v'
import { ChevronDown } from 'lucide-vue-next'
import { REVERSED_PROBABILITY, type SpreadType } from '@/data'
import { useTarot } from '@/composables/useTarot'
import type { HoloType } from '@/directives/vHoloFoil'
import type { SupportedLocale } from '@/i18n'

const { t, locale } = useI18n()
const { currentSpread, selectSpread, holoType, setHoloType, useFullDeck, setUseFullDeck, spreads } =
  useTarot()

const reversedPercent = Math.round(REVERSED_PROBABILITY * 100)

const spreadOptions = computed(() => {
  return Object.entries(spreads.value).map(([key, config]) => ({
    value: Number(key) as SpreadType,
    name: config.name,
    description: config.description,
    count: config.positions.length,
  }))
})

const currentSpreadConfig = computed(() => {
  return spreads.value[String(currentSpread.value)]
})

const holoTypeKeys: HoloType[] = ['normal', 'cosmos', 'rainbow', 'galaxy', 'radiant', 'pixel']

const holoOptions = computed(() =>
  holoTypeKeys.map(key => ({
    value: key,
    name: t(`settings.holoOptions.${key}`),
    description: t(`settings.holoOptions.${key}Desc`),
  }))
)

const currentHoloConfig = computed(() => {
  return holoOptions.value.find(o => o.value === holoType.value)
})

const handleSpreadChange = (e: Event) => {
  const value = Number((e.target as HTMLSelectElement).value) as SpreadType
  selectSpread(value)
}

const handleHoloChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as HoloType
  setHoloType(value)
}

const deckRangeOptions = computed(() => [
  {
    value: false,
    name: t('settings.deckRangeMajor'),
    description: t('settings.deckRangeMajorDesc'),
  },
  { value: true, name: t('settings.deckRangeFull'), description: t('settings.deckRangeFullDesc') },
])

const handleDeckRangeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value === 'true'
  setUseFullDeck(value)
}

const languageOptions: { value: SupportedLocale; name: string }[] = [
  { value: 'zh', name: '简体中文' },
  { value: 'en', name: 'English' },
]

const handleLanguageChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as SupportedLocale
  locale.value = value
  localStorage.setItem('tarot-locale', value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-3 md:py-4 px-4 border-b border-gold/15">
      <h1 class="text-base md:text-xl font-bold gold-title">{{ $t('settings.title') }}</h1>
      <p class="text-muted-foreground text-[10px] md:text-xs mt-0.5">
        {{ $t('settings.subtitle') }}
      </p>
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
              {{ $t('settings.divinationSettings') }}
            </h2>

            <div class="space-y-3">
              <!-- 牌阵选择 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">
                      {{ $t('settings.spreadSelection') }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ $t('settings.spreadSelectionDesc') }}
                    </p>
                  </div>
                </div>

                <div class="relative">
                  <select :value="currentSpread" @change="handleSpreadChange" class="spread-select">
                    <option v-for="opt in spreadOptions" :key="opt.value" :value="opt.value">
                      {{ opt.name }} ({{ opt.count }}{{ $t('common.cards') }})
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
                  <p class="text-sm md:text-base text-foreground">
                    {{ $t('settings.reversedProbability') }}
                  </p>

                  <p class="text-xs text-muted-foreground mt-1">
                    {{ $t('settings.reversedProbabilityDesc') }}
                  </p>
                </div>
                <span class="px-3 py-1.5 bg-gold/15 text-gold rounded-full text-sm">
                  {{ reversedPercent }}%
                </span>
              </div>

              <!-- 牌组范围 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">
                      {{ $t('settings.deckRange') }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ $t('settings.deckRangeDesc') }}
                    </p>
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
              {{ $t('settings.visualEffects') }}
            </h2>

            <div class="space-y-3">
              <!-- 全息效果 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">
                      {{ $t('settings.holoEffect') }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ $t('settings.holoEffectDesc') }}
                    </p>
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

        <!-- Language -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.075 }"
        >
          <section>
            <h2
              class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15"
            >
              {{ $t('settings.language') }}
            </h2>

            <div class="space-y-3">
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">
                      {{ $t('settings.language') }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ $t('settings.languageDesc') }}
                    </p>
                  </div>
                </div>

                <div class="relative">
                  <select :value="locale" @change="handleLanguageChange" class="spread-select">
                    <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                      {{ opt.name }}
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none"
                  />
                </div>
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
              {{ $t('settings.about') }}
            </h2>

            <div
              class="glass-card p-4 md:p-6 space-y-3 text-sm text-muted-foreground leading-relaxed"
            >
              <p>
                <i18n-t keypath="settings.aboutText1" tag="span">
                  <template #tarot>
                    <span class="text-gold">{{ $t('settings.aboutTarotName') }}</span>
                  </template>
                </i18n-t>
              </p>
              <p>{{ $t('settings.aboutText2') }}</p>
              <p class="text-xs text-muted-foreground/60 italic">
                {{ $t('settings.aboutDisclaimer') }}
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
              {{ $t('settings.version') }}
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
