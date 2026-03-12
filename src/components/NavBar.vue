<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Home, BookOpen, Settings } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()
const route = useRoute()

const navItems = [
  { path: '/', icon: Home, label: '占卜' },
  { path: '/library', icon: BookOpen, label: '牌库' },
  { path: '/settings', icon: Settings, label: '设置' },
]

const navigate = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <!-- 移动端底部导航 -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden">
    <div
      class="flex justify-around items-center h-[var(--nav-height)] px-4 bg-background/95 backdrop-blur-lg border-t border-gold/15"
    >
      <button
        v-for="item in navItems"
        :key="item.path"
        :class="
          cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all',
            isActive(item.path)
              ? 'text-gold bg-gold/10'
              : 'text-muted-foreground hover:text-gold/70'
          )
        "
        @click="navigate(item.path)"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-xs">{{ item.label }}</span>
      </button>
    </div>
  </nav>

  <!-- PC端顶部导航 -->
  <nav class="fixed top-0 left-0 right-0 z-50 hidden md:block">
    <div
      class="flex justify-center items-center h-[var(--nav-height)] px-6 bg-background/95 backdrop-blur-lg border-b border-gold/15"
    >
      <div class="flex items-center gap-2">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="
            cn(
              'flex items-center gap-2 py-2 px-5 rounded-full transition-all',
              isActive(item.path)
                ? 'text-background bg-gradient-to-r from-gold to-gold-light shadow-lg shadow-gold/30'
                : 'text-muted-foreground hover:text-gold hover:bg-gold/10'
            )
          "
          @click="navigate(item.path)"
        >
          <component :is="item.icon" class="w-4 h-4" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
