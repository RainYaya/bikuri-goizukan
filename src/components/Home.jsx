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
        <h2 className="sec-title" lang="ja">二つの見方</h2>
        <div className="conf-pair">
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp">収蔵棚</span><span className="conf-em">按系分架看词</span></div>
            <p className="conf-cn" lang="zh-CN">词按系归架：前項棚（词根家族，如「取り〜」11 词一架）+ 後項棚（语法骨架，如「〜込む」「〜返す」）。架头 = 系名片，点它展开系総覧；架上词 chip 点它看词卡。</p>
            <p className="conf-note" lang="zh-CN">収蔵済 → 完整标本卡；既知 → 未収蔵占位卡。架子只存在于有词的系 —— 空系收进底部「未収蔵系」条带，等新词来开架。<b>棚表示 / 卡片表示</b> 两种摆法在右上角一键切换 —— 卡片摆法里每个系都能看到空槽计数。</p>
          </div>
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp">交差点図</span><span className="conf-em">前項×後項 组合</span></div>
            <p className="conf-cn" lang="zh-CN">行 = 前项系，列 = 后项系，一格 = 一个组合交点。点实格看标本卡，点淡格看未収蔵占位，暗格留待新词。</p>
            <p className="conf-note" lang="zh-CN">词多了图自动分巻 + 剪枝，保持「图≈满」；「全図点阵」模式留给想逛完整坐标的人 —— 加新词 = 点亮一格，架子与格子同时出现。</p>
          </div>
        </div>
      </section>
    </>
  );
}
