<script setup lang="ts">
/**
 * DeckCover - 牌组封面卡片组件
 *
 * 使用 Pointer Events 统一处理 PC/移动端交互，避免 touch/click 冲突
 *
 * 交互设计：
 * | 操作       | 方式                  | 效果              |
 * |-----------|----------------------|------------------|
 * | 预览       | 单击卡片              | 显示简介遮罩       |
 * | 查看详情   | 点击"查看牌组"按钮    | 进入 78 张牌页面   |
 * | 选择牌组   | 点击"设为默认"按钮    | 切换默认牌组       |
 * | 关闭遮罩   | 点击卡片外部/再次点击  | 隐藏遮罩          |
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Check, Eye } from 'lucide-vue-next'
import type { DeckDisplayConfig } from '@/data'
import { getDeckCoverUrl, isImageDeck } from '@/data/card-images'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  deck: DeckDisplayConfig
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [deckId: string]
  setDefault: [deckId: string]
}>()

const hasCover = computed(() => isImageDeck(props.deck.id))
const coverUrl = computed(() => getDeckCoverUrl(props.deck.id))

// 遮罩显示状态
const showOverlay = ref(false)

// 卡片元素引用
const cardRef = ref<HTMLElement | null>(null)

// 使用 Pointer Events 处理交互
// pointerdown -> pointerup 判断是否为有效点击（避免滑动误触）
let pointerStartTime = 0
let pointerStartPos = { x: 0, y: 0 }
const CLICK_THRESHOLD = 200 // ms
const MOVE_THRESHOLD = 10 // px

const handlePointerDown = (e: PointerEvent) => {
  pointerStartTime = Date.now()
  pointerStartPos = { x: e.clientX, y: e.clientY }
}

const handlePointerUp = (e: PointerEvent) => {
  const duration = Date.now() - pointerStartTime
  const distance = Math.sqrt(
    Math.pow(e.clientX - pointerStartPos.x, 2) + Math.pow(e.clientY - pointerStartPos.y, 2)
  )

  // 判断为有效点击：时间短 + 移动距离小
  if (duration < CLICK_THRESHOLD && distance < MOVE_THRESHOLD) {
    handleCardTap()
  }
}

// 点击卡片：切换遮罩显示
const handleCardTap = () => {
  showOverlay.value = !showOverlay.value
}

// 查看牌组详情（preventDefault 防止移动端 300ms 后合成点击穿透到新页面）
const handleViewDeck = (e: PointerEvent) => {
  e.preventDefault()
  e.stopPropagation()
  showOverlay.value = false
  emit('select', props.deck.id)
}

// 设为默认牌组
const handleSetDefault = (e: PointerEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('setDefault', props.deck.id)
}

// 点击外部关闭遮罩
const handleClickOutside = (e: PointerEvent) => {
  if (cardRef.value && !cardRef.value.contains(e.target as Node)) {
    showOverlay.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleClickOutside)
})
</script>

<template>
  <div
    ref="cardRef"
    class="deck-cover-card"
    :class="{ 'is-selected': selected, 'overlay-visible': showOverlay }"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
  >
    <!-- 封面容器 -->
    <div class="cover-container">
      <!-- 图片封面 -->
      <template v-if="hasCover">
        <img :src="coverUrl" :alt="deck.name" class="cover-image" loading="lazy" />
      </template>
      <!-- Emoji 默认封面 -->
      <template v-else>
        <div class="emoji-cover">
          <span class="text-4xl">🔮</span>
        </div>
      </template>

      <!-- 名字标签 (顶部) -->
      <div class="name-tag">
        <span class="name-text">{{ deck.name }}</span>
        <!-- 选中标记 -->
        <span v-if="selected" class="selected-badge">
          <Check class="w-3 h-3" />
        </span>
      </div>

      <!-- 简介遮罩：阻止冒泡 + 阻止默认（防止移动端 300ms 合成点击穿透到新页面） -->
      <div class="desc-overlay" @pointerdown.stop.prevent @pointerup.stop>
        <p class="desc-text">{{ deck.description }}</p>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <!-- 查看牌组 -->
          <button type="button" class="view-btn" @pointerup="handleViewDeck">
            <Eye class="w-3.5 h-3.5" />
            <span>{{ t('library.viewDeck') }}</span>
          </button>

          <!-- 设为默认 / 当前牌组 -->
          <button
            v-if="!selected"
            type="button"
            class="set-default-btn"
            @pointerup="handleSetDefault"
          >
            {{ t('library.setAsDefault') }}
          </button>
          <span v-else class="current-deck-label">{{ t('library.currentDeck') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deck-cover-card {
  width: 100%;
  max-width: 160px;
  touch-action: manipulation;
}

.cover-container {
  position: relative;
  width: 100%;
  aspect-ratio: 249 / 353;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #2a1a4a 0%, #1a1a2e 50%, #0d0d1a 100%);
  border: 2px solid hsl(var(--border));
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 选中状态 */
.deck-cover-card.is-selected .cover-container {
  border-color: var(--gold);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
}

/* 遮罩显示状态 */
.deck-cover-card.overlay-visible .cover-container {
  border-color: var(--gold);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.25),
    0 0 15px rgba(255, 215, 0, 0.12);
}

.deck-cover-card.overlay-visible .desc-overlay {
  opacity: 1;
  pointer-events: auto;
}

.deck-cover-card.overlay-visible .cover-image {
  transform: scale(1.03);
}

/* PC hover 效果 (仅在遮罩未显示时) */
@media (hover: hover) and (pointer: fine) {
  .deck-cover-card:not(.overlay-visible):hover .cover-container {
    border-color: rgba(255, 215, 0, 0.5);
    transform: translateY(-2px);
  }
}

/* 按压反馈 */
.deck-cover-card:active .cover-container {
  transform: scale(0.98);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  pointer-events: none;
}

.emoji-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 名字标签 - 顶部 */
.name-tag {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px 10px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  pointer-events: none;
}

.name-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gold);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-badge {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gold);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 简介遮罩 */
.desc-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.8) 50%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  z-index: 3;
}

.desc-text {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 8px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #000;
  background: var(--gold);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  touch-action: manipulation;
}

.view-btn:active {
  transform: scale(0.95);
  background: #e6c200;
}

.set-default-btn {
  padding: 6px 12px;
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--gold);
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--gold);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  touch-action: manipulation;
}

.set-default-btn:active {
  background: var(--gold);
  color: #000;
  transform: scale(0.95);
}

.current-deck-label {
  font-size: 0.6rem;
  color: var(--gold);
  font-weight: 500;
  padding: 6px 0;
}

/* PC hover 按钮效果 */
@media (hover: hover) and (pointer: fine) {
  .view-btn:hover {
    background: #ffdf80;
  }

  .set-default-btn:hover {
    background: var(--gold);
    color: #000;
  }
}

@media (min-width: 640px) {
  .deck-cover-card {
    max-width: 180px;
  }

  .name-text {
    font-size: 0.8rem;
  }

  .desc-text {
    font-size: 0.75rem;
  }

  .view-btn {
    font-size: 0.75rem;
    padding: 9px 12px;
  }

  .set-default-btn {
    font-size: 0.65rem;
    padding: 6px 14px;
  }
}
</style>
