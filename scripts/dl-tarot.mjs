#!/usr/bin/env node
/**
 * 塔罗牌图片下载脚本 (默认)
 *
 * 来源: https://www.tarot.com/tarot/decks
 *
 * 用法：
 *   pnpm dl:tarot <deck_name> [--local-id <id>]
 *
 * 示例：
 *   pnpm dl:tarot chinese                  # 下载中国人塔罗牌
 *   pnpm dl:tarot rider                    # 下载韦特塔罗牌
 *   pnpm dl:tarot --list                   # 列出常用牌组
 *
 * URL 规则：
 *   图片: https://gfx.tarot.com/images/site/decks/{deck_name}/full_size/{0-77}.jpg
 *   封面: https://gfx.tarot.com/images/decks/deck-image/{deck_name}.jpg
 *
 * 本地路径：src/assets/tarot/{local_id}/{序号}-{英文名}.jpg
 *   如: src/assets/tarot/chinese/00-fool.jpg
 *
 * 输出文件：
 *   - cover.jpg          封面图
 *   - 00-fool.jpg ~ 77-king-pentacles.jpg  78张牌
 *   - meta.json          牌组元数据（宽高比等）
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============ 配置 ============

const CDN_BASE = 'https://gfx.tarot.com/images/site/decks'
const COVER_BASE = 'https://gfx.tarot.com/images/decks/deck-image'

/** 常用牌组映射 (deck_name -> 推荐本地 ID) */
const DECK_PRESETS = {
  rider: { localId: 'rider', name: '莱德·韦特塔罗牌' },
  chinese: { localId: 'chinese', name: '中国人塔罗牌' },
  // 可扩展更多牌组
}

/**
 * 大阿尔卡纳英文名（0-21）
 */
const MAJOR_ARCANA = [
  'fool',
  'magician',
  'high-priestess',
  'empress',
  'emperor',
  'hierophant',
  'lovers',
  'chariot',
  'strength',
  'hermit',
  'fortune-wheel',
  'justice',
  'hanged-man',
  'death',
  'temperance',
  'devil',
  'tower',
  'stars',
  'moon',
  'sun',
  'judgement',
  'world',
]

/** 小阿尔卡纳数字名 */
const NUMBERS = [
  '',
  'ace',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'page',
  'knight',
  'queen',
  'king',
]

/** 四种花色 */
const SUITS = ['wands', 'cups', 'swords', 'pentacles']

// ============ 工具函数 ============

function getCardName(id) {
  if (id <= 21) return MAJOR_ARCANA[id]
  const minorId = id - 22
  return `${NUMBERS[(minorId % 14) + 1]}-${SUITS[Math.floor(minorId / 14)]}`
}

function getLocalFilename(id) {
  return `${String(id).padStart(2, '0')}-${getCardName(id)}.jpg`
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close()
          fs.unlinkSync(dest)
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          file.close()
          fs.unlinkSync(dest)
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', err => {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        reject(err)
      })
  })
}

const delay = ms => new Promise(r => setTimeout(r, ms))

/**
 * 获取 JPEG 图片尺寸（解析 JPEG 头部）
 */
function getJpegSize(filePath) {
  try {
    const buffer = fs.readFileSync(filePath)
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null

    let offset = 2
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset++
        continue
      }
      const marker = buffer[offset + 1]
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
        }
      }
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2
      } else if (marker === 0x00 || marker === 0xff) {
        offset++
      } else {
        offset += 2 + buffer.readUInt16BE(offset + 2)
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * 计算宽高比字符串
 */
function calcAspectRatio(width, height) {
  const ratio = width / height
  const commonRatios = [
    { r: 2 / 3, s: '2:3' },
    { r: 3 / 5, s: '3:5' },
    { r: 9 / 16, s: '9:16' },
    { r: 1 / 1.618, s: '1:φ' },
  ]
  for (const { r, s } of commonRatios) {
    if (Math.abs(ratio - r) < 0.02) return s
  }
  return ratio.toFixed(3)
}

function printHelp() {
  console.log(`
塔罗牌图片下载脚本 (tarot.com 来源)

用法: pnpm dl:tarot <deck_name> [options]

参数:
  deck_name       牌组名称（如 chinese, rider）

选项:
  --local-id <id> 本地保存的牌组 ID（默认使用牌组名）
  --list          列出常用牌组预设
  -h, --help      显示帮助

示例:
  pnpm dl:tarot chinese                    # 下载中国人塔罗牌
  pnpm dl:tarot rider                      # 下载韦特塔罗牌

来源: https://www.tarot.com/tarot/decks
输出: src/assets/tarot/{local_id}/
命名: {序号}-{英文名}.jpg (如 00-fool.jpg)
`)
}

function printList() {
  console.log('\n常用牌组预设:\n')
  console.log('  牌组名称       本地ID          中文名')
  console.log('  ' + '-'.repeat(50))
  for (const [name, info] of Object.entries(DECK_PRESETS)) {
    console.log(`  ${name.padEnd(15)} ${info.localId.padEnd(15)} ${info.name}`)
  }
  console.log('\n更多牌组请访问: https://www.tarot.com/tarot/decks\n')
}

// ============ 主函数 ============

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    return
  }

  if (args.includes('--list')) {
    printList()
    return
  }

  // 解析参数
  const deckName = args.find(
    a => !a.startsWith('-') && !args[args.indexOf(a) - 1]?.startsWith('--')
  )
  const localIdIndex = args.indexOf('--local-id')
  let localId = localIdIndex >= 0 ? args[localIdIndex + 1] : null

  if (!deckName) {
    console.error('错误: 请指定牌组名称\n')
    printHelp()
    process.exit(1)
  }

  // 使用预设或自定义
  const preset = DECK_PRESETS[deckName]
  if (!localId) {
    localId = preset?.localId || deckName
  }

  const outDir = path.resolve(__dirname, `../src/assets/tarot/${localId}`)
  fs.mkdirSync(outDir, { recursive: true })

  console.log('='.repeat(55))
  console.log(`塔罗牌下载 (tarot.com)`)
  console.log(`牌组: ${deckName}${preset ? ` (${preset.name})` : ''}`)
  console.log(`本地ID: ${localId}`)
  console.log(`输出: ${outDir}`)
  console.log('='.repeat(55))

  // 下载封面
  const coverUrl = `${COVER_BASE}/${deckName}.jpg`
  const coverPath = path.join(outDir, 'cover.jpg')

  if (!fs.existsSync(coverPath)) {
    try {
      console.log(`下载封面: ${coverUrl}`)
      await downloadFile(coverUrl, coverPath)
      console.log('  ✓ 封面下载成功')
    } catch (e) {
      console.log(`  ✗ 封面下载失败: ${e.message}`)
    }
  } else {
    console.log('跳过封面: 已存在')
  }

  // 下载所有卡牌
  let success = 0,
    skip = 0,
    fail = 0

  for (let id = 0; id < 78; id++) {
    const localFile = getLocalFilename(id)
    const localPath = path.join(outDir, localFile)
    const url = `${CDN_BASE}/${deckName}/full_size/${id}.jpg`

    if (fs.existsSync(localPath)) {
      console.log(`[${String(id + 1).padStart(2)}/78] 跳过: ${localFile}`)
      skip++
      continue
    }

    try {
      console.log(`[${String(id + 1).padStart(2)}/78] 下载: ${id}.jpg -> ${localFile}`)
      await downloadFile(url, localPath)
      success++
      await delay(200)
    } catch (e) {
      console.error(`  ✗ ${e.message}`)
      fail++
    }
  }

  console.log('='.repeat(55))
  console.log(`完成! 成功: ${success}, 跳过: ${skip}, 失败: ${fail}`)

  // 生成 meta.json
  console.log('\n生成 meta.json...')
  const firstCardPath = path.join(outDir, '00-fool.jpg')
  const size = getJpegSize(firstCardPath)

  const meta = {
    id: localId,
    source: deckName,
  }

  if (size) {
    meta.width = size.width
    meta.height = size.height
    meta.aspectRatio = calcAspectRatio(size.width, size.height)
    console.log(`  尺寸: ${size.width} x ${size.height}`)
    console.log(`  宽高比: ${meta.aspectRatio}`)
  } else {
    console.log('  警告: 无法读取图片尺寸')
  }

  const metaPath = path.join(outDir, 'meta.json')
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
  console.log(`  已保存: ${metaPath}`)

  if (success > 0 || skip === 78) {
    console.log(`\n提示: 如需在应用中使用此牌组，请更新以下文件:`)
    console.log(`  1. src/data/index.ts - DECK_IDS 数组`)
    console.log(`  2. src/data/card-images.ts - IMAGE_DECK_IDS 数组`)
    console.log(`  3. src/i18n/locales/zh.json - decks.${localId}`)
    console.log(`  4. src/i18n/locales/en.json - decks.${localId}`)
  }
}

main().catch(console.error)
