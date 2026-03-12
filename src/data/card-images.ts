/**
 * 塔罗牌图片资源
 * 图片懒加载，使用时才请求
 */

import { getCardFilename } from './index'

/** 默认图片牌组 */
export const IMAGE_DECK_ID = 'rider'

/** 支持图片的牌组 ID 列表 */
const IMAGE_DECK_IDS = ['chinese', 'rider']

/**
 * 获取卡牌图片 URL
 * @param cardIndex 卡牌序号 0-77
 * @param deckId 牌组 ID
 * @returns 图片 URL，无效时返回空字符串
 */
export function getCardImageUrl(cardIndex: number, deckId = IMAGE_DECK_ID): string {
  if (!IMAGE_DECK_IDS.includes(deckId)) return '' // 非图片牌组
  if (cardIndex < 0 || cardIndex > 77 || isNaN(cardIndex)) return '' // 无效索引

  const filename = getCardFilename(cardIndex)
  if (filename.includes('unknown')) return '' // 文件名无效

  try {
    return new URL(`../assets/tarot/${deckId}/${filename}`, import.meta.url).href
  } catch {
    return ''
  }
}

/**
 * 检查是否为图片牌组
 */
export function isImageDeck(deckId: string): boolean {
  return deckId !== 'emoji'
}
