<script setup lang="ts">
/**
 * NavBar - Cozy Terracotta 风格导航栏
 *
 * 移动端: 底部 Tab Bar
 * PC端: 顶部导航栏
 *
 * 设计规格:
 * - 背景: 柔和毛玻璃
 * - 选中态: 陶土橙高亮 + 圆点指示器
 */
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Sun, Sparkles, BookOpen, User } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const navItems = computed(() => [
  { path: '/', icon: Sun, label: t('nav.daily'), key: 'daily' },
  { path: '/divination', icon: Sparkles, label: t('nav.divination'), key: 'divination' },
  { path: '/library', icon: BookOpen, label: t('nav.library'), key: 'library' },
  { path: '/settings', icon: User, label: t('nav.me'), key: 'me' },
])

const navigate = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <!-- 移动端底部导航 Tab Bar -->
  <nav class="tab-bar md:hidden" :aria-label="t('nav.mainNav')">
    <div class="tab-bar-inner">
      <button
        v-for="item in navItems"
        :key="item.key"
        :class="cn('tab-item', { 'is-active': isActive(item.path) })"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="navigate(item.path)"
      >
        <span class="tab-icon">
          <component :is="item.icon" />
        </span>
        <span class="tab-label">{{ item.label }}</span>
      </button>
    </div>
    <!-- Safe Area 底部间距 -->
    <div class="safe-area-spacer" />
  </nav>

  <!-- PC端顶部导航 -->
  <nav class="top-nav hidden md:block" :aria-label="t('nav.mainNav')">
    <div class="top-nav-inner">
      <div class="top-nav-items">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="cn('top-nav-item', { 'is-active': isActive(item.path) })"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          @click="navigate(item.path)"
        >
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ========== 移动端底部 Tab Bar ========== */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: var(--bg-overlay);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-subtle);
}

.tab-bar-inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  padding: 0 var(--space-2);
}

.safe-area-spacer {
  height: var(--safe-bottom);
}

/* Tab 项 */
.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--fg-subtle);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}

/* Hover 态 - 仅在非触屏设备上生效 */
@media (hover: hover) {
  .tab-item:hover:not(.is-active) {
    color: var(--fg-muted);
  }
}

/* Active (pressed) 态 */
.tab-item:active {
  transform: scale(0.92);
  opacity: 0.8;
}

/* 选中态 */
.tab-item.is-active {
  color: var(--fg-default);
}

.tab-item.is-active .tab-icon {
  color: var(--accent);
}

/* Tab 图标 */
.tab-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon :deep(svg) {
  width: 22px;
  height: 22px;
  stroke-width: 1.75;
}

/* Tab 标签 */
.tab-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.02em;
}

/* ========== PC端顶部导航 ========== */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: var(--bg-overlay);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
}

.top-nav-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--nav-height);
  padding: 0 var(--space-6);
}

.top-nav-items {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.top-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--fg-muted);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.top-nav-item:hover {
  color: var(--accent);
  background: var(--accent-soft);
}

.top-nav-item.is-active {
  color: var(--fg-on-accent);
  background: var(--accent);
  box-shadow: var(--shadow-glow-sm);
}

.top-nav-item.is-active:hover {
  background: var(--accent-hover);
}
</style>
