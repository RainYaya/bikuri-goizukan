# CONTENT-ARCHITECTURE.md —— 内容架构与添加工作流

> 这份文档回答三个问题：**数据文件之间怎么关联（依赖链）**、**加内容要动哪些文件（不变量）**、**怎么让 AI 帮你加（Prompt 速查）**。
> 这是给「人 + AI」看的唯一权威。改内容前先读它，`npm run check:data` 会在部署前兜住链条断点。

---

## 1. 数据文件全景（谁存什么）

| 文件 | 存什么 | 什么时候动 |
|---|---|---|
| `src/data/series.json` | 前项系（行）与后项系（列）：id/name/proto/kan | 出现全新的前项/后项时 |
| `src/data/volumes.json` | 后项列 → 卷 的语义分组（点亮模式分卷依据） | 新增后项列时必须补卷归属 |
| `src/data/words.json` | 每个复合动词的完整词条 | 加词 / 升级标本卡 |
| `src/data/series-content.json` | 每个系的叙事内容（insight/树/隐喻面板…，有序区块） | 给某系配专属叙事页时 |

外加 `src/config.js`（站点设置，与内容无关）。

---

## 2. 依赖链（为什么是「一环套一环」）

```
新词
 │  先确定它的 前项(row) 和 后项(col)
 ▼
 ┌─ 前项/后项 已存在 ────────────────→ 只改 words.json ✓
 ├─ 前项 是新的 ────────────────────→ ① series.json.rows 加一行
 ├─ 后项 是新的 ────────────────────→ ① series.json.cols 加一行
 │                                    ② volumes.json 把新列归入某卷（否则点亮模式丢词！）
 └─ 想给某个系配专属叙事页 ───────────→ ③ series-content.json 加该系的区块列表
                                            （不配 → 自动有 成员墙+空槽 默认页）
```

**每个词都吊在这条链上**：词 → 行/列（series.json）→ 列 → 卷（volumes.json）；系 → 内容（series-content.json）。漏了任何一环，站点会「看起来正常但某处消失」——这就是 `check:data` 要拦的。

---

## 3. 不变量（`npm run check:data` 强制检查）

| # | 不变量 | 违反的后果 |
|---|---|---|
| ① | 每个词的行/列/系 必须存在于 series.json | 格子画不出来 |
| ② | 每个后项列必须落在**恰好一卷**里 | 点亮模式丢失该列的词 |
| ③ | 卷里的列必须存在于 series.json.cols | 卷引用空列 |
| ④ | series-content.json 的每个 key 必须是真实系（或 yugo） | 系页找不到内容 |
| ⑤ | series-content.json 的每个区块 type 必须是已知类型 | 渲染器渲染不出该区块 |
| ⑥ | collected 词必填字段齐全（含融合词 row/col 放行） | 标本卡渲染缺字段 |

> 校验是**安全网**：AI 或人可以犯错，部署前 `check:data` 会报出断点，补一行即可，不致命。

---

## 4. 添加内容工作流（目标：把一环套一环压成一步）

```
你：  [Prompt 速查块 + 具体 Prompt] + 一个词 / 一个新系
AI：  → 返回全部相关文件的 JSON 改动（词条 + 必要的新行/新列 + 卷归属 + 可选系内容）
你：  → 把每段 JSON 贴进对应文件
     → npm run check:data   （不过就按报错补）
     → git push             （Vercel 自动部署）
```

**关键**：Prompt 里内置「架构速查块」（见 `docs/AI-PROMPTS.md`），AI 被强制按链条输出，而不是只改 words.json。

---

## 5. 加一个词后：什么自动更新，什么需维护

系页是「**自动汇总 + 人工策展**」的混合。加词到 words.json 后，各表面表现如下：

| 表面 | 加新词后 | 类型 |
|---|---|---|
| 交差点図矩阵 | ✅ 自动点亮一格 | 自动 |
| 収蔵棚（架子 / 词 chip） | ✅ 自动上架 | 自动 |
| 系页 · 成员墙 memberwall | ✅ 自动列出 | 自动 |
| 系页 · 系头 / 小地图 / 进度条 | ✅ 自动更新 | 自动 |
| 首页统计 chips | ✅ 自动更新 | 自动 |
| 系页 · 构词规律 patterns **公式行** | ✅ 自动派生（任何有词的系都有，公式最多 3 条，来自成员词） | 自动 |
| 系页 · 覚え方 insight | ❌ 需人工/AI 策展 | 策展 |
| 系页 · 语义树 tree | ❌ 需人工/AI 策展 | 策展 |
| 系页 · 易混淆 confusables | ❌ 需人工/AI 策展 | 策展 |
| 系页 · patterns 的 tags（商务/IT 场景频率） | ❌ 需人工/AI 策展 | 策展 |

**核心原则**：`words.json` 是一处真源。所有**可计算的展示**（矩阵 / 架 / 成员墙 / 进度 / 公式行）自动跟随；所有**不可计算的叙事**（覚え方 / 树的语义分支 / 易混对 / 场景标签）是策展内容，加词后按需用 §3.5 系叙事 Prompt 追加。

### 加一个词（推荐流程）

1. **形态一（最小，90% 场景）**：用 `docs/AI-PROMPTS.md` 的加词 Prompt 生成词条 JSON → 贴进 `words.json` → `npm run check:data` → 部署。矩阵 / 架 / 成员墙 / 构词规律公式行**全部自动更新**。
2. **形态二（可选）**：若想让新词出现在语义树 / 易混淆 / 覚え方里 → 用 §3.5 系叙事 Prompt，让 AI 把它追加进 `series-content.json` 的对应系区块。

### 现状（2026-08）

56 个系都有内容块：insight 56 · patterns 50（公式自动）· 语义树 18 · 易混淆 33 · 成员墙 52 · 口诀 46。

---

## 6. 区块类型速查（series-content.json）

每个系 = 一个有序数组，每项是 `{ "type": ..., ... }`。已知类型：

| type | 渲染 | 典型字段 |
|---|---|---|
| `insight` | 覚え方の原型 | label, text(HTML) |
| `tree` | 语义扩展树 | eyebrow(eyebrowZh), title, root, branches[{label, cls, items[{id, cn, stars}]}] |
| `patterns` | 构词规律（公式自动派生，最多 3 条；未配置时**每个有词的系自动补一个**）+ 场景频率 | title, note, tags{biz,it}（**无需写 items**） |
| `confusables` / `conf-pair` | 易混淆/双卡对比 | title, cards[{jp, em, cn, note}]（conf-pair 可带 chips） |
| `words-chips` | 精选词条 chip 行 | title, chips[{id, gloss, this?}], archive? |
| `archive` | 归档区 | label, chips[], hint |
| `metaphor` | 隐喻面板 | title, panels[{type,title,subtitle,core,groups[{label,desc,words[{jp,cn,intuition}]}]}], mnemonic? |
| `wcards` | 精选词卡 | title, cards[{jp,cat,catLabel,cn,intuition,ex,id?}] |
| `practice` | 实战联想 | title, items[{jp,cn,hint}] |
| `struct` | 构词结构定位 | items[{no,jp,zh,ex,lit?}], note |
| `wgrid-groups` | 分仓词墙 | title, groups[{label,cls,items[{jp,cn,foot?}]}] |
| `memberwall` | 成员墙（数据驱动） | kind(row/col), id（词自动从 words.json 派生） |
| `intersect` | 交叉点 | html |
| `mnemonic` | 瞬間口訣 | pill, text |
| `empty-slots` | 空槽统计（通用回退） | kind, id |

> `memberwall` 不重复存词——词始终以 words.json 为准。`eyebrow`/`eyebrowZh` 是区块标题的日/中两段。

---

## 7. 常见操作速查

| 想做什么 | 改哪 |
|---|---|
| 加一个既有前项/后项的新词 | `words.json` |
| 加一个带新前项/后项的词 | `words.json` + `series.json`（+ `volumes.json` 若新后项） |
| 给某系配专属叙事页 | `series-content.json`（加区块列表，或只加一个 `insight`） |
| 改系的一句话语感 | `series.json` 的 `kan` |
| 新增后项列后忘了归卷 | `volumes.json`（check:data 会提醒） |

---

## 8. 边界

- `text`/`html`/`note` 等字段允许 `<b>` 等轻量 HTML（渲染用 dangerouslySetInnerHTML）——只放自己生成的内容。
- `memberwall` 的成员墙随 words.json 自动更新；`words-chips` 是精选列表（设计内容），新词不会自动进精选，需手动加。
- `patterns` 的**公式行自动派生**（最多 3 条，来自成员词），JSON 里**不用写 items**；只有 `title` / `note` / `tags`（商务/IT 场景频率）是策展字段。
- 想改整个站点外观 → `src/config.js` + `src/styles.css`；想加新区块类型 → `src/components/series/Sections.jsx` 的 RENDERERS 注册表加一项。
