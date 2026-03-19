<script setup lang="ts">
/**
 * HoloFoil - hover-tilt 包装组件
 *
 * 职责：提供 tilt 倾斜效果 + 可选的 glare 全息效果
 *
 * hover-tilt 的结构：
 * <hover-tilt>
 *   #shadow-root
 *     <div part="container"> ← perspective
 *       <div part="tilt">   ← rotateX/Y + glare (::before)
 *         <slot />          ← 卡面内容
 *
 * @see https://hover-tilt.simey.me/
 */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getHoloPreset, DEFAULT_PRESET, type HoloPreset } from './presets'
import { useDevice } from '@/composables/useDevice'

import './effects/index.css'

// ========== Props ==========
interface Props {
  preset?: string
  glareIntensity?: number // 0 = 禁用 glare，>0 = 启用
  gyroscope?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'normal',
  glareIntensity: undefined, // undefined = 使用预设默认值
  gyroscope: true,
})

// ========== State ==========
const { isMobile } = useDevice()
const hoverTiltRef = ref<HTMLElement | null>(null)
const gyroEnabled = ref(false)

// ========== 预设配置 ==========
const presetConfig = computed<HoloPreset>(() => getHoloPreset(props.preset || 'normal'))

/**
 * 构建 hover-tilt 的 props (kebab-case)
 * Web Component 属性值都应为字符串
 */
const tiltProps = computed(() => {
  const cfg = presetConfig.value

  // glareIntensity: props 优先，否则使用预设值
  const glareIntensity = props.glareIntensity ?? cfg.glareIntensity ?? 1

  const result: Record<string, string> = {
    'tilt-factor': String(cfg.tiltFactor ?? 1),
    'scale-factor': String(cfg.scaleFactor ?? 1),
    'glare-intensity': String(glareIntensity),
    'glare-hue': String(cfg.glareHue ?? 270),
    'blend-mode': cfg.blendMode || 'overlay',
    'shadow-blur': String(cfg.shadowBlur ?? 12),
    'enter-delay': String(cfg.enterDelay ?? 0),
    'exit-delay': String(cfg.exitDelay ?? 200),
  }

  if (cfg.shadow) result.shadow = 'true'
  if (cfg.tiltFactorY !== undefined) result['tilt-factor-y'] = String(cfg.tiltFactorY)

  // glareMask 相关
  if (cfg.glareMask) result['glare-mask'] = cfg.glareMask
  if (cfg.glareMaskMode) result['glare-mask-mode'] = cfg.glareMaskMode

  const spring = cfg.springOptions ?? DEFAULT_PRESET.springOptions
  const tiltSpring = cfg.tiltSpringOptions ?? DEFAULT_PRESET.tiltSpringOptions
  result['spring-options'] = JSON.stringify(spring)
  result['tilt-spring-options'] = JSON.stringify(tiltSpring)

  return result
})

const holoClasses = computed(() => {
  const cfg = presetConfig.value
  const classes: string[] = ['holo-foil']

  if (gyroEnabled.value) classes.push('gyro-active')
  if (cfg.gradientClass) classes.push(cfg.gradientClass)
  if (cfg.shadowClass) classes.push(cfg.shadowClass)

  return classes
})

// ========== 陀螺仪支持 ==========
const hasGyroscope = () => typeof DeviceOrientationEvent !== 'undefined'

const requestGyroPermission = async (): Promise<boolean> => {
  if (typeof DeviceOrientationEvent === 'undefined') return false
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
  if (typeof DOE.requestPermission === 'function') {
    try {
      return (await DOE.requestPermission()) === 'granted'
    } catch {
      return false
    }
  }
  return true
}

const simulatePointerEvent = (x: number, y: number, type: 'enter' | 'move' | 'leave') => {
  if (!hoverTiltRef.value) return
  const tiltElement = hoverTiltRef.value.shadowRoot?.querySelector('.hover-tilt') as HTMLElement
  if (!tiltElement) return

  const rect = tiltElement.getBoundingClientRect()
  tiltElement.dispatchEvent(
    new PointerEvent(
      type === 'enter' ? 'pointerenter' : type === 'leave' ? 'pointerleave' : 'pointermove',
      {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + x * rect.width,
        clientY: rect.top + y * rect.height,
        pointerId: 1,
        pointerType: 'touch',
      }
    )
  )
}

const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  if (!gyroEnabled.value || !props.gyroscope) return
  const { beta, gamma } = event
  if (beta === null || gamma === null) return
  simulatePointerEvent(
    Math.max(0, Math.min(1, (gamma + 45) / 90)),
    Math.max(0, Math.min(1, (beta - 20) / 70)),
    'move'
  )
}

const enableGyroscope = async (): Promise<boolean> => {
  if (!hasGyroscope() || !(await requestGyroPermission())) return false
  window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })
  gyroEnabled.value = true
  setTimeout(() => simulatePointerEvent(0.5, 0.5, 'enter'), 100)
  return true
}

const disableGyroscope = () => {
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
  if (gyroEnabled.value) simulatePointerEvent(0.5, 0.5, 'leave')
  gyroEnabled.value = false
}

onMounted(async () => {
  await nextTick()

  // 移动端首次触摸时启用陀螺仪（需要用户手势触发权限请求）
  if (props.gyroscope && isMobile.value && hasGyroscope()) {
    document.addEventListener('touchstart', () => enableGyroscope(), { once: true, passive: true })
  }
})

onUnmounted(() => disableGyroscope())

watch(
  () => props.gyroscope,
  enabled => {
    if (enabled && isMobile.value) enableGyroscope()
    else disableGyroscope()
  }
)

defineExpose({
  enableGyroscope,
  disableGyroscope,
  gyroEnabled,
})
</script>

<template>
  <hover-tilt ref="hoverTiltRef" v-bind="tiltProps" :class="holoClasses">
    <slot />
  </hover-tilt>
</template>

<style>
/**
 * HoloFoil 全局样式
 *
 * hover-tilt Web Component 内部结构：
 * <hover-tilt>
 *   #shadow-root
 *     <div part="container">   ← 提供 perspective
 *       <div part="tilt">      ← 应用 transform + glare (::before)
 *         <slot />
 *
 * 使用 ::part() 选择器样式化 shadow DOM 内部元素
 * @see https://hover-tilt.simey.me/options/css/
 */

/* ========== 基础样式 ========== */
hover-tilt.holo-foil {
  display: block;
  width: 100%;
  height: 100%;
}

/* ========== Shadow DOM 内部样式 (::part) ========== */

/* container: 提供 perspective，处理指针事件 */
hover-tilt.holo-foil::part(container) {
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius, 8px);
}

/* tilt: 应用 transform，包含 glare (::before) */
hover-tilt.holo-foil::part(tilt) {
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius, 8px);
  /* 确保 glare (::before) 在内容上层 */
  overflow: hidden;
}

/* ========== 交互层级 ========== */
hover-tilt.holo-foil:hover {
  z-index: 10;
}

/* ========== Holo 激活动画 ========== */
hover-tilt.holo-foil.holo-activate::part(tilt)::before {
  animation: holo-reveal 0.8s ease-out;
}

@keyframes holo-reveal {
  0% {
    opacity: 0;
    filter: brightness(0.5) saturate(0);
  }
  30% {
    opacity: 0.5;
    filter: brightness(1.5) saturate(1.2);
  }
  60% {
    opacity: 1;
    filter: brightness(1.8) saturate(1.5);
  }
  100% {
    opacity: 1;
    filter: brightness(1) saturate(1);
  }
}
</style>
