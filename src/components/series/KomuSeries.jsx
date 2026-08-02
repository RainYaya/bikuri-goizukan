import SeriesHead from '../SeriesHead.jsx';

/* 〜込む系 成员墙的四分仓（静态设计内容，词目本身在 words.json） */
const FOUR = [
  ['深入沉溺', 'cat-immerse', [
    ['考え込む', '深思 · 想得入神', true],
    ['思い込む', '深信'],
    ['信じ込む', '深信不疑'],
    ['黙り込む', '沉默不语'],
    ['話し込む', '畅谈 · 长谈'],
    ['読み込む', '研读 · 加载'],
  ]],
  ['進入 · 渗透', 'cat-enter', [
    ['飛び込む', '跳入'],
    ['染み込む', '渗入 · 浸透'],
    ['溶け込む', '融入'],
    ['吸い込む', '吸入'],
    ['潜り込む', '潜入'],
  ]],
  ['状態変動', 'cat-state', [
    ['冷え込む', '骤冷 · 气温骤降'],
    ['落ち込む', '消沉 · 凹陷'],
    ['弱り込む', '病弱 · 衰弱'],
  ]],
  ['慣用', 'cat-idiom', [
    ['申し込む', '申请 · 报名'],
    ['取り込む', '导入 · 加载'],
  ]],
];

function KomuCard({ catName, catCls, jp, cn, isThis, foot }) {
  return (
    <div className={'wcard' + (isThis ? ' honshu' : '')}>
      <div className="wc-top"><span className="wc-jp" lang="ja">{jp}</span><span className={'wc-cat ' + catCls}>{catName}</span></div>
      <span className="wc-cn">{cn}</span>
      {foot}
    </div>
  );
}

function footFor(jp, isThis) {
  if (isThis) {
    return <div className="wc-foot"><span className="wc-stars">★★★★☆</span><span className="wc-type">分類④ · ★本種</span></div>;
  }
  if (jp === '飛び込む' || jp === '染み込む' || jp === '吸い込む') {
    return <div className="wc-foot"><span className="wc-stars muted">★★★★★</span><span className="wc-type">进入系原型</span></div>;
  }
  return <div className="wc-foot"><span className="wc-stars muted">—</span><span className="wc-type">後項接尾辞化</span></div>;
}

export default function KomuSeries() {
  return (
    <>
      <SeriesHead kind="col" id="komu" />

      <section>
        <div className="insight">
          <p className="insight-label">一つの動き · 入って出てこない</p>
          <p className="insight-text" lang="zh-CN"><b>〜込む</b> 的核心是「进去就出不来」：身体跳进去 = <b>飛び込む</b>；水渗进去 = <b>染み込む</b>；温度掉进去 = <b>冷え込む</b>；想问题想进去 = <b>考え込む</b>。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">構詞構造定位 <span className="zh">构词分类定位</span></p>
        <div className="struct-grid">
          <div className="st"><span className="st-no">①</span><b lang="ja">前項が後項を修飾</b><span className="zh">前项修饰后项</span><span className="ex" lang="ja">押し出す</span></div>
          <div className="st"><span className="st-no">②</span><b lang="ja">後項が前項を修飾</b><span className="zh">后项修饰前项</span><span className="ex" lang="ja">振り当てる</span></div>
          <div className="st"><span className="st-no">③</span><b lang="ja">前項の接頭辞化</b><span className="zh">前项前缀化</span><span className="ex" lang="ja">打ち明ける</span></div>
          <div className="st lit"><span className="st-no">④</span><b lang="ja">後項の接尾辞化</b><span className="zh">后项后缀化 ★ 本種</span><span className="ex" lang="ja">考え込む</span></div>
          <div className="st"><span className="st-no">⑤</span><b lang="ja">前後項の融合</b><span className="zh">前后项融合</span><span className="ex" lang="ja">落ち着く</span></div>
        </div>
        <p className="struct-note" lang="zh-CN">※ 本种「考え込む」是分類 ④「後項の接尾辞化」的标本词：「込む」失去「进入」的实义，转为表示「深・彻底・沉浸」的接尾辞。</p>
      </section>

      <section>
        <p className="eyebrow">詞目一覧 <span className="zh">全系词卡</span></p>
        <h2 className="sec-title" lang="ja">〜込む系 · 収蔵 16 語</h2>
        <div className="wgrid">
          {FOUR.map(([catName, catCls, items]) => (
            items.map(([jp, cn, isThis], i) => (
              <KomuCard key={jp + '-' + i} catName={catName} catCls={catCls} jp={jp} cn={cn} isThis={!!isThis} foot={footFor(jp, !!isThis)} />
            ))
          ))}
        </div>
      </section>

      <section>
        <div className="archive-bar">
          <span className="archive-label">归档区</span>
          <span className="archive-chip" lang="ja">差し込む — 插入 — 待分类</span>
          <span className="archive-chip" lang="ja">書き込む — 写入 — 待分类</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>新词先放这里，确认分支后点亮地图格子</span>
        </div>
      </section>
    </>
  );
}
