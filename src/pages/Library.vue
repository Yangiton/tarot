<script setup lang="ts">
import { Motion } from 'motion-v'
import { majorArcana } from '@/data'
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-4 md:py-6 px-4 border-b border-gold/15">
      <h1 class="text-xl md:text-2xl font-bold gold-title">✦ 牌库 ✦</h1>
      <p class="text-muted-foreground text-sm mt-1">探索塔罗的奥秘</p>
    </header>

    <!-- Scroll Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-6">
      <div class="max-w-4xl mx-auto">
        <!-- Major Arcana Section -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <section class="mb-8">
            <h2 class="text-lg md:text-xl font-semibold text-gold mb-2">
              大阿尔卡纳 (Major Arcana)
            </h2>
            <p class="text-sm text-muted-foreground mb-6">
              22张代表人生重大主题的牌
            </p>
            
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              <Motion
                v-for="(card, index) in majorArcana"
                :key="card.id"
                :initial="{ opacity: 0, scale: 0.9 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.3, delay: index * 0.03 }"
                :whileHover="{ scale: 1.05, y: -5 }"
              >
                <div class="glass-card p-3 md:p-4 text-center cursor-pointer hover:border-gold/50 transition-colors">
                  <span class="text-2xl md:text-3xl block mb-2">{{ card.symbol }}</span>
                  <span class="text-[10px] md:text-xs text-muted-foreground block">{{ card.number }}</span>
                  <span class="text-xs md:text-sm text-foreground block mt-1 truncate">{{ card.name }}</span>
                </div>
              </Motion>
            </div>
          </section>
        </Motion>

        <!-- Minor Arcana Section (Coming Soon) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <section class="opacity-60">
            <h2 class="text-lg md:text-xl font-semibold text-gold mb-2">
              小阿尔卡纳 (Minor Arcana)
            </h2>
            <p class="text-sm text-muted-foreground mb-6">
              56张反映日常生活细节的牌
            </p>
            
            <div class="glass-card p-6 md:p-8 text-center border-dashed">
              <span class="text-gold text-sm md:text-base">即将推出</span>
            </div>
          </section>
        </Motion>
      </div>
    </div>
  </div>
</template>
