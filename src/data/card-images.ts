/**
 * 塔罗牌图片资源
 * 图片懒加载，使用时才请求
 */

import { getCardFilename } from './index'

/** 默认图片牌组 */
export const IMAGE_DECK_ID = '178'

/**
 * 获取卡牌图片 URL
 * @param cardIndex 卡牌序号 0-77
 * @param deckId 牌组 ID
 */
export function getCardImageUrl(cardIndex: number, deckId = IMAGE_DECK_ID): string {
  if (deckId === '0') return '' // Emoji 牌组无图片
  if (deckId !== IMAGE_DECK_ID) return '' // 暂只支持 178
  
  const filename = getCardFilename(cardIndex)
  return new URL(`../assets/tarot/${deckId}/${filename}`, import.meta.url).href
}

/**
 * 检查是否为图片牌组
 */
export function isImageDeck(deckId: string): boolean {
  return deckId !== '0'
}
