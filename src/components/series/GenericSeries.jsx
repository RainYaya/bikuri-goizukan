import { rowSeries, colSeries, seriesName, wordsInRow, wordsInCol, ROWS, COLS, colName, rowName } from '../../lib/data.js';
import { useNav } from '../../lib/nav.jsx';
import SeriesHead from '../SeriesHead.jsx';

/**
 * GenericSeries —— 没有定制页的系的通用总览（自动生成）。
 * 新系只需在 src/data/series.json 加一行，这里就会自动给出：系名片 + 小地图 + 成员墙 + 空槽统计。
 * kind: 'row' | 'col'
 */
export default function GenericSeries({ kind, id }) {
  const { openWord } = useNav();
  const axis = kind === 'row' ? rowSeries(id) : colSeries(id);
  const members = kind === 'row' ? wordsInRow(id) : wordsInCol(id);
  const crossList = kind === 'row' ? COLS : ROWS;
  const crossName = kind === 'row' ? '後項' : '前項';
  const coord = kind === 'row' ? colName : rowName;

  const crossNote = members.length ? (
    <p className="intersect" lang="zh-CN">
      <b>交叉点：</b>本系目前点亮 <b>{members.length}</b> 个坐标，全部列在这里 ——{' '}
      {kind === 'row'
        ? `每个词都是「${axis.name}」与对应后項系的交点。`
        : `每个词都是「${axis.name}」与对应前項系的交点。`}
    </p>
  ) : null;

  return (
    <>
      <SeriesHead kind={kind} id={id} />

      <section>
        <p className="eyebrow">詞目一覧 <span className="zh">成员墙 —— 点击看词卡</span></p>
        <h2 className="sec-title" lang="ja">{seriesName(id)} · {members.length} 語</h2>
        {members.length ? (
          <div className="chip-row">
            {members.map((w) => (
              <span key={w.id} className={'fw-chip' + (w.status === 'collected' ? ' honshu' : '')}
                data-word={w.id} onClick={() => openWord(w.id)}>
                <span className="fgw" lang="ja">{w.word}</span>
                <span className="fgg">{coord(w.col || w.row)} · {w.cls}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="sec-sub">本系还没有成员词 —— 遇到第一个「{axis.name}」词就点亮这里。</p>
        )}
      </section>

      <section>
        <p className="eyebrow">空槽 <span className="zh">等待新词</span></p>
        {crossNote}
        <p className="sec-sub" lang="zh-CN">
          本系（{axis.name}）共 {crossList.length} 个 {crossName} 坐标，已点亮 {members.length}，还有{' '}
          <b>{crossList.length - members.length} 个空槽</b>。学到新词 → 回総索引格子图对应坐标点亮一格。
        </p>
      </section>
    </>
  );
}
