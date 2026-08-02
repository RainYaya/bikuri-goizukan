import { BYNAME } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';
import Stars from './Stars.jsx';

/**
 * SpecimenCard —— 収蔵済 完整标本卡。
 * w 来自 words.json 的 collected 词条；含 HTML 的字段用 dangerouslySetInnerHTML 原样渲染（保真）。
 */
function Term({ klass, role, word, src, note, shift }) {
  return (
    <div className={'term' + (klass ? ' ' + klass : '')}>
      <span className="term-role">{role}</span>
      <div className="term-word" lang="ja">
        {word}
        {src ? <small>〈{String(src).replace(/[〈〉]/g, '')}〉</small> : null}
      </div>
      {note ? <p className="term-note" lang="zh-CN">{note}</p> : null}
      {shift ? <div className="shift" dangerouslySetInnerHTML={{ __html: shift }} /> : null}
    </div>
  );
}

function Family({ f, selfId }) {
  const { openWord } = useNav();
  return (
    <div className="family">
      <h4 lang="ja">{f.title}</h4>
      <p className="fsub">{f.sub}</p>
      <ul className="fam-list">
        {f.items.map((it, i) => {
          const [word, gloss, isThis] = it;
          const wid = BYNAME[word];
          const clickable = wid && wid !== selfId;
          return (
            <li key={i} className={'fam-item' + (isThis ? ' this' : '')}
              data-word={clickable ? wid : undefined}
              title={clickable ? '点此看词卡' : undefined}
              onClick={clickable ? () => openWord(wid) : undefined}>
              <span className="f-word" lang="ja">{word}</span>
              <span className="f-gloss">{gloss}</span>
              {isThis ? <span className="f-flag">★ 本種</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Usage({ env, title, sub }) {
  return (
    <div className="habitat">
      <h4 lang="ja">{title}</h4>
      <p className="hsub">{sub}</p>
      <ol className="usage-list">
        {env.map((u, i) => (
          <li className="usage" key={i}>
            <span className="no">№{i + 1}</span>
            <p className="ja" lang="ja">{u[0]}</p>
            <p className="zh" lang="zh-CN">{u[1]}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function SpecimenCard({ w }) {
  const eq = w.eq;
  return (
    <article className="specimen">
      <div className="label-bar">
        <span><b>標本 № {w.no}</b></span><span className="sep">·</span>
        <span>属 <b lang="ja">{w.genus}</b></span><span className="sep">·</span>
        <span>品詞 <b lang="ja">{w.pos}</b></span><span className="sep">·</span>
        <span>状態 収録済</span>
      </div>

      <div className="spec-main">
        <div className="seal" aria-label={'本种之印：' + w.seal}>{w.seal}</div>
        <div className="lemma">
          <h2 className="word" lang="ja">{w.word}</h2>
          <p className="reading" lang="ja">{w.reading} <span>{w.romaji}</span></p>
          <p className="tagline" lang="zh-CN" dangerouslySetInnerHTML={{ __html: w.tagline }} />
        </div>
        <div className="meta-col">
          <div className="meta-cell">
            <p className="mlabel">可導出性 · 语意可推导性</p>
            <Stars value={w.stars} label="可导出性 " />
          </div>
          <div className="meta-cell">
            <p className="mlabel">構詞分類</p>
            <span className="type-badge" lang="ja">分類 {w.cls} {w.clsNote}</span>
          </div>
        </div>
      </div>

      <section className="spec-sec">
        <p className="sec-label">語源解剖 <span className="zh">构词解剖</span></p>
        <div className="eq">
          <Term role="前項" word={eq.front} src={eq.frontSrc} note={eq.frontNote} />
          <div className="op">+</div>
          <Term klass="back" role={eq.backRole} word={eq.back} note={eq.backNote} shift={eq.backShift} />
          <div className="op">=</div>
          <Term klass="result" role="複合語" word={eq.result} note={eq.resultNote} shift={eq.resultShift} />
        </div>
        <p className="core-img" lang="zh-CN" dangerouslySetInnerHTML={{ __html: w.core }} />
      </section>

      <section className="spec-sec">
        <p className="sec-label">近縁種 <span className="zh">近亲词族</span></p>
        <div className="family-grid">
          {w.families.map((f, i) => <Family key={i} f={f} selfId={w.id} />)}
        </div>
        <p className="intersect" lang="zh-CN" dangerouslySetInnerHTML={{ __html: w.intersect }} />
      </section>

      <section className="spec-sec">
        <p className="sec-label">観察記録 <span className="zh">实际用例</span></p>
        <div className="habitat-grid">
          <Usage env={w.usages.biz} title="ビジネス環境" sub="商务场景" />
          <Usage env={w.usages.it} title="IT環境" sub="IT 场景" />
        </div>
      </section>

      <section className="spec-sec">
        <p className="sec-label">語感ノート <span className="zh">语感记忆</span></p>
        <div className="note">
          <p className="note-label">覚え方 · 瞬間口诀</p>
          <p className="note-ja" lang="zh-CN">{w.note}</p>
          <p className="note-zh" lang="zh-CN">{w.noteZh}</p>
        </div>
      </section>
    </article>
  );
}
