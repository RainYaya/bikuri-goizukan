import { useNav } from '../../lib/nav.jsx';
import SeriesHead from '../SeriesHead.jsx';

export default function YugoSeries() {
  const { openWord } = useNav();
  return (
    <>
      <SeriesHead kind="yugo" id="yugo" />

      <section>
        <div className="insight">
          <p className="insight-label">融合系 ⑤ · 前後項の融合</p>
          <p className="insight-text" lang="zh-CN">这一类词，<b>前项和后项已经长成一个整体</b>：既不能「前项修饰后项」，也不能拆开解释。词义必须整体记忆 —— 就像「落ち着く」不是「落下 + 到达」，而是「沉着・安定」。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">収蔵予定 <span className="zh">收藏预定</span></p>
        <h2 className="sec-title" lang="ja">落ち着く —— 標本 №05 予定</h2>
        <div className="conf-pair">
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp" lang="ja">落ち着く</span><span className="conf-em">融合 ⑤</span></div>
            <p className="conf-cn" lang="zh-CN">沉着 · 安定 · 平静 · 冷静下来</p>
            <p className="conf-note" lang="zh-CN">「落ち」与「着く」都已失去独立解释力，融合后整体表「安定下来」。是五种构词类型里最「不可推导」的一类。</p>
          </div>
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp">待収蔵</span><span className="conf-em">下一步</span></div>
            <p className="conf-cn" lang="zh-CN">融合系其他候选词：考え抜く（彻头彻尾地想）等，遇到后收入归档区。</p>
            <p className="conf-note" lang="zh-CN">点下方「落ち着く」可看未収蔵占位卡；制作标本卡时，重点记录它的「整体记忆」路径。</p>
          </div>
        </div>
        <div className="chip-row" style={{ marginTop: 'var(--space-4)' }}>
          <span className="fw-chip honshu" data-word="ochitsuku" onClick={() => openWord('ochitsuku')}>
            <span className="fgw" lang="ja">落ち着く</span><span className="fgg">沉着 · 安定</span>
          </span>
        </div>
      </section>

      <section>
        <div className="archive-bar">
          <span className="archive-label">待分类区</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>以后遇到的新词先放这里 —— 先判断是哪个系（同前项 / 同后项），再点亮地图格子；融合词直接归入本系。</span>
        </div>
      </section>
    </>
  );
}
