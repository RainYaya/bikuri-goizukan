# 複合動詞図鑑（Bikuri Goizukan）

日语复合动词可视化图鉴 —— **前項 × 後項 的組み合わせ地図**。

两个视图、同一份词库：**収蔵棚**（词按系分架 —— 前項棚/后项棚，棚或卡片两种摆法）和 **交差点図**（前項×後項 组合格子图，点亮/全図两种显示模式）。格子就是目录，一个交点就是一个复合动词：朱印 = 已収蔵（有完整标本卡），淡格 = 已认识（占位卡），暗格 = 等待新词。

> 这是对 Open Design 里 `zukan.html` 单文件设计的 **React 忠实移植** + 扩展缝隙。设计真源保留在 [`design/zukan.html`](design/zukan.html)，Open Design 源文件夹未动。

---

## 技术栈（简单，方便部署）

| 项 | 选型 | 为什么 |
|---|---|---|
| 构建 | **Vite 7 + React 19（纯 JS，无 TS）** | 静态图鉴站，最简即可 |
| 数据 | **静态 JSON**（`src/data/*.json`，构建时打包） | 无运行时 fetch，无 404 风险 |
| 路由 | hash 切换（`useEffect` 复刻，无 react-router） | 保持原版行为，零额外依赖 |
| 部署 | Vercel / Netlify / 任意静态托管 | 构建产物在 `dist/` |

无后端、无数据库、无第三方运行时依赖。二维码、文案等站点设置集中在 [`src/config.js`](src/config.js)。

---

## 目录结构

```
bikuri-Goizukan/
├── index.html                # 入口（#root + main.jsx）
├── package.json / vite.config.js / vercel.json
├── design/
│   └── zukan.html            # 设计真源（Open Design 导出，只读参考）
├── public/
│   └── donate-qr.svg         # 赞助二维码占位图（换成你的收款码）
├── scripts/
│   ├── extract-design.mjs    # 从 design/zukan.html 重新同步样式与数据
│   └── validate-data.mjs     # 数据校验（npm run check:data）
├── src/
│   ├── main.jsx  App.jsx     # 入口 + 状态机（hash 路由、body.in-series）
│   ├── config.js             # ★ 站点级设置集中处（标题/文案/赞助弹窗）
│   ├── styles.css            # 由 design/zukan.html 逐字抽取 + 赞助弹窗样式
│   ├── data/
│   │   ├── series.json       # ★ 前項系/后项系（很少改）
│   │   ├── words.json        # ★ 词库（加词就改它）
│   │   └── volumes.json      # 点亮模式的「分巻」语义分组（后项列 → 卷）
│   ├── lib/
│   │   ├── data.js           # 数据派生函数（gridAt / seriesName / 统计…）
│   │   └── nav.jsx           # 导航 Context（openWord / openSeries / goBack…）
│   └── components/
│       ├── Nav / Cover / GridMap / Stage / Home
│       ├── SpecimenCard / PendingCard / SeriesLib
│       ├── SeriesHead / Minimap / MemberWall / Stars / DonateModal
│       └── series/           # 6 个定制系页 + GenericSeries
└── docs/
    ├── CONTENT-ARCHITECTURE.md # ★ 内容架构：数据文件依赖链 + 不变量 + 加内容决策树
    ├── CONTENT-FORMAT.md     # ★ JSON Schema 与内容管理规范
    └── AI-PROMPTS.md         # ★ 给 AI 的 Prompt 模板（加词 / 加系 / 加系叙事内容）
```

---

## 本地开发

```bash
npm install        # 装依赖
npm run dev        # 本地预览（默认 http://localhost:5173）
npm run check:data # 校验数据 JSON（加词后必跑）
```

## 构建与预览

```bash
npm run build      # 产物在 dist/
npm run preview    # 本地预览构建产物（验证部署效果）
```

## 部署到 Vercel

1. 把仓库推到 GitHub（或 GitLab）。
2. Vercel → Import Project → 选这个仓库。
3. Framework 会自动识别 **Vite**（`vercel.json` 已配置 `buildCommand: npm run build`、`outputDirectory: dist`）。
4. Deploy。之后每次 `git push` 到主分支自动重新部署。

> 也可直接 `vercel` CLI：`npm i -g vercel && vercel --prod`。

---

## 加一个词（内容更新主流程）

本质是一次「编辑 JSON → 校验 → 重新部署」：

1. 用 [`docs/AI-PROMPTS.md`](docs/AI-PROMPTS.md) 的 Prompt 让 AI 生成词条 JSON。
2. 把结果粘贴进 `src/data/words.json` 的 `words` 对象。
3. `npm run check:data` 校验通过。
4. `git push` → Vercel 自动重新部署。

新词入库后**自动点亮**：矩阵格子、系成员墙、系内小地图、系进度条、首页统计——全部不用改代码。详细规则见 [`docs/CONTENT-FORMAT.md`](docs/CONTENT-FORMAT.md)。

---

## 扩展点（以后想加东西，从这里入手）

| 想做什么 | 改哪里 |
|---|---|
| 改标题 / 页脚 / 赞助文案 / 关掉赞助弹窗 | `src/config.js` |
| 加一个新词（含 AI 生成） | `src/data/words.json`（新前项/后项还要 `series.json` + `volumes.json`） |
| 加一个新的前项/后项系 | `src/data/series.json`（自动获得通用系页） |
| 给某系配叙事页（覚え方/树/隐喻面板…） | `src/data/series-content.json` + `docs/AI-PROMPTS.md` §3.5 |
| 理解数据文件怎么联动 | `docs/CONTENT-ARCHITECTURE.md` |
| 给某系配专属定制页 | 在 `src/components/series/` 新增组件，并在 `SeriesView.jsx` 注册一行 |
| 加一个新的顶层视图 | `App.jsx` 的 `parseHash` / `renderView` / 导航按钮各加一处 |
| 加一个首访弹窗之外的交互 | 参考 `DonateModal.jsx`（localStorage + config 开关模式） |
| 设计源更新后同步样式/数据 | `node scripts/extract-design.mjs`（会覆盖 words.json，注意备份） |

---

## 上线前验证清单

- [ ] `npm run check:data` 通过
- [ ] `npm run build` 通过
- [ ] `npm run preview` 打开，与 `design/zukan.html` 并排核对：収蔵棚（棚/卡片切换）、交差点図（点亮/全図切换、卷导航翻页、图例折叠、bare-band、过滤 ①–⑤）、点格开卡、6 个定制系页、hash 直达（`#map`、`#kangaekomu`、`#series-kaesu`）、「← 回到」按钮
- [ ] 首次访问出现赞助弹窗 → 关闭 → 刷新不再出现；换浏览器/隐身再访问会再出现
- [ ] `public/donate-qr.svg` 已换成你的真实收款码（或改 `config.js` 的 `qrPath`）

---

## 与原版的刻意差异（文案微调）

- 封面 eyebrow 副标与页脚由「单文件…」改为「React 版 / 交互图鉴」——因为已不是单文件。
- 其余视觉、布局、交互、数据逐字保留。

---

## 目录结构说明（给想改的人）

- `design/zukan.html` 是唯一的视觉真源；`src/styles.css` 是从它逐字抽取的，`src/data/*.json` 是从它的数据段抽取的。
- 词条字段里含 HTML 的（`tagline` / `core` / `intersect` / `noteZh` 等）在 React 里用 `dangerouslySetInnerHTML` 原样渲染，与设计源一致。
