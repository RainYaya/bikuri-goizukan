import { wordsInRow, wordsInCol, colName, rowName } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

/**
 * MemberWall —— 成员墙：一个系下所有词卡的横向列表（由调用方包在 .wgrid 里）。
 * kind: 'row' | 'col'
 */
export default function MemberWall({ kind, id }) {
  const { openWord } = useNav();
  const members = kind === 'row' ? wordsInRow(id) : wordsInCol(id);
  return (
    <>
      {members.map((w) => {
        const badge = w.status === 'collected'
          ? <span className="wc-cat cat-biz">収蔵済</span>
          : <span className="wc-cat cat-it">既知</span>;
        const stars = w.stars != null
          ? <span className="wc-stars">{'★★★★★'.slice(0, w.stars)}<span className="off">{'☆☆☆☆☆'.slice(0, 5 - w.stars)}</span></span>
          : <span className="wc-stars muted">—</span>;
        const coord = kind === 'row' ? colName(w.col) : rowName(w.row);
        return (
          <div key={w.id} className={'wcard' + (w.status === 'collected' ? ' honshu' : '')}
            data-word={w.id} onClick={() => openWord(w.id)}>
            <div className="wc-top"><span className="wc-jp" lang="ja">{w.word}</span>{badge}</div>
            <span className="wc-cn" lang="zh-CN">{w.gloss || ''}</span>
            <div className="wc-foot">{stars}<span className="wc-type">{w.cls} · {coord}</span></div>
            {w.note ? <p className="mcard-coord" lang="zh-CN">{w.note}</p> : null}
          </div>
        );
      })}
    </>
  );
}
