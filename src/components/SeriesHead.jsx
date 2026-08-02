import { rowSeries, colSeries, seriesName, seriesCounts } from '../lib/data.js';
import Minimap from './Minimap.jsx';

/**
 * SeriesHead —— 系名片（印章 + 名称 + 语感 + 収蔵进度）+ 系内小地图。
 * kind: 'row' | 'col' | 'yugo'
 */
export default function SeriesHead({ kind, id }) {
  const axis = kind === 'row' ? rowSeries(id) : (kind === 'col' ? colSeries(id) : null);
  const name = seriesName(id);
  const proto = axis ? axis.proto : '融合';
  const kan = axis ? axis.kan : '前后项已长成一个整体，词义必须整体记忆。';
  const seal = kind === 'yugo' ? '融' : proto.charAt(0);
  const counts = seriesCounts(kind, id);

  return (
    <>
      <div className="series-head">
        <div className="seal" aria-label={'系印：' + seal}>{seal}</div>
        <div className="sh-main">
          <p className="eyebrow sh-eyebrow">系名片 <span className="zh">线 · 家族图景</span></p>
          <h2 className="sec-title" lang="ja">{name}</h2>
          <p className="sh-kan" lang="zh-CN"><b>原型</b> 〈<span lang="ja">{proto}</span>〉 · <span lang="zh-CN">{kan}</span></p>
        </div>
        <div className="sh-stats">
          <div className="sh-stat collect"><b>{counts.collected}</b><span>収蔵済</span></div>
          <div className="sh-stat"><b>{counts.known}</b><span>既知</span></div>
          {counts.empty != null && <div className="sh-stat"><b>{counts.empty}</b><span>空槽</span></div>}
        </div>
      </div>
      <Minimap kind={kind} id={id} />
    </>
  );
}
