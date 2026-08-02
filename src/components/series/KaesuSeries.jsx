import { useNav } from '../../lib/nav.jsx';
import SeriesHead from '../SeriesHead.jsx';

/* 把「→」包成 .arr 箭头（与原版 wcard 的 replace 一致） */
function Intuition({ text }) {
  const parts = String(text).split('→');
  return (
    <p className="wc-intuition">
      {parts.map((p, i) => i === 0 ? p : <span key={i}><span className="arr">→</span>{p}</span>)}
    </p>
  );
}

function Wcard({ jp, cat, catLabel, cn, intuition, ex }) {
  return (
    <div className="wcard">
      <div className="wc-top"><span className="wc-jp" lang="ja">{jp}</span><span className={'wc-cat ' + cat}>{catLabel}</span></div>
      <span className="wc-cn">{cn}</span>
      <Intuition text={intuition} />
      <p className="wc-ex" lang="ja"><b>例</b> {ex}</p>
    </div>
  );
}

export default function KaesuSeries() {
  const { openWord } = useNav();
  return (
    <>
      <SeriesHead kind="col" id="kaesu" />

      <section>
        <div className="insight">
          <p className="insight-label">二つの物理画面</p>
          <p className="insight-text" lang="zh-CN">看到 <b>〜返す</b>，脑中闪过两个画面：<b>乒乓球撞墙弹回来</b>，或 <b>煎饼翻个面</b>——要么是「弹回去 / 折返重来」，要么是「彻底翻过来」。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">比喩パネル <span className="zh">隐喻面板</span></p>
        <h2 className="sec-title" lang="ja">返す の二つの顔</h2>
        <div className="meta-pair">
          <div className="meta-panel bounce">
            <div className="meta-title" lang="ja">反弹 · 折返</div>
            <p className="meta-subtitle" lang="zh-CN">乒乓球与墙壁</p>
            <p className="meta-core" lang="zh-CN">施加一个动作 → 碰到「墙壁」→ 原路弹回来</p>
            <div className="meta-group">
              <span className="mg-label" lang="ja">弹回去</span>
              <p className="mg-desc" lang="zh-CN">外力对你施加动作 → 你沿原路弹回去</p>
              <div className="mg-words">
                <div className="mg-word"><span className="mg-w-jp" lang="ja">言い返す</span><span className="mg-w-cn">顶嘴 · 反驳</span><span className="mg-w-intuition">对方说 → 你说回去</span></div>
                <div className="mg-word"><span className="mg-w-jp" lang="ja">やり返す</span><span className="mg-w-cn">回击 · 还手</span><span className="mg-w-intuition">被打 → 打回去</span></div>
                <div className="mg-word"><span className="mg-w-jp" lang="ja">聞き返す</span><span className="mg-w-cn">反问 · 追问</span><span className="mg-w-intuition">被问 → 问回去</span></div>
              </div>
            </div>
            <div className="meta-group">
              <span className="mg-label" lang="ja">折返重来</span>
              <p className="mg-desc" lang="zh-CN">自己动作到达终点 → 折返起点重新走一遍</p>
              <div className="mg-words">
                <div className="mg-word"><span className="mg-w-jp" lang="ja">繰り返す</span><span className="mg-w-cn">反复 · 循环</span><span className="mg-w-intuition">线轮转到底 → 折返不断重复</span></div>
                <div className="mg-word"><span className="mg-w-jp" lang="ja">読み返す</span><span className="mg-w-cn">重读 · 温习</span><span className="mg-w-intuition">读到结尾 → 折返回开头</span></div>
                <div className="mg-word"><span className="mg-w-jp" lang="ja">思い返す</span><span className="mg-w-cn">回想 · 重新考虑</span><span className="mg-w-intuition">思路走远 → 折返回去重想</span></div>
              </div>
            </div>
          </div>

          <div className="meta-panel flip">
            <div className="meta-title" lang="ja">翻面 · 颠覆</div>
            <p className="meta-subtitle" lang="zh-CN">煎饼翻面</p>
            <p className="meta-core" lang="zh-CN">原本的状态 → 180 度翻转 → 彻底颠倒</p>
            <div className="meta-group">
              <span className="mg-label" lang="ja">翻过来</span>
              <p className="mg-desc" lang="zh-CN">把物体的正反面颠倒</p>
              <div className="mg-words">
                <div className="mg-word"><span className="mg-w-jp" lang="ja">裏返す</span><span className="mg-w-cn">翻过来</span><span className="mg-w-intuition">背面翻到正面</span></div>
              </div>
            </div>
            <div className="meta-group">
              <span className="mg-label" lang="ja">彻底颠覆</span>
              <p className="mg-desc" lang="zh-CN">抽象状态的 180 度翻转 —— 推翻结论、逆转颓势</p>
              <div className="mg-words">
                <div className="mg-word"><span className="mg-w-jp" lang="ja">ひっくり返す</span><span className="mg-w-cn">推翻 · 弄翻</span><span className="mg-w-intuition">整个掀翻 → 上下颠倒</span></div>
                <div className="mg-word"><span className="mg-w-jp" lang="ja">持ち返す</span><span className="mg-w-cn">好转 · 起死回生</span><span className="mg-w-intuition">跌 → 翻转往上挺住</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mnemonic">
          <span className="mn-pill">瞬間口訣</span>
          <p className="mn-text" lang="zh-CN">看到 <b>「〜返す」</b>，不用思考语法分类——要么是 <b>弹回去 / 重新来一遍</b>，要么是 <b>翻个面</b>。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">精選詞条 <span className="zh">物理直觉详解</span></p>
        <h2 className="sec-title" lang="ja">〜返す系 · 収蔵 8 語</h2>
        <div className="wgrid">
          <Wcard jp="言い返す" cat="tag-bounce" catLabel="弹回去" cn="顶嘴 · 反驳" intuition="对方说一句 → 你把话弹回去" ex="彼はすぐ言い返す。／他马上回嘴。" />
          <Wcard jp="やり返す" cat="tag-bounce" catLabel="弹回去" cn="回击 · 还手" intuition="对方打你一下 → 动作弹回去" ex="やられたらやり返す。／以牙还牙。" />
          <Wcard jp="繰り返す" cat="tag-bounce" catLabel="折返重来" cn="反复 · 循环" intuition="线轮转到底 → 折返起点不断重复" ex="失敗を繰り返す。／反复失败。" />
          <Wcard jp="読み返す" cat="tag-bounce" catLabel="折返重来" cn="重读 · 温习" intuition="读到结尾 → 折返回开头再读一遍" ex="手紙を何度も読み返す。／反复重读来信。" />
          <Wcard jp="裏返す" cat="tag-flip" catLabel="翻过来" cn="翻过来 · 翻转" intuition="背面 → 翻到正面" ex="服を裏返して干す。／把衣服翻过来晾。" />
          <Wcard jp="ひっくり返す" cat="tag-flip" catLabel="颠覆" cn="推翻 · 弄翻" intuition="整桌东西 → 彻底掀翻上下颠倒" ex="結論をひっくり返す。／推翻结论。" />
          <Wcard jp="持ち返す" cat="tag-flip" catLabel="颠覆" cn="好转 · 起死回生" intuition="一直在跌 → 翻转往上挺住" ex="株価が持ち返す。／股价起死回生。" />
          <div className="wcard honshu" data-word="mikaesu" onClick={() => openWord('mikaesu')}>
            <div className="wc-top"><span className="wc-jp" lang="ja">見返す</span><span className="wc-cat tag-bounce">両義</span></div>
            <span className="wc-cn">复查 / 让人刮目相看</span>
            <p className="wc-intuition">①看到最后折返重看 ②以前被看低 → 现在看回去</p>
            <p className="wc-ex" lang="ja"><b>例</b> 答案を見返す。／复查答案。<br />成功して見返す。／成功后让人刮目相看。</p>
          </div>
        </div>
      </section>

      <section>
        <p className="eyebrow">実戦連想 <span className="zh">实战联想练习</span></p>
        <h2 className="sec-title" lang="ja">自分で物理直觉を作る</h2>
        <div className="prac-grid">
          <div className="prac-item"><span className="prac-jp" lang="ja">照り返す</span><span className="prac-cn">反射 · 折射</span><p className="prac-hint" lang="zh-CN">阳光照到地面 → 像球撞墙弹回来</p></div>
          <div className="prac-item"><span className="prac-jp" lang="ja">見返す</span><span className="prac-cn">复查 / 争一口气</span><p className="prac-hint" lang="zh-CN">检查试卷到末尾折返重看 · 以前被看不起现在看回去</p></div>
          <div className="prac-item"><span className="prac-jp" lang="ja">ひっくり返す</span><span className="prac-cn">推翻 / 掀翻</span><p className="prac-hint" lang="zh-CN">把一整桌东西彻底翻个面 → 推翻结论 / 桌子</p></div>
        </div>
      </section>
    </>
  );
}
