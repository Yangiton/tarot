#!/usr/bin/env node
/**
 * 塔罗牌图片下载脚本
 *
 * 用法：
 *   pnpm dl:tarot <deck_id>
 *
 * 示例：
 *   pnpm dl:tarot 178    # 下载牌组 178
 *   pnpm dl:tarot 179    # 下载牌组 179
 *
 * URL 规则：{CDN_BASE}/{牌组号}/{英文名}.jpg
 * 本地路径：src/assets/tarot/{牌组号}/{序号}-{英文名}.jpg
 *
 * 排序规则（0-77）：
 * - 0-21: 大阿尔卡纳（Major Arcana）
 * - 22-35: 权杖（Wands）
 * - 36-49: 圣杯（Cups）
 * - 50-63: 宝剑（Swords）
 * - 64-77: 星币（Pentacles）
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============ 配置 ============

const CDN_BASE = "https://t.8s8s.com/photo/tarotphoto";

/**
 * 大阿尔卡纳英文名（0-21）
 * 注意特殊命名：10 是 fortune-wheel，17 是 stars
 */
const MAJOR_ARCANA = [
  "fool",            // 0 - 愚者
  "magician",        // 1 - 魔术师
  "high-priestess",  // 2 - 女祭司
  "empress",         // 3 - 女皇
  "emperor",         // 4 - 皇帝
  "hierophant",      // 5 - 教皇
  "lovers",          // 6 - 恋人
  "chariot",         // 7 - 战车
  "strength",        // 8 - 力量
  "hermit",          // 9 - 隐士
  "fortune-wheel",   // 10 - 命运之轮
  "justice",         // 11 - 正义
  "hanged-man",      // 12 - 倒吊人
  "death",           // 13 - 死神
  "temperance",      // 14 - 节制
  "devil",           // 15 - 恶魔
  "tower",           // 16 - 塔
  "stars",           // 17 - 星星
  "moon",            // 18 - 月亮
  "sun",             // 19 - 太阳
  "judgement",       // 20 - 审判
  "world",           // 21 - 世界
];

/** 小阿尔卡纳数字名（1=Ace, 11=Page, 12=Knight, 13=Queen, 14=King） */
const NUMBERS = ["", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];

/** 四种花色（按 22-77 排序） */
const SUITS = ["wands", "cups", "swords", "pentacles"];

// ============ 工具函数 ============

function getCardName(id) {
  if (id <= 21) return MAJOR_ARCANA[id];
  const minorId = id - 22;
  return `${NUMBERS[(minorId % 14) + 1]}-${SUITS[Math.floor(minorId / 14)]}`;
}

function getLocalFilename(id) {
  return `${String(id).padStart(2, "0")}-${getCardName(id)}.jpg`;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ============ 主函数 ============

async function main() {
  const args = process.argv.slice(2);
  const deckId = args.find((a) => /^\d+$/.test(a));

  if (!deckId || args.includes("-h") || args.includes("--help")) {
    console.log(`
塔罗牌图片下载脚本

用法: pnpm dl:tarot <deck_id>

参数:
  deck_id    牌组号（必填，如 178）

示例:
  pnpm dl:tarot 178    # 下载牌组 178
  pnpm dl:tarot 179    # 下载牌组 179

输出: src/assets/tarot/{牌组号}/
命名: {序号}-{英文名}.jpg
`);
    return;
  }

  const baseUrl = `${CDN_BASE}/${deckId}`;
  const outDir = path.resolve(__dirname, `../src/assets/tarot/${deckId}`);

  fs.mkdirSync(outDir, { recursive: true });

  console.log("=".repeat(50));
  console.log(`塔罗牌下载 | 牌组: ${deckId} | 共 78 张`);
  console.log(`输出: ${outDir}`);
  console.log("=".repeat(50));

  let success = 0, skip = 0, fail = 0;

  for (let id = 0; id < 78; id++) {
    const name = getCardName(id);
    const localFile = getLocalFilename(id);
    const localPath = path.join(outDir, localFile);
    const url = `${baseUrl}/${name}.jpg`;

    if (fs.existsSync(localPath)) {
      console.log(`[${id + 1}/78] 跳过: ${localFile}`);
      skip++;
      continue;
    }

    try {
      console.log(`[${id + 1}/78] 下载: ${name}.jpg -> ${localFile}`);
      await downloadFile(url, localPath);
      success++;
      await delay(150);
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      fail++;
    }
  }

  console.log("=".repeat(50));
  console.log(`完成! 成功: ${success}, 跳过: ${skip}, 失败: ${fail}`);
}

main().catch(console.error);
