import { computed, watchEffect } from 'vue'
import { 
  useMediaQuery, 
  useWindowSize,
  usePreferredDark
} from '@vueuse/core'

function checkMobileUA(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/.test(ua)
}

const isMobileUA = checkMobileUA()

export function useDevice() {
  const { width, height } = useWindowSize()
  
  const isMobile = computed(() => isMobileUA)

  const isLandscape = computed(() => width.value > height.value)
  
  const isMobileLandscape = computed(() => isMobile.value && isLandscape.value)
  
  const isMobilePortrait = computed(() => isMobile.value && !isLandscape.value)

  const isSmallScreen = useMediaQuery('(max-width: 639px)')
  const isMediumScreen = useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  
  const prefersDark = usePreferredDark()

  const deviceType = computed(() => {
    if (isMobile.value) {
      return isLandscape.value ? 'mobile-landscape' : 'mobile-portrait'
    }
    if (width.value < 1024) {
      return 'tablet'
    }
    return 'desktop'
  })

  watchEffect(() => {
    if (typeof document === 'undefined') return
    
    const body = document.body
    body.classList.toggle('is-mobile-device', isMobile.value)
    body.classList.toggle('is-mobile-landscape', isMobileLandscape.value)
    body.classList.toggle('is-mobile-portrait', isMobilePortrait.value)
  })

  return {
    isMobile,
    isMobileUA,
    isLandscape,
    isMobileLandscape,
    isMobilePortrait,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    deviceType,
    prefersDark,
    windowWidth: width,
    windowHeight: height
  }
}
