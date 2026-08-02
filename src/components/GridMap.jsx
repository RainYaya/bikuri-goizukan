import { useState } from 'react';
import { ROWS, COLS, WORDS, VOLUMES, gridAt, wordsInRow, wordsInCol, volRows, wordsInVol, colName } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

const CLS_FILTERS = [
  ['all', '全部'],
  ['①', '① 前項修飾'],
  ['②', '② 後項修飾'],
  ['③', '③ 前項接頭辞化'],
  ['④', '④ 後項接尾辞化'],
  ['⑤', '⑤ 融合'],
];
const MODE_FILTERS = [
  ['lit', '点亮模式'],
  ['full', '全図点阵'],
];

/* 单格：収蔵済 → filled（朱点），既知 → known，长词 ≥5 字缩字号 */
function Cell({ w, on, current, onClick }) {
  if (!w) return <div className="cell empty"></div>;
  const stateCls = w.status === 'collected' ? 'filled' : 'known';
  const lg = w.word.length >= 5 ? ' lg' : '';
  const cls = 'cell ' + stateCls + lg + (on ? ' on' : '') + (current ? ' current' : '');
  const tip = w.status === 'collected'
    ? w.word + ' — ' + w.reading + ' · ' + String(w.tagline || '').replace(/<[^>]+>/g, '')
    : w.word + ' — ' + w.reading + ' · ' + w.gloss + '（既知）';
  return (
    <button className={cls} data-word={w.id} title={tip} onClick={onClick}>
      {w.status === 'collected' ? <span className="seal-dot"></span> : null}
      <span className="w">{w.word}</span>
    </button>
  );
}

export default function GridMap() {
  const { state, openWord, setCls, setMode } = useNav();
  const cls = state.cls;
  const dim = cls !== 'all';
  const cur = state.word ? WORDS[state.word] : null;
  const lit = state.mode === 'lit';

  /* 卷页式（点亮模式）：一次一页 + 卷导航翻页；图例可折叠 */
  const [volIdx, setVolIdx] = useState(0);
  const [dir, setDir] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const litVols = VOLUMES.filter((v) => volRows(v).length > 0);
  const pageVol = litVols[volIdx] || litVols[0];

  const goVol = (n) => {
    if (n < 0 || n >= litVols.length || n === volIdx) return;
    setDir(n < volIdx ? 'prev' : 'next');
    setVolIdx(n);
  };

  const cellOn = (w) => !!(w && dim && w.cls === cls);
  const cellCur = (w) => !!(w && cur && w.id === cur.id);

  /* 未収蔵系：没有词的系不占地图，降级为细条带 */
  const bare = ROWS.filter((r) => wordsInRow(r.id).length === 0)
    .concat(COLS.filter((c) => wordsInCol(c.id).length === 0));

  return (
    <section id="grid-map">
      <div className="map-head">
        <div className="grow">
          <p className="eyebrow">系列分布図 <span className="zh">组合地图</span></p>
          <h2 className="sec-title" lang="ja">前項 × 後項 —— 組み合わせ地図</h2>
          <p className="sec-sub" lang="zh-CN">一格 = 一个词。点亮模式按语义分巻、一次一页；点实格看标本卡，淡格看占位，暗格留待新词 —— 加新词 = 点亮一格。</p>
        </div>
        <div className="filters" aria-label="构词分类过滤">
          <span className="flabel">構詞分類</span>
          {CLS_FILTERS.map(([id, label]) => (
            <button key={id} className={'fbtn' + (cls === id ? ' on' : '')} data-cls={id} onClick={() => setCls(id)}>{label}</button>
          ))}
        </div>
        <div className="filters" aria-label="地图显示模式">
          <span className="flabel">表示模式</span>
          {MODE_FILTERS.map(([id, label]) => (
            <button key={id} className={'fbtn' + (state.mode === id ? ' on' : '')} data-mode={id} onClick={() => setMode(id)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="matrix-scroll">
        {lit ? (
          <div className="matrix lit" id="matrix">
            {litVols.length ? (
              <>
                <div className="vol-nav" data-tour="vol-nav">
                  <button className="vol-nav-arrow" aria-label="上一卷" disabled={volIdx === 0} onClick={() => goVol(volIdx - 1)}>←</button>
                  <div className="vol-tabs">
                    {litVols.map((v, i) => (
                      <button key={v.id} className={'vol-tab' + (i === volIdx ? ' is-on' : '')} title={v.kan} onClick={() => goVol(i)}>
                        <span lang="ja">{v.no} {v.name}</span>
                        <span className="vt-count">{wordsInVol(v)}</span>
                      </button>
                    ))}
                  </div>
                  <button className="vol-nav-arrow" aria-label="下一卷" disabled={volIdx === litVols.length - 1} onClick={() => goVol(volIdx + 1)}>→</button>
                </div>
                <div className={'vol-page' + (dir === 'prev' ? ' prev' : '')} key={volIdx} onAnimationEnd={() => setDir(null)}>
                  <div className="vol-head">
                    <span className="vol-no">第{pageVol.no}巻</span>
                    <span className="vol-name" lang="ja">{pageVol.name}</span>
                    <span className="vol-kan" lang="zh-CN">{pageVol.kan}</span>
                    <span className="vol-count">{wordsInVol(pageVol)} 語 · {volIdx + 1} / {litVols.length}</span>
                  </div>
                  <div className="vol-grid" style={{ '--vc': pageVol.cols.length }}>
                    <div className="mcorner" lang="ja">前項 ＼ 後項</div>
                    {pageVol.cols.map((c) => (
                      <div key={'c-' + c} className={'mcol' + (cur && cur.col === c ? ' hl' : '')} data-col={c} title={colName(c)}>{colName(c)}</div>
                    ))}
                    {volRows(pageVol).map((r) => (
                      <FragmentRow key={r.id} r={r} vol={pageVol} active={!!(cur && pageVol.cols.includes(cur.col))} cur={cur} cellOn={cellOn} cellCur={cellCur} onWord={openWord} dim={dim} cls={cls} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="sec-sub">还没有词 —— 收到第一个词后这里点亮第一卷。</p>
            )}
          </div>
        ) : (
          <div className="matrix full" id="matrix" style={{ '--mcols': COLS.length }}>
            <div className="mcorner" lang="ja">前項 ＼ 後項</div>
            {COLS.map((c) => {
              const has = wordsInCol(c.id).some((w) => !dim || w.cls === cls);
              const hl = cur && cur.col === c.id;
              return <div key={'c-' + c.id} className={'mcol' + (has ? ' on' : '') + (hl ? ' hl' : '')} data-col={c.id}>{c.name}</div>;
            })}
            {ROWS.map((r) => {
              const has = wordsInRow(r.id).some((w) => !dim || w.cls === cls);
              const hl = cur && cur.row === r.id;
              return (
                <FragmentRowFull key={r.id} r={r} has={has} hl={hl} cellOn={cellOn} cellCur={cellCur} onWord={openWord} />
              );
            })}
          </div>
        )}
      </div>

      {bare.length ? (
        <div className="bare-band" id="bare-band">
          <span className="bare-label">未収蔵系 <small>—— 还没有词的系，不占地图，等新词来升格</small></span>
          <span className="bare-chips">
            {bare.map((a) => <span key={a.id} className="bare-chip" lang="ja">{a.name} · 原〈{a.proto}〉</span>)}
          </span>
        </div>
      ) : null}

      <div className="yugo-band">
        <span className="ylabel">融合帯 ⑤</span>
        <span className="ynote">前后项已融合成一个整体，不能再拆 ——</span>
        <span className="yword" data-word="ochitsuku" onClick={() => openWord('ochitsuku')}>落ち着く</span>
        <span className="ynote">（既知 · 标本卡予定）</span>
      </div>

      <button className="legend-toggle" aria-expanded={legendOpen} aria-controls="legend-row" onClick={() => setLegendOpen((o) => !o)}>
        <span className="lg-toggle-label">凡例</span>
        <span className="lg-toggle-caret">{legendOpen ? '▾' : '▸'}</span>
      </button>
      <div className="legend-row" id="legend-row" hidden={!legendOpen}>
        <span className="lg-item"><span className="lg-swatch filled"></span>朱点实格 —— 収蔵済 · 有标本卡，点格查看</span>
        <span className="lg-item"><span className="lg-swatch known"></span>淡格 —— 既知 · 认识，标本卡待制作</span>
        <span className="lg-item"><span className="lg-swatch empty"></span>暗格 —— 未遇见 · 空槽等你点亮</span>
      </div>
    </section>
  );
}

/* 点亮模式：一行（mrow + 卷内各列格） */
function FragmentRow({ r, vol, active, cur, cellOn, cellCur, onWord, dim, cls }) {
  const has = wordsInRow(r.id).some((w) => !dim || w.cls === cls);
  const hl = active && cur.row === r.id;
  return (
    <>
      <div className={'mrow' + (has ? ' on' : '') + (hl ? ' hl' : '')} data-row={r.id}>{r.name}</div>
      {vol.cols.map((c) => {
        const w = gridAt(r.id, c);
        return <Cell key={'g-' + c} w={w} on={cellOn(w)} current={cellCur(w)} onClick={w ? () => onWord(w.id) : undefined} />;
      })}
    </>
  );
}

/* 全図点阵：一行（mrow + 全列格） */
function FragmentRowFull({ r, has, hl, cellOn, cellCur, onWord }) {
  return (
    <>
      <div className={'mrow' + (has ? ' on' : '') + (hl ? ' hl' : '')} data-row={r.id}>{r.name}</div>
      {COLS.map((c) => {
        const w = gridAt(r.id, c.id);
        return <Cell key={'g-' + c.id} w={w} on={cellOn(w)} current={cellCur(w)} onClick={w ? () => onWord(w.id) : undefined} />;
      })}
    </>
  );
}
