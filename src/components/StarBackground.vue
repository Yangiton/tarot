<template>
  <div class="stars" ref="starsRef"></div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { onMounted } from 'vue'

const starsRef = useTemplateRef<HTMLDivElement>('starsRef')

onMounted(() => {
  const container = starsRef.value
  if (!container) return

  const fragment = document.createDocumentFragment()

  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
    star.style.animationDelay = `${Math.random() * 3}s`
    const size = `${Math.random() * 2 + 1}px`
    star.style.width = size
    star.style.height = size
    fragment.appendChild(star)
  }

  container.appendChild(fragment)
})
</script>
