/**
 * 全息效果预设配置
 *
 * 基于 hover-tilt 的属性系统：
 * @see https://hover-tilt.simey.me/options/props/
 *
 * Props 说明:
 * - tiltFactor: 倾斜强度 (默认 1)
 * - scaleFactor: 悬浮缩放 (默认 1)
 * - shadow: 动态阴影
 * - shadowBlur: 阴影模糊
 * - glareIntensity: 光泽强度
 * - glareHue: 光泽色相
 * - blendMode: 混合模式
 * - glareMask / glareMaskMode: 遮罩效果
 *
 * @see https://hover-tilt.simey.me/advanced/custom-gradient/
 * @see https://hover-tilt.simey.me/advanced/glare-masks/
 */

import aztecPatternUrl from './effects/masks/aztec-pattern.webp'
import circuitBoardUrl from './effects/masks/circuit-board.svg'
import birthdayHoloUrl from './effects/masks/birthday-holo.webp'

/** Spring 动画参数 */
export interface SpringOptions {
  stiffness: number
  damping: number
}

/** glareMask 混合模式 */
export type GlareMaskMode = 'match-source' | 'luminance' | 'alpha'

/** glareMask 合成模式 */
export type GlareMaskComposite = 'add' | 'subtract' | 'exclude' | 'intersect'

/** 预设配置类型 */
export interface HoloPreset {
  id: string
  name: { zh: string; en: string }
  description: { zh: string; en: string }

  // Interaction Props
  tiltFactor: number
  tiltFactorY?: number
  scaleFactor: number
  springOptions: SpringOptions
  tiltSpringOptions: SpringOptions
  enterDelay: number
  exitDelay: number

  // Aesthetic Props
  shadow: boolean
  shadowBlur: number
  blendMode: string
  glareIntensity: number
  glareHue: number
  glareMask?: string
  glareMaskMode?: GlareMaskMode
  glareMaskComposite?: GlareMaskComposite

  // CSS 效果类
  gradientClass?: string
  shadowClass?: string
}

/**
 * 默认配置 — 使用 hover-tilt 官方默认值
 * @see https://hover-tilt.simey.me/options/props/
 */
export const DEFAULT_PRESET: Omit<HoloPreset, 'id' | 'name' | 'description'> = {
  tiltFactor: 1.5,
  scaleFactor: 1.05,
  springOptions: { stiffness: 0.2, damping: 0.8 },
  tiltSpringOptions: { stiffness: 0.2, damping: 0.8 },
  enterDelay: 0,
  exitDelay: 200,
  shadow: false,
  shadowBlur: 12,
  blendMode: 'overlay',
  glareIntensity: 1,
  glareHue: 270,
}

function createPreset(
  id: string,
  name: { zh: string; en: string },
  description: { zh: string; en: string },
  overrides: Partial<Omit<HoloPreset, 'id' | 'name' | 'description'>> = {}
): HoloPreset {
  return {
    ...DEFAULT_PRESET,
    id,
    name,
    description,
    ...overrides,
  }
}

/**
 * 全息效果预设集合
 *
 * @see https://hover-tilt.simey.me/options/css/
 * @see https://hover-tilt.simey.me/advanced/glare-masks/
 *
 * 预设类型：
 * 1. none: 无效果（仅保留 tilt）
 * 2. normal: 默认效果（hover-tilt 原生 glare）
 * 3. 图片遮罩: aztec, circuit, birthday（使用 glareMask + glareMaskMode）
 * 4. CSS 渐变遮罩: dots, stripes（使用 CSS gradient 作为 glareMask）
 */
export const HOLO_PRESETS: Record<string, HoloPreset> = {
  // ========== 基础效果 ==========

  // 1. 无全息效果（保留 tilt）
  none: createPreset(
    'none',
    { zh: '无效果', en: 'None' },
    { zh: '关闭全息效果，保留倾斜', en: 'No holographic effect, keep tilt' },
    {
      shadow: false,
      glareIntensity: 0,
    }
  ),

  // 2. 默认效果（hover-tilt 原生 glare）
  normal: createPreset(
    'normal',
    { zh: '默认全息', en: 'Default Holo' },
    { zh: 'hover-tilt 原生效果', en: 'Native hover-tilt glare effect' },
    {
      shadow: true,
      shadowBlur: 60,
    }
  ),

  // ========== 图片遮罩效果 (glareMask + glareMaskMode) ==========

  // 3. 图腾全息（黑白 webp + luminance）
  aztec: createPreset(
    'aztec',
    { zh: '图腾全息', en: 'Aztec Holo' },
    { zh: '神秘几何图案遮罩', en: 'Mystical geometric pattern mask' },
    {
      shadow: true,
      shadowBlur: 30,
      glareIntensity: 1.3,
      glareHue: 45,
      blendMode: 'hard-light',
      glareMask: `url(${aztecPatternUrl})`,
      glareMaskMode: 'luminance',
    }
  ),

  // 4. 电路全息（透明 svg + alpha）
  circuit: createPreset(
    'circuit',
    { zh: '电路全息', en: 'Circuit Holo' },
    { zh: '科技电路板图案', en: 'Tech circuit board pattern' },
    {
      shadow: true,
      shadowBlur: 25,
      glareIntensity: 1.2,
      glareHue: 180,
      blendMode: 'screen',
      glareMask: `url(${circuitBoardUrl})`,
      glareMaskMode: 'alpha',
    }
  ),

  // 5. 生日全息（彩色 webp + luminance）
  birthday: createPreset(
    'birthday',
    { zh: '生日全息', en: 'Birthday Holo' },
    { zh: '缤纷庆祝图案', en: 'Colorful celebration pattern' },
    {
      shadow: true,
      shadowBlur: 35,
      glareIntensity: 1.4,
      glareHue: 300,
      blendMode: 'overlay',
      glareMask: `url(${birthdayHoloUrl})`,
      glareMaskMode: 'alpha',
    }
  ),

  // ========== CSS 渐变遮罩效果 (glareMask + alpha) ==========

  // 6. 圆点全息（CSS repeating-radial-gradient）
  dots: createPreset(
    'dots',
    { zh: '圆点全息', en: 'Dots Holo' },
    { zh: '重复圆点图案', en: 'Repeating dots pattern' },
    {
      shadow: true,
      shadowBlur: 20,
      glareIntensity: 1.1,
      glareHue: 200,
      blendMode: 'overlay',
      glareMask:
        'repeating-radial-gradient(circle at 30% 30%, #fff, #fff 8px, #fff0 8px, #fff0 16px)',
      glareMaskMode: 'alpha',
    }
  ),

  // 7. 条纹全息（CSS repeating-linear-gradient）
  stripes: createPreset(
    'stripes',
    { zh: '条纹全息', en: 'Stripes Holo' },
    { zh: '斜条纹图案', en: 'Diagonal stripes pattern' },
    {
      shadow: true,
      shadowBlur: 20,
      glareIntensity: 1.0,
      glareHue: 60,
      blendMode: 'hard-light',
      glareMask: 'repeating-linear-gradient(45deg, #fff 0px, #fff 3px, #fff0 3px, #fff0 10px)',
      glareMaskMode: 'alpha',
    }
  ),
}

/** 预设列表 (用于 UI 选择) */
export const HOLO_PRESET_LIST = Object.values(HOLO_PRESETS)

/** 预设 ID 列表 */
export const HOLO_PRESET_IDS = Object.keys(HOLO_PRESETS)

/** 获取预设，不存在则返回 none */
export function getHoloPreset(id: string): HoloPreset {
  return HOLO_PRESETS[id] || HOLO_PRESETS.none
}
