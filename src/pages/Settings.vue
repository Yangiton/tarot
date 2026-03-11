<script setup lang="ts">
import { Motion } from 'motion-v'
import { REVERSED_PROBABILITY } from '@/data'

const reversedPercent = Math.round(REVERSED_PROBABILITY * 100)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex-shrink-0 text-center py-4 md:py-6 px-4 border-b border-gold/15">
      <h1 class="text-xl md:text-2xl font-bold gold-title">✦ 设置 ✦</h1>
      <p class="text-muted-foreground text-sm mt-1">个性化你的占卜体验</p>
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
            <h2 class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15">
              占卜设置
            </h2>
            
            <div class="space-y-3">
              <div class="glass-card p-4 flex items-center justify-between">
                <div>
                  <p class="text-sm md:text-base text-foreground">逆位概率</p>
                  <p class="text-xs text-muted-foreground mt-1">抽牌时出现逆位的概率</p>
                </div>
                <span class="px-3 py-1.5 bg-gold/15 text-gold rounded-full text-sm">
                  {{ reversedPercent }}%
                </span>
              </div>
              
              <div class="glass-card p-4 flex items-center justify-between opacity-50">
                <div>
                  <p class="text-sm md:text-base text-foreground">牌组选择</p>
                  <p class="text-xs text-muted-foreground mt-1">选择使用的牌组范围</p>
                </div>
                <span class="px-3 py-1.5 bg-gold/15 text-gold rounded-full text-sm">
                  仅大阿尔卡纳
                </span>
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
            <h2 class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15">
              关于
            </h2>
            
            <div class="glass-card p-4 md:p-6 space-y-3 text-sm text-muted-foreground leading-relaxed">
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
            <h2 class="text-base md:text-lg font-semibold text-gold mb-4 pb-2 border-b border-gold/15">
              版本
            </h2>
            <p class="text-sm text-muted-foreground">v0.1.0</p>
          </section>
        </Motion>
      </div>
    </div>
  </div>
</template>
