<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Motion, AnimatePresence } from "motion-v";
import { Lightbulb, X, ChevronRight } from "lucide-vue-next";
import { useToggle, useCycleList, useTimeoutFn } from "@vueuse/core";
import TarotCard from "@/components/tarot/TarotCard.vue";
import AppFooter from "@/components/AppFooter.vue";
import Button from "@/components/ui/button.vue";
import { useTarot } from "@/composables/useTarot";
import { useDevice } from "@/composables/useDevice";
import { tips, spreads } from "@/data";

const router = useRouter();
const { isMobileLandscape, isMobile } = useDevice();
const {
  currentSpread,
  drawnCards,
  holoType,
  currentDeckId,
  useFullDeck,
  isDrawn,
  allFlipped,
  drawCards,
  flipCard,
  resetReading,
} = useTarot();

const deckRangeLabel = computed(() =>
  useFullDeck.value ? "完整牌组" : "大阿尔卡纳",
);

const cardRefs = ref<Record<number, any>>({});
const isAnimating = ref(false);
const drawKey = ref(0);

const [showTips, toggleTips] = useToggle(false);
const { state: currentTip, index: currentTipIndex, next } = useCycleList(tips);
const nextTip = () => {
  next();
};

const setCardRef = (el: unknown, index: number) => {
  cardRefs.value[index] = el;
};

const currentSpreadConfig = computed(() => {
  return spreads[String(currentSpread.value)];
});

const hint = computed(() => {
  if (!allFlipped.value) return "点击卡牌翻开";
  return "查看解读 →";
});

const goToSettings = () => {
  router.push("/settings");
};

const handleDraw = async () => {
  isAnimating.value = true;
  drawCards();
  drawKey.value++;
  await nextTick();
  useTimeoutFn(() => {
    isAnimating.value = false;
  }, 600);
};

const handleFlip = () => {
  flipCard();
};

const handleReset = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;

  Object.values(cardRefs.value).forEach((ref: any) => ref?.reset?.());

  await new Promise((resolve) => setTimeout(resolve, 350));

  resetReading();
  drawKey.value++;

  await nextTick();
  useTimeoutFn(() => {
    isAnimating.value = false;
  }, 100);
};

const goToReading = () => {
  if (allFlipped.value) {
    router.push("/reading");
  }
};
</script>

<template>
  <div
    class="home-container"
    :class="{
      'is-mobile': isMobile,
      'is-landscape': isMobileLandscape,
    }"
  >
    <!-- Header Row: Title + Tips Icon -->
    <header class="header-row">
      <div class="header-content">
        <h1 class="title">✦ 塔罗占卜 ✦</h1>
        <p v-if="!isMobileLandscape" class="subtitle">聆听宇宙的低语</p>
      </div>

      <!-- Tips Toggle Button -->
      <button
        class="tips-toggle"
        :class="{ 'is-active': showTips }"
        @click="toggleTips()"
        title="占卜小贴士"
      >
        <Lightbulb class="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </header>

    <!-- Tips Popup -->
    <AnimatePresence>
      <Motion
        v-if="showTips"
        :initial="{ opacity: 0, y: -10, scale: 0.95 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: -10, scale: 0.95 }"
        :transition="{ duration: 0.2 }"
        class="tips-popup"
      >
        <div class="tips-header">
          <span class="tips-title">💡 小贴士</span>
          <button class="tips-close" @click="toggleTips(false)">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="tips-text" v-html="currentTip.text"></p>
        <div class="tips-footer">
          <span class="tips-count"
            >{{ currentTipIndex + 1 }}/{{ tips.length }}</span
          >
          <button class="tips-next" @click="nextTip">下一条 →</button>
        </div>
      </Motion>
    </AnimatePresence>

    <!-- Spread Info -->
    <div v-if="!isMobileLandscape" class="spread-info">
      <div class="spread-badges">
        <div class="spread-badge" @click="goToSettings">
          <span class="spread-name">{{ currentSpreadConfig?.name }}</span>
          <ChevronRight class="w-3 h-3 ml-0.5 opacity-60" />
        </div>
        <div class="spread-badge" @click="goToSettings">
          <span class="spread-name">{{ deckRangeLabel }}</span>
          <ChevronRight class="w-3 h-3 ml-0.5 opacity-60" />
        </div>
      </div>
      <p class="spread-desc">{{ currentSpreadConfig?.description }}</p>
    </div>

    <!-- Main Card Area -->
    <div class="main-area">
      <AnimatePresence mode="wait">
        <!-- 抽牌前：居中显示按钮 -->
        <Motion
          v-if="!isDrawn"
          key="draw-button"
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.8 }"
          :transition="{ duration: 0.3 }"
          class="draw-area"
        >
          <Button
            size="lg"
            :disabled="isAnimating"
            @click="handleDraw"
            class="draw-btn"
          >
            开始抽牌
          </Button>
        </Motion>

        <!-- 抽牌后：显示卡牌 -->
        <Motion
          v-else
          :key="'cards-' + drawKey"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.3 }"
          :class="['cards-area', `spread-${currentSpread}`]"
        >
          <Motion
            v-for="(card, index) in drawnCards"
            :key="card.id + '-' + index"
            :class="['card-slot', `row-${card.row}`, `col-${card.col}`]"
            :initial="{ opacity: 0, scale: 0.6, y: 40 }"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :transition="{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.34, 1.56, 0.64, 1],
            }"
          >
            <TarotCard
              :ref="(el) => setCardRef(el, index)"
              :card="card"
              :position="card.position"
              :spread-type="currentSpread"
              :holo-type="holoType"
              :deck-id="currentDeckId"
              :clickable="!isAnimating"
              @flip="handleFlip"
            />
          </Motion>
        </Motion>
      </AnimatePresence>
    </div>

    <!-- Bottom Action Area -->
    <div class="action-area">
      <AnimatePresence>
        <Motion
          v-if="isDrawn"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.3 }"
          class="action-buttons"
        >
          <Button
            variant="outline"
            size="sm"
            :disabled="isAnimating"
            @click="handleReset"
          >
            重新抽牌
          </Button>
          <Button v-if="allFlipped" size="sm" @click="goToReading">
            查看解读 →
          </Button>
          <span v-else class="hint-text">{{ hint }}</span>
        </Motion>
      </AnimatePresence>
    </div>

    <!-- Footer -->
    <div class="footer-area">
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  @apply h-full flex flex-col overflow-hidden px-3 md:px-6 relative;
}

/* ========== Header ========== */
.header-row {
  @apply flex items-center justify-between py-3 md:py-4 flex-shrink-0;
}

.header-content {
  @apply flex-1 text-center;
}

.title {
  @apply text-xl md:text-2xl lg:text-3xl font-bold;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  @apply text-muted-foreground text-xs md:text-sm mt-0.5 tracking-wider;
}

.tips-toggle {
  @apply absolute right-3 md:right-6 top-3 md:top-4;
  @apply w-8 h-8 md:w-9 md:h-9 rounded-full;
  @apply flex items-center justify-center;
  @apply border border-gold/40 text-gold/70;
  @apply hover:bg-gold/10 hover:text-gold hover:border-gold;
  @apply transition-all duration-200;
}

.tips-toggle.is-active {
  @apply bg-gold/20 text-gold border-gold;
}

/* ========== Tips Popup ========== */
.tips-popup {
  @apply absolute right-3 md:right-6 top-14 md:top-16 z-50;
  @apply w-[280px] md:w-[320px];
  @apply glass-card p-3 md:p-4;
  @apply border border-gold/20;
}

.tips-header {
  @apply flex items-center justify-between mb-2;
}

.tips-title {
  @apply text-gold text-sm font-medium;
}

.tips-close {
  @apply w-6 h-6 rounded-full;
  @apply flex items-center justify-center;
  @apply text-muted-foreground hover:text-foreground hover:bg-white/10;
  @apply transition-colors;
}

.tips-text {
  @apply text-xs md:text-sm text-muted-foreground leading-relaxed;
}

.tips-text :deep(.highlight) {
  @apply text-gold font-medium;
}

.tips-footer {
  @apply flex items-center justify-between mt-3 pt-2 border-t border-white/10;
}

.tips-count {
  @apply text-xs text-muted-foreground/60;
}

.tips-next {
  @apply text-xs text-gold hover:text-gold-light transition-colors;
}

/* ========== Spread Selector ========== */
.spread-selector {
  @apply flex justify-center gap-2 md:gap-3 py-2 flex-shrink-0;
}

/* ========== Spread Info ========== */
.spread-info {
  @apply flex flex-col items-center py-1 flex-shrink-0;
}

.spread-badges {
  @apply flex items-center gap-2;
}

.spread-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full;
  @apply bg-gold/15 text-gold text-xs md:text-sm;
  @apply cursor-pointer hover:bg-gold/25 transition-colors;
}


.spread-name {
  @apply font-medium;
}

.spread-desc {
  @apply text-[10px] md:text-xs text-muted-foreground mt-1;
}

/* ========== Main Card Area ========== */
.main-area {
  @apply flex-1 flex items-center justify-center min-h-0;
  @apply py-2 md:py-4;
}

.draw-area {
  @apply flex flex-col items-center gap-3;
}

.draw-btn {
  @apply px-8 md:px-10 py-2.5 md:py-3 text-base md:text-lg;
}

/* ========== 牌阵布局 ========== */
.cards-area {
  @apply flex items-center justify-center;
}

/* 单牌阵 - 居中一张 */
.cards-area.spread-1 {
  @apply flex items-center justify-center;
}

/* 三牌阵 - 横向一排 */
.cards-area.spread-3 {
  @apply flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5;
}

/* 五牌十字阵 - 使用 CSS Grid */
.cards-area.spread-5 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.25rem;
  justify-items: center;
  align-items: center;
  width: fit-content;
}

@media (min-width: 640px) {
  .cards-area.spread-5 {
    gap: 0.5rem;
  }
}

@media (min-width: 768px) {
  .cards-area.spread-5 {
    gap: 0.75rem;
  }
}

/* 五牌阵位置映射 */
.cards-area.spread-5 .card-slot {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cards-area.spread-5 .row-0.col-1 {
  grid-area: 1 / 2 / 2 / 3;
} /* 上：过去 */
.cards-area.spread-5 .row-1.col-0 {
  grid-area: 2 / 1 / 3 / 2;
} /* 左：建议 */
.cards-area.spread-5 .row-1.col-1 {
  grid-area: 2 / 2 / 3 / 3;
} /* 中：现状 */
.cards-area.spread-5 .row-1.col-2 {
  grid-area: 2 / 3 / 3 / 4;
} /* 右：未来 */
.cards-area.spread-5 .row-2.col-1 {
  grid-area: 3 / 2 / 4 / 3;
} /* 下：挑战 */

/* ========== Action Area ========== */
.action-area {
  @apply flex-shrink-0 h-14 md:h-16 flex items-center justify-center;
}

.action-buttons {
  @apply flex items-center gap-3;
}

.hint-text {
  @apply text-xs md:text-sm text-muted-foreground;
}

/* ========== Footer ========== */
.footer-area {
  @apply flex-shrink-0 py-2;
}

/* ========== Mobile Landscape Mode ========== */
.home-container.is-landscape {
  @apply px-4;
}

/* 横屏：隐藏标题 */
.home-container.is-landscape .header-row {
  @apply hidden;
}

/* 横屏：主区域最大化 */
.home-container.is-landscape .main-area {
  @apply flex-1 py-0;
}

.home-container.is-landscape .cards-area {
  @apply gap-2;
}

/* 横屏：底部操作区紧凑 */
.home-container.is-landscape .action-area {
  @apply h-10;
}

.home-container.is-landscape .action-buttons {
  @apply gap-2;
}

.home-container.is-landscape .draw-btn {
  @apply px-6 py-1.5 text-xs;
}

/* 横屏：隐藏 footer */
.home-container.is-landscape .footer-area {
  @apply hidden;
}

.home-container.is-landscape .hint-text {
  @apply text-[10px];
}
</style>
