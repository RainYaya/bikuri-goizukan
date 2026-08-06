import { rowSeries, colSeries } from '../lib/data.js';
import seriesContent from '../data/series-content.json';
import Home from './Home.jsx';
import SeriesHead from './SeriesHead.jsx';
import { Sections } from './series/Sections.jsx';

/**
 * SeriesView —— 系总览（数据驱动）。
 * 每个系 = series-head（来自 series.json）+ 有序内容区块（来自 series-content.json）。
 * 没有配置内容的系（含任何新系）自动回退到 [成员墙, 空槽统计] 两个默认区块。
 */
function kindFor(id) {
  if (id === 'yugo') return 'yugo';
  if (rowSeries(id)) return 'row';
  if (colSeries(id)) return 'col';
  return null;
}

export default function SeriesView({ id }) {
  const kind = kindFor(id);
  if (!kind) return <Home />;

  const sections = seriesContent[id] ? [...seriesContent[id]] : [
    { type: 'memberwall', eyebrow: '詞目一覧', eyebrowZh: '成员墙 —— 点击看词卡', kind, id },
    { type: 'empty-slots', kind, id },
  ];
  /* 构词规律：任何有词的系都自动给一个（公式行自动从成员词派生，最多 3 条）；
     内容里已配过 patterns 的用策展版本（title/note/tags），否则用默认标题 */
  if (!sections.some((s) => s.type === 'patterns')) {
    const idx = sections.findIndex((s) => s.type === 'insight');
    if (idx >= 0) sections.splice(idx + 1, 0, { type: 'patterns' });
    else sections.unshift({ type: 'patterns' });
  }

  return (
    <>
      <SeriesHead kind={kind} id={id} />
      <Sections list={sections} kind={kind} id={id} />
    </>
  );
}
