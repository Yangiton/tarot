import { createI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import zh from './locales/zh.json'
import en from './locales/en.json'

export type SupportedLocale = 'zh' | 'en'

function detectLocale(): SupportedLocale {
  const stored = localStorage.getItem('tarot-locale')
  if (stored === 'zh' || stored === 'en') return stored
  return navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { zh, en },
})

export const currentLocale = useStorage<SupportedLocale>('tarot-locale', detectLocale())
