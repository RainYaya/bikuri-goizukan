import { zukanStats } from '../lib/data.js';
import { site } from '../config.js';

export default function Cover() {
  const s = zukanStats();
  return (
    <header className="cover">
      <div className="cover-grid">
        <div>
          <p className="eyebrow">和語複合動詞 · 収蔵図鑑 <span className="zh">{site.eyebrowZh}</span></p>
          <h1 lang="ja">{site.title}</h1>
          <p className="cover-sub" lang="zh-CN">{site.coverSub}
            <span className="zh" lang="zh-CN">横轴后项系 × 纵轴前项系：朱印 = 已収蔵，淡格 = 已认识，暗格 = 等待新种。</span>
          </p>
          <div className="cover-chips" id="stat-chips">
            <span className="chip">収蔵 <b>{s.collected}</b> 種</span>
            <span className="chip">既知 <small>{s.known} 語</small></span>
            <span className="chip">空槽 <small>{s.empty} 格</small></span>
            <span className="chip">系 <small>{s.rows} 前項 × {s.cols} 後項</small></span>
          </div>
        </div>
        <div className="cover-seal">
          <div className="seal seal-lg">図鑑</div>
          <p className="stamp">収蔵 No.01–04<br />融合系 05 予定</p>
        </div>
      </div>
      <div className="rule-double"></div>
    </header>
  );
}
