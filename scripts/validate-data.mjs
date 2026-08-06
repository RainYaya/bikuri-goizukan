#!/usr/bin/env node
/**
 * validate-data.mjs —— 校验 src/data/series.json 与 src/data/words.json。
 *
 * 用法：npm run check:data
 *
 * 校验内容（与 docs/CONTENT-FORMAT.md 的 Schema 对应）：
 *   - 系：rows / cols 唯一 id、必填字段
 *   - 词：id 与 key 一致、status 枚举、按 status 的必填字段、
 *         cls 枚举 ①–⑤、stars 范围 1–5、row/col/series 引用存在性
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const series = read('src/data/series.json');
const words = read('src/data/words.json');
const CLS = ['①', '②', '③', '④', '⑤'];
const CLS_LABEL = '①②③④⑤';
const errors = [];
const warn = (msg) => console.log('  ⚠  ' + msg);
const err = (msg) => errors.push(msg);

/* ── 系 ─────────────────────────────────────────────── */
const rowIds = series.rows.map((r) => r.id);
const colIds = series.cols.map((c) => c.id);
const allSeriesIds = new Set([...rowIds, ...colIds, 'yugo', ...Object.keys(series.seriesNames || {})]);

function checkSeries(arr, kind) {
  const seen = new Set();
  arr.forEach((s, i) => {
    for (const f of ['id', 'name', 'proto', 'kan']) {
      if (s[f] == null || s[f] === '') err(`series.${kind}[${i}].${f} 缺失`);
    }
    if (seen.has(s.id)) err(`series.${kind} 出现重复 id：${s.id}`);
    seen.add(s.id);
  });
}
checkSeries(series.rows, 'rows');
checkSeries(series.cols, 'cols');

/* ── 词 ─────────────────────────────────────────────── */
const wordIds = Object.keys(words.words);
if (wordIds.length === 0) err('words.words 为空');

const requiredCollected = ['id', 'word', 'reading', 'status', 'row', 'col', 'series', 'no', 'seal', 'stars', 'cls', 'clsNote', 'genus', 'pos', 'tagline', 'core', 'eq', 'families', 'intersect', 'usages', 'note', 'noteZh'];
const requiredKnown = ['id', 'word', 'reading', 'status', 'gloss'];

for (const key of wordIds) {
  const w = words.words[key];
  if (w.id !== key) err(`词 ${key}：key 与 id 不一致（id=${w.id}）`);

  /* 通用必填 */
  for (const f of ['id', 'word', 'reading', 'status']) {
    if (w[f] == null || w[f] === '') err(`词 ${key}.${f} 缺失`);
  }
  if (!['collected', 'known'].includes(w.status)) err(`词 ${key}.status 非法：${w.status}（应为 collected | known）`);

  /* 按形态的必填 */
  /* 融合词（row/col 均 null，如 落ち着く）不受格子坐标约束，row/col 不强制 */
  const isFusion = w.status === 'collected' && w.row == null && w.col == null;
  const required = w.status === 'collected'
    ? requiredCollected.filter((f) => !(isFusion && (f === 'row' || f === 'col')))
    : requiredKnown;
  for (const f of required) {
    if (w[f] == null) err(`词 ${key}（${w.status}）缺少必填字段：${f}`);
  }

  /* cls 枚举 */
  if (w.cls != null && !CLS.includes(String(w.cls))) err(`词 ${key}.cls 非法：${w.cls}（应为 ${CLS_LABEL} 之一或省略）`);

  /* stars 范围 */
  if (w.stars != null && (!Number.isInteger(w.stars) || w.stars < 1 || w.stars > 5)) {
    err(`词 ${key}.stars 非法：${w.stars}（应为 1–5 的整数或 null）`);
  }

  /* row / col / series 引用存在性 */
  if (w.row && !rowIds.includes(w.row)) err(`词 ${key}.row 引用不存在的行：${w.row}`);
  if (w.col && !colIds.includes(w.col)) err(`词 ${key}.col 引用不存在的列：${w.col}`);
  if (w.series && !allSeriesIds.has(w.series)) err(`词 ${key}.series 引用不存在的系：${w.series}`);

  /* 融合词（row/col 为 null）只能出现在融合系 */
  if ((w.row == null) !== (w.col == null)) warn(`词 ${key}：row 与 col 应同时为 null 或同时有值`);

  /* collected 词细粒度校验 */
  if (w.status === 'collected') {
    if (w.stars == null) err(`词 ${key}：collected 词必须有 stars`);
    const eq = w.eq;
    for (const f of ['front', 'frontSrc', 'frontNote', 'back', 'backRole', 'backNote', 'result', 'resultNote']) {
      if (eq == null || eq[f] == null || eq[f] === '') err(`词 ${key}.eq.${f} 缺失`);
    }
    if (!Array.isArray(w.families)) err(`词 ${key}.families 应为数组`);
    else w.families.forEach((fam, fi) => {
      if (fam.title == null || fam.sub == null || !Array.isArray(fam.items)) {
        err(`词 ${key}.families[${fi}] 缺少 title/sub/items`);
      }
    });
    if (!w.usages || !Array.isArray(w.usages.biz) || !Array.isArray(w.usages.it)) {
      err(`词 ${key}.usages 应为 { biz: [...], it: [...] }`);
    }
  } else {
    /* known 词：如果给了 stars / cls，也要合法 */
    if (w.gloss == null || w.gloss === '') err(`词 ${key}：known 词必须有 gloss`);
  }
}

/* ── 汇总 ─────────────────────────────────────────────── */
if (errors.length) {
  console.error(`✗ 数据校验失败：${errors.length} 个错误`);
  errors.forEach((e) => console.error('  ✗ ' + e));
  process.exit(1);
}
console.log(`✓ 数据校验通过：${rowIds.length} 前項系 · ${colIds.length} 後項系 · ${wordIds.length} 词条（${Object.values(words.words).filter((w) => w.status === 'collected').length} 収蔵済）`);
