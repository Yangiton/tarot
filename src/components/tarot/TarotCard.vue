<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { DrawnCard, SpreadType, TarotCard as TarotCardType } from "@/data";
import { DEFAULT_DECK_ID, getCardEnglishName } from "@/data";
import { getCardImageUrl, isImageDeck } from "@/data/card-images";
import type { HoloType } from "@/directives/vHoloFoil";

interface Props {
  card?: DrawnCard | TarotCardType;
  position?: string;
  clickable?: boolean;
  flipDuration?: number;
  spreadType?: SpreadType;
  holoType?: HoloType;
  deckId?: string;
  static?: boolean; // 静态模式：直接显示正面，用于牌库展示
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  flipDuration: 600,
  spreadType: 3,
  holoType: "normal",
  deckId: DEFAULT_DECK_ID,
  static: false,
});

const useImages = computed(() => isImageDeck(props.deckId));

const cardIndex = computed(() => {
  if (!props.card?.id) return 0;
  const id = props.card.id;
  
  // 大阿尔卡纳: major-0 ~ major-21
  if (id.startsWith('major-')) {
    const num = parseInt(id.replace('major-', ''), 10);
    return isNaN(num) ? 0 : num;
  }
  
  // 小阿尔卡纳: minor-{suit}-{rank}
  const match = id.match(/^minor-(\w+)-(.+)$/);
  if (match) {
    const suit = match[1];
    const rankStr = match[2];
    const suitOffset: Record<string, number> = {
      wands: 22, cups: 36, swords: 50, pentacles: 64
    };
    const courtRanks: Record<string, number> = {
      page: 11, knight: 12, queen: 13, king: 14
    };
    const rank = courtRanks[rankStr] || parseInt(rankStr, 10);
    return (suitOffset[suit] || 22) + rank - 1;
  }
  
  return 0;
});

const cardImageUrl = computed(() => {
  return getCardImageUrl(cardIndex.value, props.deckId);
});

// 是否有有效的图片 URL
const hasValidImage = computed(() => {
  return useImages.value && cardImageUrl.value !== '';
});

const cardEnglishName = computed(() => getCardEnglishName(cardIndex.value));

// 根据牌阵类型决定标签位置：1、3 牌阵放下方，5+ 牌阵放内部左侧
const labelPosition = computed(() => {
  return props.spreadType <= 3 ? "bottom" : "inside";
});

const emit = defineEmits<{
  flip: [];
  flipComplete: [];
  activate: [];
  deactivate: [];
  click: [];
}>();

const cardWrapper = ref<HTMLElement | null>(null);
const isFlipped = ref(false);
const isFlipping = ref(false);
const isActive = ref(false); // 放大激活状态

// 计算放大居中的 transform
const popoverTransform = ref({
  translateX: 0,
  translateY: 0,
  scale: 1,
});

// 计算居中位置和缩放
const calculatePopover = () => {
  if (!cardWrapper.value) return;

  const rect = cardWrapper.value.getBoundingClientRect();
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  // 计算移动到屏幕中心的距离
  const deltaX = viewWidth / 2 - rect.left - rect.width / 2;
  const deltaY = viewHeight / 2 - rect.top - rect.height / 2;

  // 计算缩放比例（最大填充屏幕 85%，但不超过 2 倍）
  const scaleW = (viewWidth * 0.85) / rect.width;
  const scaleH = (viewHeight * 0.85) / rect.height;
  const scale = Math.min(scaleW, scaleH, 2);

  popoverTransform.value = {
    translateX: deltaX,
    translateY: deltaY,
    scale,
  };
};

// 点击处理
const handleClick = () => {
  if (!props.clickable || !props.card) return;

  // 静态模式：直接触发 click 事件
  if (props.static) {
    emit("click");
    return;
  }

  if (isFlipping.value) return;

  // 如果已翻开，再次点击切换放大状态
  if (isFlipped.value) {
    toggleActive();
    return;
  }

  // 首次点击：翻转卡片
  isFlipping.value = true;
  isFlipped.value = true;
  emit("flip");

  setTimeout(() => {
    isFlipping.value = false;
    emit("flipComplete");
  }, props.flipDuration);
};

// 切换放大状态
const toggleActive = () => {
  if (isActive.value) {
    deactivate();
  } else {
    activate();
  }
};

// 激活放大
const activate = () => {
  calculatePopover();
  isActive.value = true;
  emit("activate");

  // 添加 ESC 键和点击背景关闭
  document.addEventListener("keydown", handleKeydown);
};

// 取消放大
const deactivate = () => {
  isActive.value = false;
  popoverTransform.value = { translateX: 0, translateY: 0, scale: 1 };
  emit("deactivate");

  document.removeEventListener("keydown", handleKeydown);
};

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isActive.value) {
    deactivate();
  }
};

// 点击遮罩关闭
const handleOverlayClick = () => {
  if (isActive.value) {
    deactivate();
  }
};

// 窗口大小变化时重新计算
const handleResize = () => {
  if (isActive.value) {
    calculatePopover();
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("keydown", handleKeydown);
});

const reset = () => {
  isFlipped.value = false;
  isFlipping.value = false;
  isActive.value = false;
  popoverTransform.value = { translateX: 0, translateY: 0, scale: 1 };
};

defineExpose({ reset, isFlipped, isActive, activate, deactivate });
</script>

<template>
  <!-- 遮罩层（静态模式不需要） -->
  <Teleport v-if="!static" to="body">
    <Transition name="overlay-fade">
      <div v-if="isActive" class="card-overlay" @click="handleOverlayClick" />
    </Transition>
  </Teleport>

  <div
    ref="cardWrapper"
    class="card-wrapper"
    :class="{ 'is-active': isActive, 'is-static': static }"
    :style="{
      '--translate-x': `${popoverTransform.translateX}px`,
      '--translate-y': `${popoverTransform.translateY}px`,
      '--card-scale': popoverTransform.scale,
    }"
    @click="handleClick"
  >
    <!-- v-holo-foil 外层：全息卡片效果 -->
    <div
      v-holo-foil="{ type: holoType, disabled: isFlipping }"
      class="card-container"
    >
      <!-- 静态模式：直接显示正面 -->
      <div
        v-if="static"
        class="card-face card-front card-static"
        :class="hasValidImage ? 'has-image' : ''"
      >
        <template v-if="card">
          <!-- 图片牌组（有有效 URL） -->
          <template v-if="hasValidImage">
            <span class="card-image-placeholder">{{ card.symbol }}</span>
            <img
              :src="cardImageUrl"
              :alt="cardEnglishName"
              class="card-image-full"
              loading="lazy"
              @load="($event.target as HTMLImageElement).classList.add('loaded')"
              @error="($event.target as HTMLImageElement).classList.add('error')"
            />
          </template>
          <!-- Emoji 牌组或无有效图片 -->
          <template v-else>
            <span class="card-number">{{ card.number }}</span>
            <div class="card-image">{{ card.symbol }}</div>
            <span class="card-name">{{ card.name }}</span>
            <span class="card-name-en">{{ card.nameEn }}</span>
          </template>
        </template>
      </div>

      <!-- 翻转模式：占卜用 -->
      <div
        v-else
        class="card"
        :class="{ 'is-flipped': isFlipped }"
        :style="{ '--flip-duration': `${flipDuration}ms` }"
      >
        <!-- 卡背面 -->
        <div class="card-face card-back">
          <slot name="back">
            <div class="card-back-content">
              <div class="card-back-border">
                <span class="card-back-symbol">✦</span>
              </div>
            </div>
          </slot>
        </div>

        <!-- 卡正面 -->
        <div
          class="card-face card-front"
          :class="[
            { 'is-reversed': (card as DrawnCard)?.isReversed },
            hasValidImage ? 'has-image' : ''
          ]"
        >
          <slot name="front" :card="card">
            <template v-if="card">
              <!-- 图片牌组（有有效 URL） -->
              <template v-if="hasValidImage">
                <span class="card-image-placeholder">{{ card.symbol }}</span>
                <img
                  :src="cardImageUrl"
                  :alt="cardEnglishName"
                  class="card-image-full"
                  loading="lazy"
                  @load="($event.target as HTMLImageElement).classList.add('loaded')"
                  @error="($event.target as HTMLImageElement).classList.add('error')"
                />
              </template>
              <!-- Emoji 牌组或无有效图片 -->
              <template v-else>
                <span class="card-number">{{ card.number }}</span>
                <div class="card-image">{{ card.symbol }}</div>
                <span class="card-name">{{ card.name }}</span>
                <span class="card-name-en">{{ card.nameEn }}</span>
                <span class="card-keywords">{{ card.keywords }}</span>
              </template>
            </template>
          </slot>
        </div>
      </div>
    </div>

    <!-- 位置标签 -->
    <span
      v-if="position && !isActive && !static"
      class="position-label"
      :class="labelPosition === 'inside' ? 'label-inside' : 'label-bottom'"
    >{{ position }}</span>
  </div>
</template>

<style scoped>
/* ========== 遮罩层 ========== */
.card-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  z-index: 1000;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* ========== 外层包装（用于定位标签）========== */
.card-wrapper {
  --card-width: 80px;
  --card-ratio: 1.709; /* 340/199 */
  --card-radius: 8px;
  --flip-duration: 600ms;
  --translate-x: 0px;
  --translate-y: 0px;
  --card-scale: 1;

  position: relative;
  width: var(--card-width);
  height: calc(var(--card-width) * var(--card-ratio));
  transform: translate3d(var(--translate-x), var(--translate-y), 0)
    scale(var(--card-scale));
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    z-index 0s;
  will-change: transform;
}

/* 静态模式（牌库展示） */
.card-wrapper.is-static {
  cursor: pointer;
}

.card-wrapper.is-static:hover {
  transform: translateY(-4px);
}

.card-wrapper.is-static:active {
  transform: scale(0.95);
}

/* 静态卡片正面（覆盖翻转变换） */
.card-static.card-front {
  position: relative;
  width: 100%;
  height: 100%;
  transform: none !important;
}

/* 激活状态 */
.card-wrapper.is-active {
  z-index: 1001;
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    z-index 0s;
}

/* 激活时的光晕效果 - 参考 pokemon-cards-css */
.card-wrapper.is-active .card-face {
  box-shadow:
    0 0 3px -1px rgba(255, 255, 255, 0.5),
    0 0 3px 1px hsl(47, 100%, 78%),
    0 0 12px 2px hsl(45, 80%, 70%),
    0 10px 20px -5px rgba(0, 0, 0, 0.5),
    0 0 40px -30px hsl(45, 80%, 70%),
    0 0 50px -20px hsl(45, 80%, 70%);
}

/* ========== v-holo-foil 容器 ========== */
.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius);
}

/* sm: 640px+ */
@media (min-width: 640px) {
  .card-wrapper {
    --card-width: 100px;
    --card-radius: 10px;
  }
}

/* md: 768px+ */
@media (min-width: 768px) {
  .card-wrapper {
    --card-width: 110px;
    --card-radius: 12px;
  }
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  .card-wrapper {
    --card-width: 120px;
    --card-radius: 14px;
  }
}

/* xl: 1280px+ */
@media (min-width: 1280px) {
  .card-wrapper {
    --card-width: 140px;
    --card-radius: 16px;
  }
}

/* ========== 卡片主体 ========== */
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform var(--flip-duration) ease-in-out;
  border-radius: var(--card-radius);
}

/* 翻转状态 - 关键：让两面同向旋转 */
.card.is-flipped {
  transform: rotateY(180deg);
}

/* ========== 卡片两面通用 ========== */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.25),
    0 8px 25px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* ========== 卡背面 ========== */
.card-back {
  transform: rotateY(0deg);
  background: linear-gradient(145deg, #2a1a4a 0%, #1a1a2e 50%, #0d0d1a 100%);
  border: 2px solid var(--gold);
}

@media (min-width: 768px) {
  .card-back {
    border-width: 3px;
  }
}

.card-back-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.card-back-border {
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--gold);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(
      45deg,
      transparent 48%,
      rgba(255, 215, 0, 0.03) 50%,
      transparent 52%
    ),
    linear-gradient(
      -45deg,
      transparent 48%,
      rgba(255, 215, 0, 0.03) 50%,
      transparent 52%
    );
  background-size: 20px 20px;
}

.card-back-symbol {
  font-size: 1.5rem;
  color: var(--gold);
  text-shadow:
    0 0 15px rgba(255, 215, 0, 0.7),
    0 0 30px rgba(255, 215, 0, 0.4);
  animation: glow-pulse 2.5s ease-in-out infinite;
}

@media (min-width: 640px) {
  .card-back-symbol {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .card-back-symbol {
    font-size: 2.5rem;
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

/* ========== 卡正面 ========== */
.card-front {
  transform: rotateY(-180deg);
  background: linear-gradient(180deg, #f8f4eb 0%, #ebe3d3 50%, #ddd4c4 100%);
  border: 2px solid var(--gold-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
}

.card-front.has-image {
  padding: 0;
  border-width: 0;
}

@media (min-width: 640px) {
  .card-front {
    padding: 8px;
  }
}

@media (min-width: 768px) {
  .card-front {
    padding: 10px;
  }
}

@media (min-width: 1024px) {
  .card-front {
    border-width: 3px;
    padding: 12px;
  }
}

/* 逆位旋转 */
.card-front.is-reversed {
  transform: rotateY(-180deg) rotate(180deg);
}

/* 光泽层 */
.card-front::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 40%,
    transparent 60%,
    rgba(0, 0, 0, 0.03) 100%
  );
  pointer-events: none;
}

/* ========== 卡片正面内容 ========== */
.card-number {
  font-size: 0.5rem;
  color: #8b7355;
  font-weight: 600;
  line-height: 1;
}

@media (min-width: 640px) {
  .card-number {
    font-size: 0.6rem;
  }
}

@media (min-width: 1024px) {
  .card-number {
    font-size: 0.7rem;
  }
}

.card-image {
  width: 90%;
  flex: 1;
  margin: 3px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c9b898 100%);
  border: 1px solid var(--gold-dark);
  box-shadow:
    inset 0 1px 4px rgba(255, 255, 255, 0.4),
    inset 0 -1px 4px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .card-image {
    font-size: 1.5rem;
    margin: 4px 0;
    border-radius: 5px;
  }
}

@media (min-width: 768px) {
  .card-image {
    font-size: 1.75rem;
    margin: 5px 0;
  }
}

@media (min-width: 1024px) {
  .card-image {
    font-size: 2rem;
    margin: 6px 0;
    border-radius: 6px;
  }
}

@media (min-width: 1280px) {
  .card-image {
    font-size: 2.5rem;
  }
}

/* 图片牌组 - emoji 占位符 */
.card-image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c9b898 100%);
}

@media (min-width: 640px) {
  .card-image-placeholder {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .card-image-placeholder {
    font-size: 2.5rem;
  }
}

/* 图片牌组 - 全尺寸图片 */
.card-image-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-image-full.loaded {
  opacity: 1;
}

.card-image-full.error {
  display: none;
}

.card-name {
  font-size: 0.6rem;
  font-weight: 700;
  color: #4a3728;
  text-align: center;
  margin: 2px 0;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .card-name {
    font-size: 0.7rem;
    margin: 3px 0;
  }
}

@media (min-width: 1024px) {
  .card-name {
    font-size: 0.85rem;
    margin: 4px 0;
  }
}

.card-name-en {
  font-size: 0.45rem;
  color: #8b7355;
  text-align: center;
  line-height: 1;
}

@media (min-width: 640px) {
  .card-name-en {
    font-size: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .card-name-en {
    font-size: 0.6rem;
  }
}

.card-keywords {
  font-size: 0.4rem;
  color: #6b5a4a;
  text-align: center;
  margin-top: 2px;
  line-height: 1.2;
  display: none;
}

@media (min-width: 640px) {
  .card-keywords {
    display: block;
    font-size: 0.45rem;
  }
}

@media (min-width: 1024px) {
  .card-keywords {
    font-size: 0.55rem;
    margin-top: 3px;
  }
}

/* ========== 位置标签 ========== */
.position-label {
  position: absolute;
  font-size: 0.6rem;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
  z-index: 10;
}

/* 标签在下方（1、3 牌阵）*/
.position-label.label-bottom {
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 640px) {
  .position-label.label-bottom {
    bottom: -20px;
    font-size: 0.7rem;
  }
}

@media (min-width: 1024px) {
  .position-label.label-bottom {
    bottom: -24px;
    font-size: 0.8rem;
  }
}

/* 标签在内部左侧（5+ 牌阵）*/
.position-label.label-inside {
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.45rem;
  color: var(--gold);
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 3px;
  border-radius: 3px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
}

@media (min-width: 640px) {
  .position-label.label-inside {
    left: 4px;
    font-size: 0.55rem;
    padding: 6px 4px;
    letter-spacing: 2px;
  }
}

@media (min-width: 1024px) {
  .position-label.label-inside {
    left: 5px;
    font-size: 0.65rem;
    padding: 8px 5px;
  }
}
</style>
