#!/usr/bin/env node
/**
 * extract-design.mjs
 * ─────────────────────────────────────────────────────────────
 * 从 design/zukan.html（Open Design 导出的单文件设计真源）抽取三样东西：
 *   1. <style> 块              → src/styles.css
 *   2. ROWS / COLS / SERIES_NAME → src/data/series.json
 *   3. WORDS                  → src/data/words.json
 *
 * 用法：node scripts/extract-design.mjs
 * 用途：设计源更新后，跑一次即可重新同步样式与数据（词条内容以 design 为准）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcHtml = path.join(root, 'design', 'zukan.html');
const html = fs.readFileSync(srcHtml, 'utf8');

if (!fs.existsSync(srcHtml)) {
  console.error('缺少 design/zukan.html —— 请先把它拷进 design/ 目录。');
  process.exit(1);
}

/* ── 1. 样式 ─────────────────────────────────────────────── */
const styleOpen = html.indexOf('<style>');
const styleClose = html.indexOf('</style>');
if (styleOpen < 0 || styleClose < 0) {
  console.error('未找到 <style> 块，无法抽取样式。');
  process.exit(1);
}
const css = html.slice(styleOpen + '<style>'.length, styleClose);
fs.writeFileSync(path.join(root, 'src', 'styles.css'), css.trim() + '\n');
console.log(`✓ src/styles.css   (${css.trim().split('\n').length} 行)`);

/* ── 2. 数据（ROWS / COLS / SERIES_NAME / WORDS） ─────────── */
const dataStart = html.indexOf('var ROWS = [');
const dataEnd = html.indexOf('var state = {');
if (dataStart < 0 || dataEnd < 0 || dataEnd <= dataStart) {
  console.error('未找到数据段（var ROWS = [ … var state = {），无法抽取。');
  process.exit(1);
}
const code = html.slice(dataStart, dataEnd).trim();

let data;
try {
  // eslint-disable-next-line no-new-func
  const fn = new Function(code + '\n;return { ROWS, COLS, SERIES_NAME, WORDS };');
  data = fn();
} catch (err) {
  console.error('数据段解析失败：', err.message);
  process.exit(1);
}

const series = { rows: data.ROWS, cols: data.COLS, seriesNames: data.SERIES_NAME };
const words = { words: data.WORDS };

fs.writeFileSync(path.join(root, 'src', 'data', 'series.json'), JSON.stringify(series, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'src', 'data', 'words.json'), JSON.stringify(words, null, 2) + '\n');

const count = Object.keys(data.WORDS).length;
const collected = Object.values(data.WORDS).filter((w) => w.status === 'collected').length;
console.log(`✓ src/data/series.json (前項 ${data.ROWS.length} · 後項 ${data.COLS.length})`);
console.log(`✓ src/data/words.json   (词条 ${count} · 其中収蔵済 ${collected})`);
