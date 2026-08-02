import { Fragment } from 'react';
import { ROWS, COLS, WORDS, gridAt, wordsInRow, wordsInCol } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

const CLS_FILTERS = [
  ['all', '全部'],
  ['①', '① 前項修飾'],
  ['②', '② 後項修飾'],
  ['③', '③ 前項接頭辞化'],
  ['④', '④ 後項接尾辞化'],
  ['⑤', '⑤ 融合'],
];

function Cell({ w, on, current, openWord }) {
  if (!w) return <div className="cell empty"></div>;
  /* 与原型一致：収蔵済 → filled（配 .seal-dot 朱点圆点），既知 → known */
  const stateCls = w.status === 'collected' ? 'filled' : 'known';
  const cls = 'cell ' + stateCls + (on ? ' on' : '') + (current ? ' current' : '');
  if (w.status === 'collected') {
    const plainTagline = (w.tagline || '').replace(/<[^>]+>/g, '');
    return (
      <button className={cls} data-word={w.id}
        title={w.word + ' — ' + w.reading + ' · ' + plainTagline}
        onClick={() => openWord(w.id)}>
        <span className="seal-dot"></span><span className="w">{w.word}</span>
      </button>
    );
  }
  return (
    <button className={cls} data-word={w.id}
      title={w.word + ' — ' + w.reading + ' · ' + w.gloss + '（既知）'}
      onClick={() => openWord(w.id)}>
      <span className="w">{w.word}</span>
    </button>
  );
}

export default function GridMap() {
  const { state, openWord, setCls } = useNav();
  const cls = state.cls;
  const dim = cls !== 'all';
  const cur = state.word ? WORDS[state.word] : null;

  return (
    <section id="grid-map">
      <div className="map-head">
        <div className="grow">
          <p className="eyebrow">系列分布図 <span className="zh">组合地图</span></p>
          <h2 className="sec-title" lang="ja">前項 × 後項 —— 組み合わせ地図</h2>
          <p className="sec-sub" lang="zh-CN">一格 = 一个词。点「实格（収蔵済）」直接看标本卡，点「淡格（已认识）」看未収蔵占位，空槽暗格留待未来新词。加新词 = 在地图点亮一格。</p>
        </div>
        <div className="filters" aria-label="构词分类过滤">
          <span className="flabel">構詞分類</span>
          {CLS_FILTERS.map(([id, label]) => (
            <button key={id} className={'fbtn' + (cls === id ? ' on' : '')} data-cls={id} onClick={() => setCls(id)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="matrix-scroll">
        <div className={'matrix' + (dim ? ' dim' : '')} id="matrix" style={{ '--mcols': COLS.length }}>
          <div className="mcorner" lang="ja">前項 ＼ 後項</div>
          {COLS.map((c) => {
            const has = wordsInCol(c.id).some((w) => !dim || w.cls === cls);
            const hl = cur && cur.col === c.id;
            return (
              <div key={'c-' + c.id} className={'mcol' + (has ? ' on' : '') + (hl ? ' hl' : '')} data-col={c.id}>{c.name}</div>
            );
          })}
          {ROWS.map((r) => {
            const has = wordsInRow(r.id).some((w) => !dim || w.cls === cls);
            const hl = cur && cur.row === r.id;
            return (
              <Fragment key={'r-' + r.id}>
                <div className={'mrow' + (has ? ' on' : '') + (hl ? ' hl' : '')} data-row={r.id}>{r.name}</div>
                {COLS.map((c) => {
                  const w = gridAt(r.id, c.id);
                  const on = !!(w && dim && w.cls === cls);
                  const current = !!(w && cur && w.id === cur.id);
                  return <Cell key={'g-' + c.id} w={w} on={on} current={current} openWord={openWord} />;
                })}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="yugo-band">
        <span className="ylabel">融合帯 ⑤</span>
        <span className="ynote">前后项已融合成一个整体，不能再拆 ——</span>
        <span className="yword" data-word="ochitsuku" onClick={() => openWord('ochitsuku')}>落ち着く</span>
        <span className="ynote">（既知 · 标本卡予定）</span>
      </div>

      <div className="legend-row">
        <span className="lg-item"><span className="lg-swatch filled"></span>収蔵済 —— 有标本卡，点格查看</span>
        <span className="lg-item"><span className="lg-swatch known"></span>既知 —— 认识，标本卡待制作</span>
        <span className="lg-item"><span className="lg-swatch empty"></span>未遇见 —— 空槽暗格，等你点亮</span>
        <span className="lg-item">分类过滤：按构词类型 ①–⑤ 只点亮对应格子</span>
      </div>
    </section>
  );
}
