#!/usr/bin/env node
/**
 * merge-words.mjs —— 把 tmp/part-*.json 里的词条合并进 src/data/words.json。
 *
 * 用法：node scripts/merge-words.mjs
 * 用途：子 Agent 并行生成的数据先落到 tmp/part-*.json，合并后再跑 npm run check:data。
 * 安全：遇到重复 id 会报错中止，不会覆盖已有词条。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const wordsPath = path.join(root, 'src', 'data', 'words.json');
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

const tmpDir = path.join(root, 'tmp');
const parts = fs.existsSync(tmpDir)
  ? fs.readdirSync(tmpDir).filter((f) => /^part-[A-Z]\.json$/.test(f)).sort()
  : [];

if (!parts.length) {
  console.error('tmp/ 下没有 part-*.json —— 先等子 Agent 写完再合并。');
  process.exit(1);
}

let added = 0;
const conflicts = [];
for (const f of parts) {
  const data = JSON.parse(fs.readFileSync(path.join(tmpDir, f), 'utf8'));
  for (const [id, entry] of Object.entries(data || {})) {
    if (words.words[id]) { conflicts.push(`${id}（来自 ${f}）`); continue; }
    if (entry.id !== id) { conflicts.push(`${id}（key 与 id 不一致）`); continue; }
    words.words[id] = entry;
    added++;
  }
}

if (conflicts.length) {
  console.error(`✗ 合并中止：${conflicts.length} 个冲突 —— ${conflicts.join('、')}`);
  process.exit(1);
}

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2) + '\n');
const collected = Object.values(words.words).filter((w) => w.status === 'collected').length;
console.log(`✓ 合并完成：${parts.join(' + ')} → 新增 ${added} 词，总计 ${Object.keys(words.words).length} 词（収蔵済 ${collected}）`);
