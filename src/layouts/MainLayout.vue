<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import StarBackground from '@/components/StarBackground.vue'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

const showNav = computed(() => {
  return !route.meta.hideNav
})
</script>

<template>
  <div class="app-layout">
    <StarBackground />
    <NavBar v-if="showNav" />
    <main 
      class="main-content"
      :class="{ 'has-nav': showNav }"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  @apply h-full w-full overflow-hidden relative;
}

.main-content {
  @apply h-full overflow-hidden;
}

.main-content.has-nav {
  @apply pt-0 pb-[var(--nav-height)] md:pt-[var(--nav-height)] md:pb-0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
