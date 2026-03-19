<script setup lang="ts">
/**
 * Spreads.vue - 牌阵选择页
 *
 * 展示所有可选牌阵，选择后返回占卜页
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Motion } from 'motion-v'
import { ArrowLeft, Check } from 'lucide-vue-next'
import { useTarot } from '@/composables/useTarot'
import type { SpreadType } from '@/data'

const router = useRouter()
const { t } = useI18n()
const { currentSpread, selectSpread, spreads } = useTarot()

// 牌阵选项
const spreadOptions = computed(() => [
  {
    type: 1 as SpreadType,
    name: spreads.value['1']?.name || t('divination.singleCard'),
    desc: t('divination.spreadDesc1'),
    positions: [{ row: 0, col: 0 }],
  },
  {
    type: 3 as SpreadType,
    name: spreads.value['3']?.name,
    desc: t('divination.spreadDesc3'),
    positions: spreads.value['3']?.positions || [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
  },
  {
    type: 5 as SpreadType,
    name: spreads.value['5']?.name,
    desc: t('divination.spreadDesc5'),
    positions: spreads.value['5']?.positions || [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ],
  },
])

const handleSelect = (type: SpreadType) => {
  selectSpread(type)
  router.push('/divination')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="spreads-page">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack" :aria-label="t('divination.backLabel')">
      <ArrowLeft class="w-5 h-5" />
    </button>

    <!-- 页面标题 -->
    <Motion
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.3 }"
      class="page-header"
    >
      <h1 class="page-title">{{ t('divination.selectSpread') }}</h1>
      <p class="page-subtitle">{{ t('divination.selectSpreadDesc') }}</p>
    </Motion>

    <!-- 牌阵列表 -->
    <div class="spread-list">
      <Motion
        v-for="(option, index) in spreadOptions"
        :key="option.type"
        :initial="{ opacity: 0, x: -20 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.4, delay: index * 0.1 }"
      >
        <button
          :class="['spread-item', { 'is-selected': currentSpread === option.type }]"
          @click="handleSelect(option.type)"
        >
          <!-- 左侧：牌阵预览 -->
          <div class="spread-preview-wrapper">
            <div :class="['spread-preview', `spread-layout-${option.type}`]">
              <div
                v-for="(pos, idx) in option.positions"
                :key="idx"
                class="preview-card"
                :style="{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }"
              />
            </div>
          </div>

          <!-- 右侧：牌阵信息 -->
          <div class="spread-info">
            <div class="spread-header">
              <span class="spread-name">{{ option.name }}</span>
              <span class="spread-count"
                >{{ option.positions.length }} {{ t('divination.cards') }}</span
              >
            </div>
            <p class="spread-desc">{{ option.desc }}</p>
          </div>

          <!-- 选中标记 -->
          <span v-if="currentSpread === option.type" class="selected-badge">
            <Check class="w-4 h-4" />
          </span>
        </button>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.spreads-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  padding-top: var(--space-16);
  padding-bottom: calc(var(--space-8) + var(--safe-bottom));
  overflow-y: auto;
}

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  color: var(--fg-subtle);
  background: transparent;
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) var(--ease-out);
  z-index: var(--z-elevated);
}

.back-btn:hover {
  color: var(--fg-default);
  border-color: var(--border-default);
  background: var(--bg-elevated);
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--fg-bright);
  margin: 0 0 var(--space-2) 0;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin: 0;
}

/* ========== 牌阵列表（左右布局） ========== */
.spread-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

/* 牌阵项 - 左右布局 */
.spread-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
  text-align: left;
  width: 100%;
}

.spread-item:hover {
  border-color: var(--border-subtle);
  background: var(--bg-overlay);
  transform: translateX(4px);
}

.spread-item.is-selected {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: var(--glow-common);
}

/* 左侧：牌阵预览容器 */
.spread-preview-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--void-800);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.spread-item.is-selected .spread-preview-wrapper {
  background: var(--void-700);
  border-color: var(--accent);
}

/* 牌阵预览 */
.spread-preview {
  display: grid;
  gap: 3px;
}

.spread-layout-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.spread-layout-3 {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
}

.spread-layout-5 {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.preview-card {
  width: 14px;
  height: 20px;
  background: var(--void-600);
  border-radius: 2px;
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) var(--ease-out);
}

.spread-item.is-selected .preview-card {
  background: var(--accent);
  border-color: var(--accent);
}

/* 右侧：牌阵信息 */
.spread-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.spread-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.spread-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--fg-bright);
}

.spread-count {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  padding: var(--space-0-5) var(--space-2);
  background: var(--void-700);
  border-radius: var(--radius-full);
}

.spread-item.is-selected .spread-count {
  background: var(--accent);
  color: var(--fg-on-accent);
}

.spread-desc {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin: 0;
  line-height: 1.4;
}

/* 选中标记 */
.selected-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: var(--fg-on-accent);
  border-radius: var(--radius-full);
}

/* ========== 响应式 ========== */
@media (min-width: 640px) {
  .spread-list {
    max-width: 560px;
  }

  .spread-preview-wrapper {
    width: 100px;
    height: 100px;
  }

  .preview-card {
    width: 18px;
    height: 26px;
  }

  .spread-name {
    font-size: var(--text-lg);
  }
}
</style>
