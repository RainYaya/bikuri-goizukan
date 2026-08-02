import { rowName, colName, seriesName } from '../lib/data.js';
import Stars from './Stars.jsx';

/**
 * PendingCard —— 既知（known）未収蔵占位卡。
 * w 来自 words.json 的 known 词条：字段精简（gloss / cat / note）。
 */
export default function PendingCard({ w }) {
  const where = (w.row && w.col)
    ? <span>座標 <b lang="ja">{rowName(w.row)} × {colName(w.col)}</b></span>
    : <span>座標 <b lang="ja">融合帯 ⑤</b></span>;
  const ser = w.series ? seriesName(w.series) : '待归档';
  return (
    <article className="pending">
      <div className="label-bar">
        <span><b>標本 未収蔵</b></span><span className="sep">·</span>
        <span>状態 <b>既知</b> —— 认识，标本卡待制作</span>
      </div>

      <div className="pending-main">
        <div className="seal-hollow" aria-label="未収蔵之印">未</div>
        <div className="lemma">
          <h2 className="word" lang="ja">{w.word}</h2>
          <p className="reading" lang="ja">{w.reading}</p>
          <p className="p-gloss" lang="zh-CN">{w.gloss}</p>
          <p className="p-where" lang="zh-CN">{where} · 归入 <b>{ser}</b> · {w.cat}</p>
        </div>
        <div className="meta-col">
          {w.stars != null && (
            <div className="meta-cell"><p className="mlabel">可導出性</p><Stars value={w.stars} label="可导出性 " /></div>
          )}
          <div className="meta-cell">
            <p className="mlabel">構詞分類</p>
            <span className="type-badge" lang="ja">分類 {w.cls}</span>
          </div>
        </div>
      </div>

      <div className="pending-foot">
        <span className="pf-label">備忘録</span>
        <span className="pf-tag">{w.note}</span>
        <span className="pf-hint">补上 语源解剖 / 近缘种 / 用例 后，即可转正为标本卡</span>
      </div>
    </article>
  );
}
