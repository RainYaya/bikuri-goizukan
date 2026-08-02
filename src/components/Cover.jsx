import { WORDS, ROWS, COLS, VOLUMES, wordsInRow, wordsInCol } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';
import { site } from '../config.js';

/* 统计 chips：随域（収蔵棚 / 交差点図）与模式（点亮 / 全図）变化，与原型 renderStats 一致 */
function statChips(state) {
  let collected = 0, known = 0, inGrid = 0;
  for (const k in WORDS) {
    const w = WORDS[k];
    if (w.status === 'collected') collected++; else known++;
    if (w.row && w.col) inGrid++;
  }
  if (state.domain !== 'map') {
    const rs = ROWS.filter((r) => wordsInRow(r.id).length > 0).length;
    const cs = COLS.filter((c) => wordsInCol(c.id).length > 0).length;
    return [
      <span className="chip" key="c">収蔵 <b>{collected}</b> 種</span>,
      <span className="chip" key="k">既知 <small>{known} 語</small></span>,
      <span className="chip" key="r">前項架 <small>{rs}</small></span>,
      <span className="chip" key="s">後項架 <small>{cs}</small></span>,
    ];
  }
  if (state.mode === 'lit') {
    return [
      <span className="chip" key="c">収蔵 <b>{collected}</b> 種</span>,
      <span className="chip" key="k">既知 <small>{known} 語</small></span>,
      <span className="chip" key="v">已点亮 <small>{inGrid} 格 · {VOLUMES.length} 巻</small></span>,
    ];
  }
  const empty = ROWS.length * COLS.length - inGrid;
  return [
    <span className="chip" key="c">収蔵 <b>{collected}</b> 種</span>,
    <span className="chip" key="k">既知 <small>{known} 語</small></span>,
    <span className="chip" key="e">空槽 <small>{empty} 格</small></span>,
    <span className="chip" key="g">系 <small>{ROWS.length} 前項 × {COLS.length} 後項</small></span>,
  ];
}

export default function Cover() {
  const { state } = useNav();
  /* 封面印章：収蔵编号范围（从数据算，随新标本卡自动更新） */
  const coll = Object.values(WORDS).filter((w) => w.status === 'collected');
  const nos = coll.map((w) => parseInt(w.no || '0', 10)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
  const yugoPending = Object.values(WORDS).some((w) => w.series === 'yugo' && w.status === 'known');
  const stampRange = nos.length ? String(nos[0]).padStart(2, '0') + '–' + String(nos[nos.length - 1]).padStart(2, '0') : '—';
  return (
    <header className="cover">
      <div className="cover-grid">
        <div>
          <p className="eyebrow">和語複合動詞 · 収蔵図鑑 <span className="zh">{site.eyebrowZh}</span></p>
          <h1 lang="ja">{site.title}</h1>
          <p className="cover-sub" lang="zh-CN">{site.coverSub}
            <span className="zh" lang="zh-CN">収蔵棚 = 按系看词（棚・卡片两种摆法）；交差点図 = 前項×後項 组合格子。朱印 = 已収蔵，淡格 = 已认识，暗格 = 等待新种。</span>
          </p>
          <div className="cover-chips" id="stat-chips">{statChips(state)}</div>
        </div>
        <div className="cover-seal">
          <div className="seal seal-lg">図鑑</div>
          <p className="stamp">収蔵 No.{stampRange}<br />{yugoPending ? '融合系 · 落ち着く 待収蔵' : '全系収蔵進行中'}</p>
        </div>
      </div>
      <div className="rule-double"></div>
    </header>
  );
}
