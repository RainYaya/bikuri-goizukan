import { ROWS, COLS, seriesName, seriesCounts, seriesDominantCls } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

/* 系库卡片（前項系 / 后项系 / 融合系三仓共用） */
function Scard({ kind, axis }) {
  const { openSeries } = useNav();
  const id = kind === 'yugo' ? 'yugo' : axis.id;
  const name = seriesName(id);
  const counts = seriesCounts(kind, id);
  const total = counts.empty == null ? counts.collected + counts.known : counts.collected + counts.known + counts.empty;
  const pct = total ? Math.round(counts.collected / total * 100) : 0;
  const proto = kind === 'yugo' ? '融合' : axis.proto;
  const kan = kind === 'yugo' ? '前后项已长成一个整体，词义必须整体记忆 —— 不能拆开解释。' : axis.kan;

  let badge;
  if (kind === 'yugo') badge = <span className="sc-badge rich">⑤ 融合</span>;
  else if (axis.rich) badge = <span className="sc-badge rich">総覧</span>;
  else { const cl = seriesDominantCls(kind, id); badge = <span className="sc-badge">{cl || '—'}</span>; }

  const countTxt = counts.empty == null
    ? <span>収蔵 <b>{counts.collected}</b> · 既知 {counts.known}</span>
    : <span>収蔵 <b>{counts.collected}</b> · 既知 {counts.known} · 空 {counts.empty}</span>;

  return (
    <button className="scard" onClick={() => openSeries(id)}>
      <span className="sc-top"><span className="sc-name" lang="ja">{name}</span><span className="sc-proto">原 〈{proto}〉</span></span>
      <span className="sc-kan" lang="zh-CN">{kan}</span>
      <span className="sc-bar"><i style={{ width: pct + '%' }}></i></span>
      <span className="sc-foot"><span className="sc-counts">{countTxt}</span>{badge}</span>
    </button>
  );
}

export default function SeriesLib() {
  return (
    <>
      <section>
        <p className="eyebrow">系別図鑑 <span className="zh">线的领域</span></p>
        <h2 className="sec-title" lang="ja">系は「線」、詞は「点」</h2>
        <p className="sec-sub" lang="zh-CN">系是线、词是点：総索引的格子图是「看词」，系别是「看线」——一整行（前项系）或一整列（后项系）的家族全景。点开任一系：看它的原型、语感、収蔵进度、成员墙和系内小地图。小地图里的朱点实格 = 已収蔵，淡格 = 既知，暗格 = 空槽。</p>
      </section>

      <div className="slib-bin">
        <p className="eyebrow">前項系 <span className="zh">词的左半 —— 行</span></p>
        <div className="scard-grid">{ROWS.map((r) => <Scard key={r.id} kind="row" axis={r} />)}</div>
      </div>

      <div className="slib-bin">
        <p className="eyebrow">後項系 <span className="zh">词的右半 —— 列</span></p>
        <div className="scard-grid">{COLS.map((c) => <Scard key={c.id} kind="col" axis={c} />)}</div>
      </div>

      <div className="slib-bin">
        <p className="eyebrow">融合・特殊 <span className="zh">不走格子的词</span></p>
        <div className="scard-grid yugo-grid"><Scard kind="yugo" axis={null} /></div>
      </div>
    </>
  );
}
