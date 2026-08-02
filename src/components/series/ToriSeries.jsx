import { WORDS } from '../../lib/data.js';
import { useNav } from '../../lib/nav.jsx';
import SeriesHead from '../SeriesHead.jsx';

/* 语义扩展树里的「可导出性」角标 */
function TiStars({ stars }) {
  if (stars == null) return null;
  let s = '';
  for (let i = 0; i < 5; i++) s += (i < stars ? '★' : '☆');
  return <span className="ti-stars" aria-label={'可导出性 ' + stars + '/5'}>{s}</span>;
}

/* 词条小 chip（可点击看词卡） */
function WordChip({ id, gloss, isThis }) {
  const { openWord } = useNav();
  const w = WORDS[id];
  if (!w) return null;
  return (
    <span className={'fw-chip' + (isThis ? ' honshu' : '')} data-word={id} onClick={() => openWord(id)}>
      <span className="fgw" lang="ja">{w.word}</span>
      <span className="fgg">{gloss}</span>
    </span>
  );
}

export default function ToriSeries() {
  const { openWord } = useNav();
  return (
    <>
      <SeriesHead kind="row" id="tori" />

      <section>
        <div className="insight">
          <p className="insight-label">覚え方の原型 · 一只手</p>
          <p className="insight-text" lang="zh-CN">看到 <b>取り〜</b>，先想到一只手：伸手 → 抓住 → 拿过来。往自己这边拿 = <b>获取</b>，往别处处置 = <b>处理</b>，拿进自己心里 = <b>接受</b>。唯一的例外是「取り消す」——它已整体固定为「撤销」。</p>
        </div>
      </section>

      <section>
        <p className="eyebrow">語義拡張樹 <span className="zh">语义扩展树</span></p>
        <h2 className="sec-title" lang="ja">取り〜 の三つの枝</h2>
        <div className="tree">
          <div className="tree-root" lang="ja">取り〜</div>
          <div className="tree-branches">
            <div className="tree-branch">
              <span className="branch-label bl-get" lang="ja">获取</span>
              <ul className="tree-items">
                <li data-word="toridasu" onClick={() => openWord('toridasu')}><span className="ti-cn">取出来</span><span className="ti-jp" lang="ja">取り出す</span><TiStars stars={5} /></li>
                <li data-word="torimodosu" onClick={() => openWord('torimodosu')}><span className="ti-cn">收回来</span><span className="ti-jp" lang="ja">取り戻す</span><TiStars stars={5} /></li>
                <li data-word="torikaesu" onClick={() => openWord('torikaesu')}><span className="ti-cn">夺回来</span><span className="ti-jp" lang="ja">取り返す</span><TiStars stars={4} /></li>
              </ul>
            </div>
            <div className="tree-branch">
              <span className="branch-label bl-handle" lang="ja">処理</span>
              <ul className="tree-items">
                <li data-word="toriageru" onClick={() => openWord('toriageru')}><span className="ti-cn">拿起·报道</span><span className="ti-jp" lang="ja">取り上げる</span><TiStars stars={3} /></li>
                <li data-word="torikesu" onClick={() => openWord('torikesu')}><span className="ti-cn">撤销</span><span className="ti-jp" lang="ja">取り消す</span><TiStars stars={2} /></li>
              </ul>
            </div>
            <div className="tree-branch">
              <span className="branch-label bl-get" lang="ja">受容</span>
              <ul className="tree-items">
                <li data-word="toriireru" onClick={() => openWord('toriireru')}><span className="ti-cn">引进·采纳</span><span className="ti-jp" lang="ja">取り入れる</span><TiStars stars={4} /></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="eyebrow">構詞規律 <span className="zh">构词规律</span></p>
        <h2 className="sec-title" lang="ja">取り + 後項 → 語義</h2>
        <div className="pat-grid">
          <div className="pat-item"><span className="pat-formula" lang="ja">取り + 出す</span><span className="pat-arrow">→</span><span className="pat-result" lang="zh-CN">取出</span></div>
          <div className="pat-item"><span className="pat-formula" lang="ja">取り + 戻す</span><span className="pat-arrow">→</span><span className="pat-result" lang="zh-CN">取回 / 恢复</span></div>
          <div className="pat-item"><span className="pat-formula" lang="ja">取り + 消す</span><span className="pat-arrow">→</span><span className="pat-result" lang="zh-CN">撤销</span></div>
          <p className="pat-note" lang="zh-CN">「取り消す」无法简单解释为「拿走并消除」——前缀化已部分进行，需整体记忆。</p>
        </div>
        <p className="scene-head" lang="ja">場景頻度 · 商务高频</p>
        <div className="tag-row">
          <span className="tag tag-biz"><b lang="ja">取り消す</b> · 撤销</span>
          <span className="tag tag-biz"><b lang="ja">取り入れる</b> · 引进</span>
          <span className="tag tag-biz"><b lang="ja">取りまとめる</b> · 汇总</span>
          <span className="tag tag-biz"><b lang="ja">取り扱う</b> · 处理</span>
        </div>
        <p className="scene-head" lang="ja">場景頻度 · IT 高频</p>
        <div className="tag-row">
          <span className="tag tag-it"><b lang="ja">取り込む</b> · 导入</span>
          <span className="tag tag-it"><b lang="ja">取り出す</b> · 提取</span>
          <span className="tag tag-it"><b lang="ja">取り扱う</b> · 处理</span>
          <span className="tag tag-it"><b lang="ja">取り除く</b> · 移除</span>
        </div>
      </section>

      <section>
        <p className="eyebrow">紛らわしい対 <span className="zh">易混淆词对比</span></p>
        <h2 className="sec-title" lang="ja">取り返す vs 取り戻す</h2>
        <div className="conf-pair">
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp" lang="ja">取り返す</span><span className="conf-em">强调夺回动作</span></div>
            <p className="conf-cn" lang="zh-CN">夺回来 / 抢回来 / 挽回来</p>
            <p className="conf-note" lang="zh-CN">侧重「夺」这一主动行为——把失去的东西通过自身努力夺回手中。常用于比赛翻盘、金钱挽回等场景。</p>
          </div>
          <div className="conf-card">
            <div className="conf-header"><span className="conf-jp" lang="ja">取り戻す</span><span className="conf-em">强调恢复结果</span></div>
            <p className="conf-cn" lang="zh-CN">恢复原状 / 找回</p>
            <p className="conf-note" lang="zh-CN">侧重「回到原来状态」的结果——不一定是主动夺回，也可以自然恢复。常用于健康恢复、信用恢复等场景。</p>
          </div>
        </div>
      </section>

      <section>
        <p className="eyebrow">詞目一覧 <span className="zh">全系词卡（点击可看词卡）</span></p>
        <h2 className="sec-title" lang="ja">取り〜系 · 収蔵 11 語</h2>
        <div className="chip-row">
          <WordChip id="toridasu" gloss="取出·提取" isThis />
          <WordChip id="torimodosu" gloss="恢复·夺回" />
          <WordChip id="torikaesu" gloss="挽回·夺回" />
          <WordChip id="toriireru" gloss="引进·采纳" />
          <WordChip id="toriageru" gloss="拿起·报道" />
          <WordChip id="torikesu" gloss="撤销" />
          <WordChip id="torikomu" gloss="导入·加载" />
          <WordChip id="torimatomeru" gloss="汇总" />
          <WordChip id="toriatsukau" gloss="处理" />
          <WordChip id="torinozoku" gloss="移除" />
          <WordChip id="torinaosu" gloss="重来一次" />
        </div>
        <div className="archive-bar" style={{ marginTop: 'var(--space-4)' }}>
          <span className="archive-label">归档区</span>
          <span className="archive-chip" lang="ja">取り直す — 收回类 — 重来一次 — 已归档</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>新词先放这里，确认分类后点亮地图格子</span>
        </div>
      </section>
    </>
  );
}
