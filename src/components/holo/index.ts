/**
 * Holo 全息效果组件库
 *
 * 组件：
 * - HoloFoil: 全息效果容器（hover-tilt + custom gradient + glare mask）
 *
 * 效果 CSS：
 * - effects/shadows.css: 自定义阴影效果类
 * - effects/gradients.css: 自定义渐变效果类
 * - effects/masks/: Glare Mask 资源和 CSS
 *
 * @example
 * ```vue
 * <HoloFoil preset="cosmos">
 *   <YourContent />
 * </HoloFoil>
 * ```
 */

// 主组件
export { default as HoloFoil } from './HoloFoil.vue'

// 预设配置
export {
  HOLO_PRESETS,
  HOLO_PRESET_LIST,
  HOLO_PRESET_IDS,
  DEFAULT_PRESET,
  getHoloPreset,
  springOptionsToJson,
  type HoloPreset,
  type GlareMaskMode,
  type GlareMaskComposite,
  type SpringOptions,
} from './presets'

// 兼容旧代码的类型导出
import { HOLO_PRESETS } from './presets'

export type HoloType = keyof typeof HOLO_PRESETS

export const HOLO_TYPES = Object.keys(HOLO_PRESETS) as HoloType[]

export const HOLO_TYPE_LABELS: Record<string, { zh: string; en: string }> = Object.fromEntries(
  Object.entries(HOLO_PRESETS).map(([id, preset]) => [id, preset.name])
)
