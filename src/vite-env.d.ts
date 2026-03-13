/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>
  export default component
}

// hover-tilt Web Component 模块声明
declare module 'hover-tilt/web-component' {
  const register: () => void
  export default register
}

/**
 * hover-tilt 类型声明
 *
 * 注意：hover-tilt/vue 的类型定义有问题（会覆盖 Vue 导出）
 * 所以我们在这里手动声明类型，配合 vite.config.ts 的 isCustomElement 使用
 */
declare namespace JSX {
  interface IntrinsicElements {
    'hover-tilt': {
      'tilt-factor'?: number
      'tilt-factor-y'?: number
      'scale-factor'?: number
      'enter-delay'?: number
      'exit-delay'?: number
      shadow?: boolean
      'shadow-blur'?: number
      'blend-mode'?: string
      'glare-intensity'?: number
      'glare-hue'?: number
      'glare-mask'?: string
      'glare-mask-mode'?: string
      'glare-mask-composite'?: string
      class?: string | Record<string, boolean>
      style?: string | Record<string, string>
      ref?: unknown
      children?: unknown
    }
  }
}
