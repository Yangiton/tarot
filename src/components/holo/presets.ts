/**
 * 全息效果预设配置
 *
 * 基于 hover-tilt 的完整属性系统：
 * https://hover-tilt.simey.me/examples/props/
 *
 * Aesthetic Props:
 * - tiltFactor / tiltFactorY: 倾斜强度
 * - scaleFactor: 悬浮缩放
 * - shadow / shadowBlur: 阴影
 * - glareIntensity / glareHue / blendMode: 炫光
 * - glareMask / glareMaskMode: 炫光遮罩
 *
 * Animation Props:
 * - springOptions: 缩放动画物理参数 { stiffness, damping }
 * - tiltSpringOptions: 倾斜动画物理参数
 * - enterDelay / exitDelay: 进入/离开延迟
 *
 * Custom Shine Layer:
 * - shineGradient / shineBlendMode / shineFilter
 */

// glareMask 资源
import birthdayHoloUrl from './glareMask/birthday-holo.webp'
import aztecPatternUrl from './glareMask/aztec-pattern.webp'
import circuitBoardUrl from './glareMask/circuit-board.svg'

/** Spring 动画参数 */
export interface SpringOptions {
  stiffness: number
  damping: number
}

/** glareMask 混合模式 */
export type GlareMaskMode = 'match-source' | 'luminance' | 'alpha'

/** 预设配置类型 */
export interface HoloPreset {
  id: string
  name: { zh: string; en: string }
  description: { zh: string; en: string }

  // ========== Tilt & Scale ==========
  tiltFactor: number
  tiltFactorY?: number
  scaleFactor: number

  // ========== Shadow ==========
  shadow: boolean
  shadowBlur: number
  shadowColor?: string

  // ========== Glare ==========
  glareIntensity: number
  glareHue: number
  blendMode: string
  glareMask?: string
  glareMaskMode?: GlareMaskMode

  // ========== Animation ==========
  springOptions: SpringOptions
  tiltSpringOptions: SpringOptions
  enterDelay: number
  exitDelay: number

  // ========== Custom Shine Layer ==========
  shineGradient?: string
  shineBlendMode?: string
  shineFilter?: string
}

/**
 * 默认配置 - 使用 hover-tilt 官方默认值
 * 参考: https://hover-tilt.simey.me/options/props-reference/
 */
export const DEFAULT_PRESET: Omit<HoloPreset, 'id' | 'name' | 'description'> = {
  // Tilt & Scale
  tiltFactor: 1.5,
  scaleFactor: 1.05,

  // Shadow
  shadow: true,
  shadowBlur: 60,

  // Glare
  glareIntensity: 1.5,
  glareHue: 270,
  blendMode: 'overlay',

  // Animation - 平滑有弹性的动画
  springOptions: { stiffness: 0.05, damping: 0.5 },
  tiltSpringOptions: { stiffness: 0.1, damping: 0.075 },
  enterDelay: 0,
  exitDelay: 100,
}

/**
 * 创建预设的辅助函数
 */
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
 * 设计原则：
 * 1. 使用 CSS 自定义渐变响应指针位置 (--gradient-x, --gradient-y)
 * 2. 利用 glareIntensity 控制透明度
 * 3. 使用 --hover-tilt-angle 创建旋转效果
 *
 * 分类：
 * - 基础: none, normal, cosmos, rainbow
 * - 高级: galaxy, radiant, pixel, vstar
 * - 遮罩: birthdayHolo, aztec, circuit
 * - 主题: mystical, golden
 *
 * 参考:
 * - https://hover-tilt.simey.me/advanced/custom-gradient/
 * - https://hover-tilt.simey.me/advanced/glare-masks/
 */
export const HOLO_PRESETS: Record<string, HoloPreset> = {
  // ========== 基础效果 ==========
  none: createPreset(
    'none',
    { zh: '无效果', en: 'None' },
    { zh: '不显示全息效果', en: 'No holographic effect' },
    {
      tiltFactor: 0,
      scaleFactor: 1,
      shadow: false,
      shadowBlur: 0,
      glareIntensity: 0,
    }
  ),

  normal: createPreset(
    'normal',
    { zh: '普通全息', en: 'Normal Holo' },
    { zh: '经典彩虹条纹效果', en: 'Classic rainbow stripe effect' },
    {
      glareHue: 270,
      glareIntensity: 0.6,
      blendMode: 'overlay',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 110deg),
        hsl(270, 100%, 75%) 0%,
        hsl(228, 100%, 74%) 10%,
        hsl(93, 100%, 69%) 20%,
        hsl(53, 100%, 69%) 30%,
        hsl(2, 100%, 73%) 40%,
        hsl(270, 100%, 75%) 50%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.8) contrast(1.3) saturate(1.1)',
    }
  ),

  cosmos: createPreset(
    'cosmos',
    { zh: '宇宙全息', en: 'Cosmos Holo' },
    { zh: '梦幻星空背景', en: 'Dreamy starfield background' },
    {
      shadowColor: 'rgba(147, 112, 219, 0.35)',
      glareHue: 260,
      glareIntensity: 0.7,
      blendMode: 'soft-light',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 82deg),
        hsl(53, 70%, 60%) 4%,
        hsl(93, 60%, 55%) 8%,
        hsl(176, 60%, 52%) 12%,
        hsl(228, 65%, 58%) 16%,
        hsl(283, 65%, 58%) 20%,
        hsl(326, 65%, 54%) 24%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.85) contrast(1.2) saturate(1.0)',
    }
  ),

  rainbow: createPreset(
    'rainbow',
    { zh: '彩虹全息', en: 'Rainbow Holo' },
    { zh: '强烈彩虹渐变', en: 'Intense rainbow gradient' },
    {
      glareIntensity: 0.75,
      glareHue: 0,
      blendMode: 'hard-light',
      shineGradient: `linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) - 30deg),
        hsl(0, 65%, 45%),
        hsl(40, 60%, 45%),
        hsl(90, 65%, 42%),
        hsl(180, 65%, 42%),
        hsl(210, 65%, 45%),
        hsl(280, 60%, 40%),
        hsl(0, 65%, 45%)
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.75) contrast(1.6) saturate(0.9)',
    }
  ),

  // ========== 高级效果 ==========
  galaxy: createPreset(
    'galaxy',
    { zh: '银河全息', en: 'Galaxy Holo' },
    { zh: '深空星云效果', en: 'Deep space nebula effect' },
    {
      shadowColor: 'rgba(100, 100, 200, 0.4)',
      glareIntensity: 0.85,
      glareHue: 240,
      blendMode: 'overlay',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 125deg),
        hsl(283, 100%, 73%) 0%,
        hsl(228, 100%, 74%) 12%,
        hsl(176, 100%, 76%) 24%,
        hsl(93, 100%, 69%) 36%,
        hsl(53, 100%, 69%) 48%,
        hsl(2, 100%, 73%) 60%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.65) contrast(1.8) saturate(1.0)',
    }
  ),

  radiant: createPreset(
    'radiant',
    { zh: '光辉全息', en: 'Radiant Holo' },
    { zh: '金属放射状', en: 'Metallic radial shine' },
    {
      shadowColor: 'rgba(255, 215, 0, 0.35)',
      glareIntensity: 0.9,
      glareHue: 45,
      blendMode: 'hard-light',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 45deg),
        hsl(0, 0%, 15%) 0%,
        hsl(0, 0%, 55%) 3%,
        hsl(0, 0%, 15%) 6%
      ),
      repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) - 45deg),
        hsl(0, 0%, 15%) 0%,
        hsl(0, 0%, 55%) 3%,
        hsl(0, 0%, 15%) 6%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.55) contrast(1.8) saturate(1.3)',
    }
  ),

  pixel: createPreset(
    'pixel',
    { zh: '像素全息', en: 'Pixel Holo' },
    { zh: '复古点阵效果', en: 'Retro dot matrix effect' },
    {
      glareIntensity: 0.6,
      glareHue: 180,
      blendMode: 'overlay',
      shineGradient: `repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 2px,
        hsla(0, 0%, 100%, 0.08) 2px,
        hsla(0, 0%, 100%, 0.08) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        hsla(0, 0%, 100%, 0.08) 2px,
        hsla(0, 0%, 100%, 0.08) 4px
      ),
      repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 110deg),
        hsl(2, 100%, 73%) 0%,
        hsl(53, 100%, 69%) 20%,
        hsl(93, 100%, 69%) 40%,
        hsl(228, 100%, 74%) 60%,
        hsl(283, 100%, 73%) 80%,
        hsl(2, 100%, 73%) 100%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.75) contrast(1.6) saturate(0.85)',
    }
  ),

  vstar: createPreset(
    'vstar',
    { zh: 'V-Star', en: 'V-Star' },
    { zh: '高级 V-Star 闪卡效果', en: 'Premium V-Star holo effect' },
    {
      shadowColor: 'rgba(200, 200, 255, 0.4)',
      glareIntensity: 0.9,
      glareHue: 200,
      blendMode: 'hard-light',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg)),
        hsl(2, 100%, 73%) 5%,
        hsl(53, 100%, 69%) 10%,
        hsl(93, 100%, 69%) 15%,
        hsl(176, 100%, 76%) 20%,
        hsl(228, 100%, 74%) 25%,
        hsl(283, 100%, 73%) 30%,
        hsl(2, 100%, 73%) 35%
      ),
      repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 133deg),
        #0e152e 0%,
        hsl(180, 15%, 60%) 4%,
        hsl(180, 30%, 68%) 5%,
        hsl(180, 15%, 60%) 6%,
        #0e152e 12%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.5) contrast(1.8) saturate(1.2)',
    }
  ),

  // ========== 遮罩效果 ==========
  birthdayHolo: createPreset(
    'birthdayHolo',
    { zh: '生日全息', en: 'Birthday Holo' },
    { zh: 'Pokemon 风格生日闪卡', en: 'Pokemon-style birthday holo card' },
    {
      shadowColor: 'rgba(255, 200, 100, 0.4)',
      glareIntensity: 0.7,
      glareHue: 30,
      glareMask: `url(${birthdayHoloUrl})`,
      glareMaskMode: 'luminance',
      shineGradient: `repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 110deg),
        hsl(45, 100%, 70%) 0%,
        hsl(30, 100%, 65%) 20%,
        hsl(350, 100%, 70%) 40%,
        hsl(280, 100%, 70%) 60%,
        hsl(200, 100%, 70%) 80%,
        hsl(45, 100%, 70%) 100%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.75) contrast(1.5) saturate(1.1)',
    }
  ),

  aztec: createPreset(
    'aztec',
    { zh: '阿兹特克', en: 'Aztec' },
    { zh: '神秘几何图案', en: 'Mystical geometric pattern' },
    {
      shadowColor: 'rgba(255, 215, 0, 0.35)',
      glareIntensity: 0.75,
      glareHue: 45,
      glareMask: `url(${aztecPatternUrl})`,
      glareMaskMode: 'luminance',
      shineGradient: `linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 135deg),
        hsl(45, 100%, 62%) 0%,
        hsl(35, 100%, 57%) 25%,
        hsl(25, 100%, 52%) 50%,
        hsl(35, 100%, 57%) 75%,
        hsl(45, 100%, 62%) 100%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.8) contrast(1.4) saturate(1.0)',
    }
  ),

  circuit: createPreset(
    'circuit',
    { zh: '电路板', en: 'Circuit Board' },
    { zh: '科技感电路图案', en: 'Tech-style circuit pattern' },
    {
      shadowColor: 'rgba(0, 200, 255, 0.35)',
      glareIntensity: 0.65,
      glareHue: 180,
      blendMode: 'screen',
      glareMask: `url(${circuitBoardUrl})`,
      glareMaskMode: 'alpha',
      shineGradient: `linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 45deg),
        hsl(180, 100%, 52%) 0%,
        hsl(200, 100%, 62%) 50%,
        hsl(220, 100%, 52%) 100%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.75) contrast(1.5) saturate(1.1)',
    }
  ),

  // ========== 主题效果 ==========
  mystical: createPreset(
    'mystical',
    { zh: '神秘占卜', en: 'Mystical' },
    { zh: '紫色神秘光芒', en: 'Purple mystical glow' },
    {
      shadowColor: 'rgba(147, 112, 219, 0.45)',
      glareIntensity: 0.7,
      glareHue: 280,
      blendMode: 'overlay',
      exitDelay: 250,
      shineGradient: `radial-gradient(
        ellipse at 50% 0%,
        hsla(280, 100%, 80%, 0.35) 0%,
        transparent 60%
      ),
      repeating-linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 170deg),
        hsl(280, 80%, 62%) 0%,
        hsl(260, 80%, 58%) 15%,
        hsl(240, 80%, 62%) 30%,
        hsl(260, 80%, 58%) 45%,
        hsl(280, 80%, 62%) 60%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.7) contrast(1.5) saturate(1.0)',
    }
  ),

  golden: createPreset(
    'golden',
    { zh: '金色华贵', en: 'Golden Luxe' },
    { zh: '奢华金色光芒', en: 'Luxurious golden glow' },
    {
      shadowColor: 'rgba(255, 215, 0, 0.45)',
      glareIntensity: 0.85,
      glareHue: 45,
      blendMode: 'hard-light',
      shineGradient: `linear-gradient(
        calc(var(--hover-tilt-angle, 0deg) + 135deg),
        hsl(45, 100%, 72%) 0%,
        hsl(40, 100%, 62%) 25%,
        hsl(35, 100%, 52%) 50%,
        hsl(40, 100%, 62%) 75%,
        hsl(45, 100%, 72%) 100%
      )`,
      shineBlendMode: 'color-dodge',
      shineFilter: 'brightness(0.75) contrast(1.5) saturate(1.2)',
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

/** 将 SpringOptions 转换为 JSON 字符串 (用于 Web Component 属性) */
export function springOptionsToJson(options: SpringOptions): string {
  return JSON.stringify(options)
}
