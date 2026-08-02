#!/usr/bin/env node
/**
 * merge-collected.mjs —— 把 tmp/collected/part-*.json 的完整标本卡合并进 src/data/words.json。
 *
 * 用法：node scripts/merge-collected.mjs
 * 作用：把「既知 known」词升级为「収蔵済 collected」；统一编号 no（已有 01-04 不动，新卡按序 05+）。
 * 安全：只处理 part 文件里出现的 id；遇到 status 非 known 的目标会警告跳过。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const wordsPath = path.join(root, 'src', 'data', 'words.json');
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

const partsDir = path.join(root, 'tmp', 'collected');
const parts = fs.existsSync(partsDir)
  ? fs.readdirSync(partsDir).filter((f) => /^part-\d+\.json$/.test(f)).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
  : [];

if (!parts.length) {
  console.error('tmp/collected/ 下没有 part-*.json —— 先等 Agent 写完。');
  process.exit(1);
}

let upgraded = 0;
const warnings = [];
for (const f of parts) {
  const data = JSON.parse(fs.readFileSync(path.join(partsDir, f), 'utf8'));
  for (const [id, entry] of Object.entries(data || {})) {
    if (!words.words[id]) { warnings.push(`${id}（来自 ${f}）：words.json 中不存在`); continue; }
    if (words.words[id].status !== 'known') { warnings.push(`${id}（来自 ${f}）：当前不是 known（${words.words[id].status}），跳过`); continue; }
    if (entry.status !== 'collected') { warnings.push(`${id}（来自 ${f}）：status 非 collected，跳过`); continue; }
    words.words[id] = entry;
    upgraded++;
  }
}

/* 统一编号：按插入顺序（原 4 卡在前，新卡在后）01..N */
let no = 0;
for (const k in words.words) {
  const w = words.words[k];
  if (w.status === 'collected') {
    no++;
    w.no = String(no).padStart(2, '0');
  }
}

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2) + '\n');
const collected = Object.values(words.words).filter((w) => w.status === 'collected').length;
console.log(`✓ 合并完成：升级 ${upgraded} 词 → 収蔵済 ${collected} 词，总计 ${Object.keys(words.words).length} 词`);
if (warnings.length) {
  console.warn(`⚠ ${warnings.length} 条警告：`);
  warnings.forEach((w) => console.warn('  - ' + w));
}
