/**
 * Holo 全息效果组件库
 *
 * 组件：
 * - HoloFoil: 全息效果容器（tilt + glare + shine）
 *
 * @example
 * ```vue
 * <!-- 全息容器 -->
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
  type SpringOptions,
} from './presets'

// 兼容旧代码的类型导出
import { HOLO_PRESETS } from './presets'

export type HoloType = keyof typeof HOLO_PRESETS

export const HOLO_TYPES = Object.keys(HOLO_PRESETS) as HoloType[]

export const HOLO_TYPE_LABELS: Record<string, { zh: string; en: string }> = Object.fromEntries(
  Object.entries(HOLO_PRESETS).map(([id, preset]) => [id, preset.name])
)
