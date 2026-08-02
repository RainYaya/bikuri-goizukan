import { ROWS, COLS, wordsInRow, wordsInCol, wordsInSeries, seriesCounts, seriesName } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

/* 一架：架头（系名片）+ 架上词 chip */
function Shelf({ kind, axis }) {
  const { openSeries, openWord } = useNav();
  const members = kind === 'row' ? wordsInRow(axis.id) : wordsInCol(axis.id);
  const counts = seriesCounts(kind, axis.id);
  const total = counts.collected + counts.known;
  const pct = total ? Math.round(counts.collected / total * 100) : 0;
  return (
    <div className="shelf">
      <div className="shelf-head" onClick={() => openSeries(axis.id)} title="点系名看系総覧">
        <span className="sh-name" lang="ja">{seriesName(axis.id)}</span>
        <span className="sh-proto">原 〈{axis.proto}〉</span>
        <span className="sh-kan" lang="zh-CN">{axis.kan}</span>
        <span className="sh-bar"><i style={{ width: pct + '%' }}></i></span>
        <span className="sh-count">収蔵 <b>{counts.collected}</b> · {counts.known} 既知</span>
      </div>
      <div className="shelf-words">
        {members.map((w) => {
          const cls = w.status === 'collected' ? ' honshu' : ' plain';
          const dot = w.status === 'collected' ? <span className="fdot" title="収蔵済"></span> : null;
          const cn = w.status === 'collected' ? (w.eq ? w.eq.resultNote : w.gloss) : w.gloss;
          return (
            <span key={w.id} className={'fw-chip' + cls} data-word={w.id}
              title={w.word + ' · ' + (w.gloss || '')} onClick={() => openWord(w.id)}>
              <span className="fgw" lang="ja">{w.word}</span>
              <span className="fgg">{cn}</span>
              {dot}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Shelves() {
  const { openSeries } = useNav();
  const rowBins = ROWS.filter((r) => wordsInRow(r.id).length > 0)
    .sort((a, b) => wordsInRow(b.id).length - wordsInRow(a.id).length);
  const colBins = COLS.filter((c) => wordsInCol(c.id).length > 0)
    .sort((a, b) => wordsInCol(b.id).length - wordsInCol(a.id).length);
  const yugoMembers = wordsInSeries('yugo');
  const bare = ROWS.filter((r) => wordsInRow(r.id).length === 0)
    .concat(COLS.filter((c) => wordsInCol(c.id).length === 0));

  return (
    <>
      <section>
        <p className="eyebrow">収蔵棚 <span className="zh">主目录 —— 词按系分架</span></p>
        <h2 className="sec-title" lang="ja">系は棚、詞は標本</h2>
        <p className="sec-sub" lang="zh-CN">同一个词有两套归属，于是有两套架子：<b>前項棚</b>（词根家族 —— 一只「取り〜」的手）和 <b>後項棚</b>（语法骨架 —— 一个「〜込む」的门）。词多时棚只会变长，永远不会出现空白。架头是系名片，点它看系総覧；架上朱点 = 収蔵済，淡 chip = 既知。<b>棚表示 / 卡片表示</b> 两种摆法在右上角一键切换 —— 棚看词，卡片看系。</p>
      </section>

      <div className="shelf-bin">
        <p className="eyebrow">前項棚 <span className="zh">词根家族 —— 词的左半</span></p>
        <h2 className="sec-title" lang="ja">前項系 · {rowBins.length} 架</h2>
        <p className="sec-sub" lang="zh-CN">按「前项」归架：同根的词放一起，一眼看全一个家族。</p>
        {rowBins.map((r) => <Shelf key={r.id} kind="row" axis={r} />)}
      </div>

      <div className="shelf-bin">
        <p className="eyebrow">後項棚 <span className="zh">语法骨架 —— 词的右半</span></p>
        <h2 className="sec-title" lang="ja">後項系 · {colBins.length} 架</h2>
        <p className="sec-sub" lang="zh-CN">按「后项」归架：后项是有限的语法轴，词再多架子总数也封顶 —— 这是未来的主骨架。</p>
        {colBins.map((c) => <Shelf key={c.id} kind="col" axis={c} />)}
      </div>

      <div className="shelf-bin">
        <p className="eyebrow">融合・特殊棚 <span className="zh">不走格子的词</span></p>
        <h2 className="sec-title" lang="ja">融合系 ⑤</h2>
        <p className="sec-sub" lang="zh-CN">前项后项已长成一个整体，无法拆开 —— 词义整体记忆。</p>
        <div className="shelf">
          <div className="shelf-head" onClick={() => openSeries('yugo')} title="点系名看系総覧">
            <span className="sh-name" lang="ja">融合系</span>
            <span className="sh-proto">原 〈融合〉</span>
            <span className="sh-kan" lang="zh-CN">前后项已长成一个整体，词义必须整体记忆 —— 不能拆开解释。</span>
            <span className="sh-count">収蔵 <b>0</b> · {yugoMembers.length} 既知</span>
          </div>
          <div className="shelf-words">
            {yugoMembers.map((w) => (
              <span key={w.id} className="fw-chip plain" data-word={w.id}
                title={w.word + ' · ' + w.gloss + '（既知 · 标本卡予定）'}>
                <span className="fgw" lang="ja">{w.word}</span>
                <span className="fgg">{w.gloss}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {bare.length ? (
        <div className="shelf-bare">
          <span className="bare-label">未収蔵系 <small>—— 还没有词的系，不占架，点它预览空轴，等新词来开架</small></span>
          <span className="bare-chips">
            {bare.map((a) => (
              <span key={a.id} className="bare-chip" onClick={() => openSeries(a.id)} lang="ja">{a.name} · 原〈{a.proto}〉</span>
            ))}
          </span>
        </div>
      ) : null}
    </>
  );
}
