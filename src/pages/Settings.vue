<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Motion } from 'motion-v'
import { ChevronDown } from 'lucide-vue-next'
import { REVERSED_MODES, type SpreadType, type ReversedMode } from '@/data'
import { useTarot } from '@/composables/useTarot'
import { HOLO_PRESET_LIST } from '@/components/holo'
import type { SupportedLocale } from '@/i18n'

const { t, locale } = useI18n()
const {
  currentSpread,
  selectSpread,
  holoPreset,
  setHoloPreset,
  useFullDeck,
  setUseFullDeck,
  reversedMode,
  setReversedMode,
  spreads,
} = useTarot()

const reversedOptions = computed(() =>
  REVERSED_MODES.map(mode => ({
    value: mode.id,
    name: t(mode.nameKey),
    description: t(mode.descKey),
    percent: Math.round(mode.probability * 100),
  }))
)

const currentReversedConfig = computed(() =>
  reversedOptions.value.find(o => o.value === reversedMode.value)
)

const handleReversedModeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as ReversedMode
  setReversedMode(value)
}

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

// 使用预设配置生成选项
const holoOptions = computed(() =>
  HOLO_PRESET_LIST.map(preset => ({
    value: preset.id,
    name: preset.name[locale.value === 'zh' ? 'zh' : 'en'],
    description: preset.description[locale.value === 'zh' ? 'zh' : 'en'],
  }))
)

const currentHoloConfig = computed(() => {
  return holoOptions.value.find(o => o.value === holoPreset.value)
})

const handleSpreadChange = (e: Event) => {
  const value = Number((e.target as HTMLSelectElement).value) as SpreadType
  selectSpread(value)
}

const handleHoloChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  setHoloPreset(value)
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
  <div class="settings-page">
    <!-- Header -->
    <header class="settings-header">
      <h1 class="page-title">{{ $t('settings.title') }}</h1>
      <p class="page-subtitle">
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

              <!-- 逆位模式 -->
              <div class="glass-card p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="text-sm md:text-base text-foreground">
                      {{ $t('settings.reversedMode') }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ $t('settings.reversedModeDesc') }}
                    </p>
                  </div>
                </div>

                <div class="relative">
                  <select
                    :value="reversedMode"
                    @change="handleReversedModeChange"
                    class="spread-select"
                  >
                    <option v-for="opt in reversedOptions" :key="opt.value" :value="opt.value">
                      {{ opt.name }} ({{ opt.percent }}%)
                    </option>
                  </select>
                  <ChevronDown
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none"
                  />
                </div>

                <p class="text-xs text-muted-foreground mt-2 pl-1">
                  {{ currentReversedConfig?.description }}
                </p>
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
                  <select :value="holoPreset" @change="handleHoloChange" class="spread-select">
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
/**
 * 设置页样式
 * 设计系统：暗夜优雅 (Dark Elegant)
 */

.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ========== Header ========== */
.settings-header {
  flex-shrink: 0;
  text-align: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-overlay);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.page-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--accent);
  margin: 0;
}

@media (min-width: 768px) {
  .page-title {
    font-size: var(--text-xl);
  }
}

.page-subtitle {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  margin-top: var(--space-half);
}

/* ========== 下拉选择框 ========== */
.spread-select {
  width: 100%;
  padding: var(--space-2half) var(--space-4);
  padding-right: var(--space-10);
  background: var(--bg-void);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--fg-default);
  appearance: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  outline: none;
}

.spread-select:hover {
  border-color: var(--void-500);
}

.spread-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.spread-select option {
  background: var(--bg-card);
  color: var(--fg-default);
  padding: var(--space-2);
}

/* ========== 玻璃卡片覆盖 ========== */
:deep(.glass-card) {
  background: var(--bg-card);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  transition: border-color var(--duration-fast) var(--ease-out);
}

:deep(.glass-card:hover) {
  border-color: var(--void-500);
}
</style>
