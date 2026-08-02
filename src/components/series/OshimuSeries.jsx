import SeriesHead from '../SeriesHead.jsx';
import MemberWall from '../MemberWall.jsx';

export default function OshimuSeries() {
  return (
    <>
      <SeriesHead kind="col" id="oshimu" />

      <section>
        <div className="insight">
          <p className="insight-label">心理系 · 舍不得放手</p>
          <p className="insight-text" lang="zh-CN"><b>〜惜しむ</b> 从「珍惜」转出「舍不得给」：<b>金を惜しむ</b>（不舍得花钱）· <b>言葉を惜しむ</b>（惜字如金）· <b>労力を惜しむ</b>（不肯费工夫）—— 全系目前只収蔵了它与「出し〜」交汇出的 <b>出し惜しみ</b> 一个标本。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">詞目一覧 <span className="zh">成员墙 —— 点击看词卡</span></p>
        <h2 className="sec-title" lang="ja">〜惜しむ系 · 収蔵 1 語</h2>
        <div className="wgrid"><MemberWall kind="col" id="oshimu" /></div>
      </section>

      <section>
        <p className="eyebrow">交差点 <span className="zh">与其他系的交叉</span></p>
        <p className="intersect" lang="zh-CN"><b>出し惜しみ</b> 是「〜惜しむ」与「出し〜」的<b>交汇词</b>——心理系（舍不得）撞上动作系（往外拿）。剩余 7 个前項坐标仍是空槽，等新的「〜惜しむ」词来点亮。</p>
      </section>

      <section>
        <div className="mnemonic">
          <span className="mn-pill">瞬間口訣</span>
          <p className="mn-text" lang="zh-CN">「手伸进口袋要拿东西，又缩了回来」——<b>出すのをためらう</b>。</p>
        </div>
      </section>
    </>
  );
}
