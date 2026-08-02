import { COLS, ROWS, gridAt } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';

/**
 * Minimap —— 系内小地图。
 * 一维条带：行系 → 本行 × 各后项列；列系 → 本列 × 各前项行。
 * 实格 = 已収蔵（朱点）、淡格 = 既知、暗格 = 空槽。
 */
export default function Minimap({ kind, id }) {
  if (kind === 'yugo') return null;
  const { openWord } = useNav();
  const list = kind === 'row' ? COLS : ROWS;
  const label = kind === 'row' ? '· 本系 × 各後項系' : '· 本系 × 各前項系';
  return (
    <div className="minimap-wrap">
      <p className="mm-label">系内小地図 <span style={{ fontWeight: 400, color: 'var(--muted)' }}>{label}</span></p>
      <div className="minimap">
        {list.map((a) => {
          const w = kind === 'row' ? gridAt(id, a.id) : gridAt(a.id, id);
          if (w) {
            const cls = w.status === 'collected' ? 'filled' : 'known';
            const dot = w.status === 'collected' ? <span className="seal-dot"></span> : null;
            return (
              <button key={a.id} className={'mcell ' + cls} title={w.word} onClick={() => openWord(w.id)}>
                <span className="mw" lang="ja">{w.word}</span>
                <span className="mc" lang="ja">{a.name}</span>
                {dot}
              </button>
            );
          }
          return (
            <div key={a.id} className="mcell empty">
              <span className="mw">？</span><span className="mc" lang="ja">{a.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
