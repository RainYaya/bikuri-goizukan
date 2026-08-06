import { WORDS, seriesName, wordsInRow, wordsInCol, ROWS, COLS, colName, rowName } from '../../lib/data.js';
import { useNav } from '../../lib/nav.jsx';
import MemberWall from '../MemberWall.jsx';

/**
 * Sections —— 系列内容区块渲染注册表。
 * 数据来自 src/data/series-content.json：每个系 = 有序区块列表，type 决定渲染组件。
 * 任何新系只要往 JSON 里加区块，就能获得同样的叙事能力，无需写组件。
 */

function Eyebrow({ s }) {
  if (!s.eyebrow) return null;
  return <p className="eyebrow">{s.eyebrow} <span className="zh">{s.eyebrowZh || ''}</span></p>;
}

/* ══ insight：覚え方の原型 ══ */
function SectionInsight({ s }) {
  return (
    <section>
      <div className="insight">
        <p className="insight-label">{s.label}</p>
        <p className="insight-text" lang="zh-CN" dangerouslySetInnerHTML={{ __html: s.text }} />
      </div>
    </section>
  );
}

/* ══ tree：语义扩展树 ══ */
function TiStars({ stars }) {
  if (stars == null) return null;
  let out = '';
  for (let i = 0; i < 5; i++) out += (i < stars ? '★' : '☆');
  return <span className="ti-stars" aria-label={'可导出性 ' + stars + '/5'}>{out}</span>;
}
function SectionTree({ s }) {
  const { openWord } = useNav();
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="tree">
        <div className="tree-root" lang="ja">{s.root}</div>
        <div className="tree-branches">
          {s.branches.map((b, i) => (
            <div className="tree-branch" key={i}>
              <span className={'branch-label ' + b.cls} lang="ja">{b.label}</span>
              <ul className="tree-items">
                {b.items.map((it) => (
                  <li key={it.id} data-word={it.id} onClick={() => openWord(it.id)}>
                    <span className="ti-cn">{it.cn}</span>
                    <span className="ti-jp" lang="ja">{WORDS[it.id] ? WORDS[it.id].word : it.id}</span>
                    <TiStars stars={it.stars} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══ patterns：构词规律（公式自动从成员词生成，最多 3 条）+ 场景频率 tags（策展） ══ */
/* 前项是行名「取り〜」（〜在末尾，去掉尾部）；后项是列名「〜出す」（〜在开头，去掉头部） */
function stripRow(name) { return String(name).replace(/〜$/, ''); }
function stripCol(name) { return String(name).replace(/^〜/, ''); }
function derivePatternItems(kind, id, max = 3) {
  const members = kind === 'row' ? wordsInRow(id) : wordsInCol(id);
  return members.slice(0, max).map((w) => {
    const front = kind === 'row' ? stripRow(rowName(id)) : stripRow(rowName(w.row));
    const back = kind === 'row' ? stripCol(colName(w.col)) : stripCol(colName(id));
    const result = (w.eq && w.eq.resultNote) || w.gloss || '';
    return { formula: front + ' + ' + back, result };
  });
}
function SectionPatterns({ s, kind, id }) {
  /* 公式行自动派生：加新词到 words.json 后这里会自动多一行（最多 3 条） */
  const items = derivePatternItems(kind, id, 3);
  if (!items.length) return null;
  const fallbackTitle = kind === 'row'
    ? stripRow(rowName(id)) + ' + 後項 → 語義'
    : '前項 + ' + stripCol(colName(id)) + ' → 語義';
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title || fallbackTitle}</h2>
      <div className="pat-grid">
        {items.map((it, i) => (
          <div className="pat-item" key={i}>
            <span className="pat-formula" lang="ja">{it.formula}</span>
            <span className="pat-arrow">→</span>
            <span className="pat-result" lang="zh-CN">{it.result}</span>
          </div>
        ))}
        {s.note && <p className="pat-note" lang="zh-CN">{s.note}</p>}
      </div>
      {s.tags && ['biz', 'it'].map((k) => s.tags[k] && (
        <div key={k}>
          <p className="scene-head" lang="ja">{s.tags[k].label}</p>
          <div className="tag-row">
            {s.tags[k].items.map((t, i) => (
              <span key={i} className={'tag tag-' + k}><b lang="ja">{t.word}</b> · {t.cn}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ══ confusables / conf-pair：易混淆 / 双卡对比 ══ */
function ConfCard({ c }) {
  return (
    <div className="conf-card">
      <div className="conf-header"><span className="conf-jp" lang="ja">{c.jp}</span><span className="conf-em">{c.em}</span></div>
      <p className="conf-cn" lang="zh-CN">{c.cn}</p>
      <p className="conf-note" lang="zh-CN">{c.note}</p>
    </div>
  );
}
function SectionConfusables({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="conf-pair">{s.cards.map((c, i) => <ConfCard c={c} key={i} />)}</div>
    </section>
  );
}
function SectionConfPair({ s }) {
  const { openWord } = useNav();
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="conf-pair">{s.cards.map((c, i) => <ConfCard c={c} key={i} />)}</div>
      {s.chips && (
        <div className="chip-row" style={{ marginTop: 'var(--space-4)' }}>
          {s.chips.map((ch) => {
            const w = WORDS[ch.id];
            if (!w) return null;
            return (
              <span key={ch.id} className="fw-chip honshu" data-word={ch.id} onClick={() => openWord(ch.id)}>
                <span className="fgw" lang="ja">{w.word}</span><span className="fgg">{ch.gloss}</span>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ══ words-chips：精选词条 chip 行 ══ */
function SectionWordsChips({ s }) {
  const { openWord } = useNav();
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="chip-row">
        {s.chips.map((ch) => {
          const w = WORDS[ch.id];
          if (!w) return null;
          return (
            <span key={ch.id} className={'fw-chip' + (ch.this ? ' honshu' : '')} data-word={ch.id} onClick={() => openWord(ch.id)}>
              <span className="fgw" lang="ja">{w.word}</span><span className="fgg">{ch.gloss}</span>
            </span>
          );
        })}
      </div>
      {s.archive && <ArchiveBar a={s.archive} marginTop />}
    </section>
  );
}

/* ══ archive：归档区 ══ */
function ArchiveBar({ a, marginTop }) {
  return (
    <div className="archive-bar" style={marginTop ? { marginTop: 'var(--space-4)' } : undefined}>
      <span className="archive-label">{a.label}</span>
      {a.chips && a.chips.map((c, i) => <span className="archive-chip" lang="ja" key={i}>{c}</span>)}
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{a.hint}</span>
    </div>
  );
}
function SectionArchive({ s }) {
  return (
    <section><ArchiveBar a={s} /></section>
  );
}

/* ══ metaphor：隐喻面板 ══ */
function MetaWord({ w }) {
  return (
    <div className="mg-word">
      <span className="mg-w-jp" lang="ja">{w.jp}</span>
      <span className="mg-w-cn">{w.cn}</span>
      <span className="mg-w-intuition">{w.intuition}</span>
    </div>
  );
}
function SectionMetaphor({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="meta-pair">
        {s.panels.map((p, i) => (
          <div className={'meta-panel ' + p.type} key={i}>
            <div className="meta-title" lang="ja">{p.title}</div>
            <p className="meta-subtitle" lang="zh-CN">{p.subtitle}</p>
            <p className="meta-core" lang="zh-CN">{p.core}</p>
            {p.groups.map((g, gi) => (
              <div className="meta-group" key={gi}>
                <span className="mg-label" lang="ja">{g.label}</span>
                <p className="mg-desc" lang="zh-CN">{g.desc}</p>
                <div className="mg-words">{g.words.map((w, wi) => <MetaWord w={w} key={wi} />)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {s.mnemonic && <Mnemonic m={s.mnemonic} />}
    </section>
  );
}

/* ══ wcards：精选词卡 ══ */
function IntuitionText({ text, plain }) {
  if (plain) return <p className="wc-intuition">{text}</p>;
  const parts = String(text).split('→');
  return (
    <p className="wc-intuition">
      {parts.map((p, i) => i === 0 ? p : <span key={i}><span className="arr">→</span>{p}</span>)}
    </p>
  );
}
function SectionWcards({ s }) {
  const { openWord } = useNav();
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="wgrid">
        {s.cards.map((c, i) => (
          c.id ? (
            <div key={i} className="wcard honshu" data-word={c.id} onClick={() => openWord(c.id)}>
              <div className="wc-top"><span className="wc-jp" lang="ja">{c.jp}</span><span className={'wc-cat ' + c.cat}>{c.catLabel}</span></div>
              <span className="wc-cn">{c.cn}</span>
              <IntuitionText text={c.intuition} plain />
              <p className="wc-ex" lang="ja"><b>例</b> <span dangerouslySetInnerHTML={{ __html: c.ex }} /></p>
            </div>
          ) : (
            <div key={i} className="wcard">
              <div className="wc-top"><span className="wc-jp" lang="ja">{c.jp}</span><span className={'wc-cat ' + c.cat}>{c.catLabel}</span></div>
              <span className="wc-cn">{c.cn}</span>
              <IntuitionText text={c.intuition} />
              <p className="wc-ex" lang="ja"><b>例</b> <span dangerouslySetInnerHTML={{ __html: c.ex }} /></p>
            </div>
          )
        ))}
      </div>
    </section>
  );
}

/* ══ practice：实战联想 ══ */
function SectionPractice({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="prac-grid">
        {s.items.map((it, i) => (
          <div className="prac-item" key={i}>
            <span className="prac-jp" lang="ja">{it.jp}</span>
            <span className="prac-cn">{it.cn}</span>
            <p className="prac-hint" lang="zh-CN">{it.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══ struct：构词结构定位 ══ */
function SectionStruct({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <div className="struct-grid">
        {s.items.map((it, i) => (
          <div className={'st' + (it.lit ? ' lit' : '')} key={i}>
            <span className="st-no">{it.no}</span>
            <b lang="ja">{it.jp}</b>
            <span className="zh">{it.zh}</span>
            <span className="ex" lang="ja">{it.ex}</span>
          </div>
        ))}
      </div>
      <p className="struct-note" lang="zh-CN">{s.note}</p>
    </section>
  );
}

/* ══ wgrid-groups：分仓词墙 ══ */
function footFor(it) {
  if (it.foot === 'honshu') {
    return <div className="wc-foot"><span className="wc-stars">★★★★☆</span><span className="wc-type">分類④ · ★本種</span></div>;
  }
  if (it.foot === 'proto') {
    return <div className="wc-foot"><span className="wc-stars muted">★★★★★</span><span className="wc-type">进入系原型</span></div>;
  }
  return <div className="wc-foot"><span className="wc-stars muted">—</span><span className="wc-type">後項接尾辞化</span></div>;
}
function SectionWgridGroups({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{s.title}</h2>
      <div className="wgrid">
        {s.groups.map((g) => (
          g.items.map((it, i) => (
            <div key={it.jp + '-' + i} className={'wcard' + (it.foot === 'honshu' ? ' honshu' : '')}>
              <div className="wc-top"><span className="wc-jp" lang="ja">{it.jp}</span><span className={'wc-cat ' + g.cls}>{g.label}</span></div>
              <span className="wc-cn">{it.cn}</span>
              {footFor(it)}
            </div>
          ))
        ))}
      </div>
    </section>
  );
}

/* ══ memberwall：成员墙（数据驱动） ══ */
function SectionMemberwall({ s }) {
  const members = s.kind === 'row' ? wordsInRow(s.id) : wordsInCol(s.id);
  const axis = s.kind === 'row' ? ROWS.find((r) => r.id === s.id) : COLS.find((c) => c.id === s.id);
  return (
    <section>
      <Eyebrow s={s} />
      <h2 className="sec-title" lang="ja">{seriesName(s.id)} · {members.length} 語</h2>
      {members.length ? (
        <div className="wgrid"><MemberWall kind={s.kind} id={s.id} /></div>
      ) : (
        <p className="sec-sub">本系还没有成员词 —— 遇到第一个「{axis.name}」词就点亮这里。</p>
      )}
    </section>
  );
}

/* ══ intersect：交叉点 ══ */
function SectionIntersect({ s }) {
  return (
    <section>
      <Eyebrow s={s} />
      <p className="intersect" lang="zh-CN" dangerouslySetInnerHTML={{ __html: s.html }} />
    </section>
  );
}

/* ══ mnemonic：瞬間口訣 ══ */
function Mnemonic({ m }) {
  return (
    <div className="mnemonic">
      <span className="mn-pill">{m.pill}</span>
      <p className="mn-text" lang="zh-CN" dangerouslySetInnerHTML={{ __html: m.text }} />
    </div>
  );
}
function SectionMnemonic({ s }) {
  return (
    <section><Mnemonic m={s} /></section>
  );
}

/* ══ empty-slots：空槽统计（通用系回退用） ══ */
function SectionEmptySlots({ s }) {
  const axis = s.kind === 'row' ? ROWS.find((r) => r.id === s.id) : COLS.find((c) => c.id === s.id);
  const members = s.kind === 'row' ? wordsInRow(s.id) : wordsInCol(s.id);
  const crossList = s.kind === 'row' ? COLS : ROWS;
  const crossName = s.kind === 'row' ? '後項' : '前項';
  const coord = s.kind === 'row' ? colName : rowName;
  const crossNote = members.length ? (
    <p className="intersect" lang="zh-CN">
      <b>交叉点：</b>本系目前点亮 <b>{members.length}</b> 个坐标，全部列在这里 ——{' '}
      {s.kind === 'row'
        ? `每个词都是「${axis.name}」与对应后項系的交点。`
        : `每个词都是「${axis.name}」与对应前項系的交点。`}
    </p>
  ) : null;
  return (
    <section>
      <p className="eyebrow">空槽 <span className="zh">等待新词</span></p>
      {crossNote}
      <p className="sec-sub" lang="zh-CN">
        本系（{axis.name}）共 {crossList.length} 个 {crossName} 坐标，已点亮 {members.length}，还有{' '}
        <b>{crossList.length - members.length} 个空槽</b>。学到新词 → 回交差点図格子图对应坐标点亮一格。
      </p>
    </section>
  );
}

/* ═══ 注册表 ═══ */
const RENDERERS = {
  insight: SectionInsight,
  tree: SectionTree,
  patterns: SectionPatterns,
  confusables: SectionConfusables,
  'conf-pair': SectionConfPair,
  'words-chips': SectionWordsChips,
  archive: SectionArchive,
  metaphor: SectionMetaphor,
  wcards: SectionWcards,
  practice: SectionPractice,
  struct: SectionStruct,
  'wgrid-groups': SectionWgridGroups,
  memberwall: SectionMemberwall,
  intersect: SectionIntersect,
  mnemonic: SectionMnemonic,
  'empty-slots': SectionEmptySlots,
};

export function Sections({ list, kind, id }) {
  return (
    <>
      {list.map((s, i) => {
        const R = RENDERERS[s.type];
        return R ? <R s={s} kind={kind} id={id} key={i} /> : null;
      })}
    </>
  );
}
