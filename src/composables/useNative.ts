import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Share } from '@capacitor/share'
import { Preferences } from '@capacitor/preferences'

export function useNative() {
  const isNative = Capacitor.isNativePlatform()
  const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web'

  async function hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!isNative) return
    const styleMap: Record<string, ImpactStyle> = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }
    await Haptics.impact({ style: styleMap[style] })
  }

  async function hapticNotification() {
    if (!isNative) return
    await Haptics.notification({ type: 'SUCCESS' as never })
  }

  async function shareCard(title: string, text: string, url?: string) {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: title,
    })
  }

  async function saveData(key: string, value: unknown) {
    await Preferences.set({ key, value: JSON.stringify(value) })
  }

  async function loadData<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })
    return value ? JSON.parse(value) : null
  }

  async function removeData(key: string) {
    await Preferences.remove({ key })
  }

  return {
    isNative,
    platform,
    hapticFeedback,
    hapticNotification,
    shareCard,
    saveData,
    loadData,
    removeData,
  }
}
