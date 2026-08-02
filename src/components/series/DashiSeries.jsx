import SeriesHead from '../SeriesHead.jsx';
import MemberWall from '../MemberWall.jsx';

export default function DashiSeries() {
  return (
    <>
      <SeriesHead kind="row" id="dashi" />

      <section>
        <div className="insight">
          <p className="insight-label">動作系 · 往外拿</p>
          <p className="insight-text" lang="zh-CN"><b>出し〜</b> 的核心是「往外拿」的动作轴：放进去又拿出来 = <b>出し入れる</b>，抢在前头出手 = <b>出し抜く</b>，拿出时磨磨蹭蹭 = <b>出し渋る</b>，该拿出的却舍不得 = <b>出し惜しみ</b>。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">詞目一覧 <span className="zh">成员墙 —— 点击看词卡</span></p>
        <h2 className="sec-title" lang="ja">出し〜系 · 4 語</h2>
        <div className="wgrid"><MemberWall kind="row" id="dashi" /></div>
      </section>

      <section>
        <p className="eyebrow">交差点 <span className="zh">与其他系的交叉</span></p>
        <p className="intersect" lang="zh-CN"><b>出し惜しみ</b> 是「出し〜」与「〜惜しむ」的<b>交汇词</b>（分類② 意味特殊化）：既卡在「往外拿」的动作上，又「舍不得放手」。完整标本卡 → 回総索引点地图里的「出し惜しみ」格子。</p>
      </section>

      <section>
        <div className="archive-bar">
          <span className="archive-label">待分类区</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>以后学到新的「出し〜」词先放这里 —— 确认分类后点亮地图格子。</span>
        </div>
      </section>
    </>
  );
}
