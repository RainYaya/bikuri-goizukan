/**
 * data.js —— 数据层纯函数。
 * 数据源（唯一真源）：
 *   src/data/series.json  → ROWS（前項系）· COLS（後項系）· SERIES_NAME
 *   src/data/words.json   → WORDS（词库，collected / known 两种形态）
 * 加新词 = 改 words.json；加新系 = 改 series.json。UI 全部由这里派生。
 */

import seriesData from '../data/series.json';
import wordData from '../data/words.json';
import volumesData from '../data/volumes.json';

export const ROWS = seriesData.rows;
export const COLS = seriesData.cols;
export const SERIES_NAME = seriesData.seriesNames;
export const WORDS = wordData.words;
/* 后项系按语义分卷 —— 点亮模式（lit）的分卷依据 */
export const VOLUMES = volumesData;

export function rowSeries(id) {
  for (let i = 0; i < ROWS.length; i++) if (ROWS[i].id === id) return ROWS[i];
  return null;
}
export function colSeries(id) {
  for (let i = 0; i < COLS.length; i++) if (COLS[i].id === id) return COLS[i];
  return null;
}

/* 格子：行 × 列 交点处的词（没有则 null） */
export function gridAt(rowId, colId) {
  for (const k in WORDS) {
    const w = WORDS[k];
    if (w.row === rowId && w.col === colId) return w;
  }
  return null;
}

export function wordsInRow(rowId) {
  const out = [];
  for (const k in WORDS) if (WORDS[k].row === rowId) out.push(WORDS[k]);
  return out;
}
export function wordsInCol(colId) {
  const out = [];
  for (const k in WORDS) if (WORDS[k].col === colId) out.push(WORDS[k]);
  return out;
}
export function wordsInSeries(id) {
  const out = [];
  for (const k in WORDS) if (WORDS[k].series === id) out.push(WORDS[k]);
  return out;
}

export function rowName(id) { const r = rowSeries(id); return r ? r.name : id; }
export function colName(id) { const c = colSeries(id); return c ? c.name : id; }

/* 系名：优先显式命名（SERIES_NAME），否则由行/列名派生 */
export function seriesName(id) {
  if (SERIES_NAME && SERIES_NAME[id]) return SERIES_NAME[id];
  const r = rowSeries(id); if (r) return r.name + '系';
  const c = colSeries(id); if (c) return c.name + '系';
  return id;
}

/* 系进度：{ collected, known, empty }（empty 为 null 表示融合系，无空槽概念） */
export function seriesCounts(kind, id) {
  if (kind === 'yugo') {
    return { collected: 0, known: wordsInSeries('yugo').length, empty: null };
  }
  const members = kind === 'row' ? wordsInRow(id) : wordsInCol(id);
  let collected = 0;
  members.forEach((w) => { if (w.status === 'collected') collected++; });
  const total = kind === 'row' ? COLS.length : ROWS.length;
  return { collected, known: members.length - collected, empty: total - members.length };
}

/* 系里出现最多的构词分类（用于系库卡片角标） */
export function seriesDominantCls(kind, id) {
  const members = kind === 'row' ? wordsInRow(id) : wordsInCol(id);
  const m = {};
  members.forEach((w) => { if (w.cls) m[w.cls] = (m[w.cls] || 0) + 1; });
  let best = null, bn = 0;
  for (const k in m) if (m[k] > bn) { bn = m[k]; best = k; }
  return best;
}

/* 词面 → id 查找表：近缘种面板里可点击钻取 */
export const BYNAME = {};
for (const k in WORDS) BYNAME[WORDS[k].word] = WORDS[k].id;

/* 点亮模式：卷内有词的系行（只保留有词的行，卷内交叉点照画 3 态，块内接近满） */
export function volRows(vol) {
  return ROWS.filter((r) => vol.cols.some((c) => gridAt(r.id, c)));
}
/* 卷内词数（该卷所有列的词条去重前计数；一格一词，故直接求和） */
export function wordsInVol(vol) {
  let n = 0;
  vol.cols.forEach((c) => { n += wordsInCol(c).length; });
  return n;
}

/* 图鉴统计（cover 顶部 chips） */
export function zukanStats() {
  let collected = 0, known = 0, inGrid = 0;
  for (const k in WORDS) {
    const w = WORDS[k];
    if (w.status === 'collected') collected++; else known++;
    if (w.row && w.col) inGrid++;
  }
  return {
    collected,
    known,
    empty: ROWS.length * COLS.length - inGrid,
    rows: ROWS.length,
    cols: COLS.length,
  };
}
