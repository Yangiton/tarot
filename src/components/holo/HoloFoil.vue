<script setup lang="ts">
/**
 * HoloFoil - 全息效果容器组件
 *
 * 功能：
 * 1. 基于 hover-tilt 实现 3D 倾斜效果
 * 2. 炫光 Glare 效果
 * 3. 自定义 Shine 彩虹渐变层
 * 4. 陀螺仪支持（移动端）
 *
 * 注意：此组件仅负责视觉效果，不处理翻转逻辑
 *
 * @see https://hover-tilt.simey.me/
 * @see https://poke-holo.simey.me/
 */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getHoloPreset, DEFAULT_PRESET, type HoloPreset } from './presets'
import { useDevice } from '@/composables/useDevice'

// ========== Props ==========
interface Props {
  /** 预设 ID */
  preset?: string
  /** 禁用所有效果 */
  disabled?: boolean
  /** 启用陀螺仪（移动端） */
  gyroscope?: boolean
  /** 圆角 */
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'normal',
  disabled: false,
  gyroscope: true,
  borderRadius: '8px',
})

// ========== State ==========
const { isMobile } = useDevice()
const hoverTiltRef = ref<HTMLElement | null>(null)
const gyroEnabled = ref(false)

// ========== 预设配置 ==========
const presetConfig = computed<HoloPreset>(() => getHoloPreset(props.preset || 'normal'))

/** hover-tilt 属性 */
const tiltProps = computed(() => {
  const cfg = presetConfig.value

  if (props.disabled || cfg.tiltFactor === 0) {
    return {
      'tilt-factor': '0',
      'scale-factor': '1',
      'glare-intensity': '0',
    }
  }

  const result: Record<string, string | boolean> = {
    'tilt-factor': String(cfg.tiltFactor ?? 1),
    'scale-factor': String(cfg.scaleFactor ?? 1.02),
    'glare-intensity': String(cfg.glareIntensity ?? 1),
    'glare-hue': String(cfg.glareHue ?? 270),
    'blend-mode': cfg.blendMode || 'overlay',
    'shadow-blur': String(cfg.shadowBlur ?? 20),
    'enter-delay': String(cfg.enterDelay ?? 0),
    'exit-delay': String(cfg.exitDelay ?? 150),
  }

  if (cfg.shadow !== false) result.shadow = true
  if (cfg.tiltFactorY !== undefined) result['tilt-factor-y'] = String(cfg.tiltFactorY)
  if (cfg.glareMask) result['glare-mask'] = cfg.glareMask
  if (cfg.glareMaskMode) result['glare-mask-mode'] = cfg.glareMaskMode

  const spring = cfg.springOptions ?? DEFAULT_PRESET.springOptions
  const tiltSpring = cfg.tiltSpringOptions ?? DEFAULT_PRESET.tiltSpringOptions
  result['spring-options'] = JSON.stringify(spring)
  result['tilt-spring-options'] = JSON.stringify(tiltSpring)

  return result
})

/** Shine 层显示 */
const showShine = computed(() => !props.disabled && !!presetConfig.value.shineGradient)

/** Shine 层样式 */
const shineStyle = computed(() => {
  const cfg = presetConfig.value
  if (!cfg.shineGradient) return ''
  return `background-image: ${cfg.shineGradient}; mix-blend-mode: ${cfg.shineBlendMode || 'color-dodge'}; filter: ${cfg.shineFilter || 'none'};`
})

// ========== CSS 变量设置 ==========
const updateCssVars = () => {
  if (!hoverTiltRef.value) return

  // hover-tilt 是 Web Component，需要获取其 DOM 元素
  const el = (hoverTiltRef.value as any).$el || hoverTiltRef.value
  if (el && typeof el.style?.setProperty === 'function') {
    el.style.setProperty('--holo-radius', props.borderRadius || '8px')
  }
}

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
  if (!gyroEnabled.value || !props.gyroscope || props.disabled) return
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

// ========== 生命周期 ==========
onMounted(async () => {
  await nextTick()
  updateCssVars()

  if (props.gyroscope && isMobile.value && hasGyroscope()) {
    document.addEventListener(
      'touchstart',
      async function onTouch() {
        await enableGyroscope()
        document.removeEventListener('touchstart', onTouch)
      },
      { once: true, passive: true }
    )
  }
})

onUnmounted(() => disableGyroscope())

watch(() => props.borderRadius, updateCssVars)
watch(
  () => props.gyroscope,
  enabled => {
    if (enabled && isMobile.value) enableGyroscope()
    else disableGyroscope()
  }
)

// ========== 暴露 ==========
defineExpose({
  enableGyroscope,
  disableGyroscope,
  gyroEnabled,
})
</script>

<template>
  <hover-tilt
    ref="hoverTiltRef"
    v-bind="tiltProps"
    class="holo-foil"
    :class="{ 'gyro-active': gyroEnabled }"
  >
    <!-- Shine 彩虹渐变层 -->
    <div v-if="showShine" class="holo-shine" :style="shineStyle" />
    <!-- 插槽内容 -->
    <slot />
  </hover-tilt>
</template>

<style>
/**
 * HoloFoil 样式
 * 使用 ::part() 选择器控制 hover-tilt Shadow DOM 内部元素
 */

hover-tilt.holo-foil {
  --holo-radius: 8px;

  display: block;
  width: 100%;
  height: 100%;
}

/* Shadow DOM 内部容器 */
hover-tilt.holo-foil::part(container) {
  width: 100%;
  height: 100%;
  border-radius: var(--holo-radius);
}

hover-tilt.holo-foil::part(tilt) {
  width: 100%;
  height: 100%;
  border-radius: var(--holo-radius);
  /* 不设置 overflow: hidden，让 3D 变换可以溢出 */
}

/* Shine 彩虹渐变层 */
hover-tilt.holo-foil .holo-shine {
  position: absolute;
  inset: 0;
  border-radius: var(--holo-radius);
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  background-size: 400% 400%;
  background-position: 50% 50%;
  transition:
    opacity 0.35s ease-out,
    background-position 0.15s ease-out;
}

hover-tilt.holo-foil:hover .holo-shine,
hover-tilt.holo-foil.gyro-active .holo-shine {
  opacity: 0.75;
  /* 使用 hover-tilt 暴露的 CSS 变量实现动态位置 */
  background-position: calc(20% + var(--hover-tilt-pointer-x, 0.5) * 60%)
    calc(20% + var(--hover-tilt-pointer-y, 0.5) * 60%);
}
</style>
