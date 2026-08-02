export default function Home() {
  return (
    <>
      <section>
        <p className="eyebrow">図鑑の見方 <span className="zh">图鉴读法</span></p>
        <h2 className="sec-title" lang="ja">この図鑑の三つの記号</h2>
        <div className="howto-grid">
          <div className="ht"><span className="ht-mark seal-mini">惜</span><b>朱印</b><span lang="zh-CN">每张标本卡一字，取自核心词义。图上有朱点的格子 = 已収蔵，点它直接看卡。</span></div>
          <div className="ht"><span className="ht-mark stars-mini">★★★☆☆</span><b>可導出性</b><span lang="zh-CN">从前项＋后项能否推出词义的程度（★1–5）。星越少越需要整体记忆。</span></div>
          <div className="ht"><span className="ht-mark cls-mini">分類 ①②③④⑤</span><b>構詞分類</b><span lang="zh-CN">五种构词类型。顶部过滤条可只点亮某一类的格子。</span></div>
          <div className="ht"><span className="ht-mark">前項×後項</span><b>组合地図</b><span lang="zh-CN">行 = 前项系，列 = 后项系。一格 = 一个组合，交点就是词。</span></div>
          <div className="ht"><span className="ht-mark">観察記録</span><b>用例</b><span lang="zh-CN">标本卡里有商务 / IT 两种「栖息环境」的实际例句。</span></div>
          <div className="ht"><span className="ht-mark">暗格 ？</span><b>空槽暗格</b><span lang="zh-CN">还没遇见的坐标。以后认识新词，就在对应格子点亮一格 —— 这就是图鉴的无限扩展。</span></div>
        </div>
      </section>

      <section>
        <p className="eyebrow">使い方 <span className="zh">怎么用</span></p>
        <h2 className="sec-title" lang="ja">二つの動線</h2>
        <div className="conf-pair">
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp">点格子</span><span className="conf-em">看单词</span></div>
            <p className="conf-cn" lang="zh-CN">在地図里点任意实格 / 淡格，下方展示区原地切换成那个词的卡片 —— 不跳网页。</p>
            <p className="conf-note" lang="zh-CN">収蔵済 → 完整标本卡（语源解剖 · 近缘种 · 用例 · 口诀）；既知 → 未収蔵占位卡。</p>
          </div>
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp">点系別</span><span className="conf-em">看线 · 家族</span></div>
            <p className="conf-cn" lang="zh-CN">顶部导航切到「系別」——那是与「词」不同的领域：线。按 前項系 / 後項系 / 融合・特殊 三仓组织。</p>
            <p className="conf-note" lang="zh-CN">点开任一系：系名片（原型 · 语感 · 収蔵进度）、系内小地图、成员墙一屏展开；原来 tori / kaesu / komu 三个分页的内容都在各自的系总览里。</p>
          </div>
        </div>
      </section>
    </>
  );
}
