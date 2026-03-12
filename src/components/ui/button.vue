<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
})

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    default:
      'bg-gradient-to-r from-gold to-gold-light text-background shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:-translate-y-0.5',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-background',
    ghost: 'text-gold hover:bg-gold/10',
    link: 'text-gold underline-offset-4 hover:underline',
  }

  const sizes = {
    default: 'h-10 px-6 py-2',
    sm: 'h-8 px-4 text-sm',
    lg: 'h-12 px-8 text-lg',
    icon: 'h-10 w-10',
  }

  return cn(base, variants[props.variant], sizes[props.size])
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
