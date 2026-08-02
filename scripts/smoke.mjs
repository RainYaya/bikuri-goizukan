#!/usr/bin/env node
/**
 * smoke.mjs —— 渲染冒烟测试：用 ReactDOMServer 把每个视图渲染成字符串，
 * 捕获组件运行时崩溃（build 只查编译期，查不到空引用 / 缺字段这类问题）。
 *
 * 用法：node scripts/smoke.mjs
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* 模拟浏览器全局（App 的 useState 初始化会读 window.location.hash） */
global.window = { location: { hash: '' } };
global.history = { replaceState() {} };

const bundleTo = async (entry, out) => {
  await build({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    outfile: path.join(root, 'node_modules/.tmp-smoke/' + out),
    format: 'cjs',
    platform: 'node',
    jsx: 'automatic',
    external: ['react', 'react-dom'],
    plugins: [{
      name: 'css-ignore',
      setup(b) {
        b.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
      },
    }],
  });
};

await bundleTo('src/App.jsx', 'app.cjs');
await bundleTo('scripts/smoke-grid-entry.jsx', 'grid.cjs');

const React = require('react');
const { default: App } = require(path.join(root, 'node_modules/.tmp-smoke/app.cjs'));
const { renderGrid } = require(path.join(root, 'node_modules/.tmp-smoke/grid.cjs'));
const { renderToString } = require('react-dom/server');

/* hash → [期望出现的片段, 不应出现的片段] */
const CASES = [
  ['', ['収蔵棚', '前項棚', '後項棚', '融合系 ⑤', '取り〜系', '思い出す'], ['この図鑑の三つの記号']],    // 默认収蔵棚（交差点図的图鉴读法不应出现）
  ['#map', ['交差点図', 'この図鑑の三つの記号', 'class="matrix lit"', 'vol-nav', '思い出す', '読み取る'], ['系は棚、詞は標本']], // 交差点図 + 点亮矩阵第1巻（収蔵棚视图不应出现）
  ['#kangaekomu', ['考え込む', '語源解剖', '深陷内心'], []],                    // collected 标本卡
  ['#dashi_oshimi', ['出し惜しみ', '★', 'ケチる'], []],                        // collected 标本卡（含 HTML 字段）
  ['#torimodosu', ['取り戻す', '標本 未収蔵', '恢复 · 夺回'], []],               // known 占位卡
  ['#omoidasu', ['思い出す', '標本 №', '語源解剖', '想起'], []],               // 升级为标本卡
  ['#hanashiau', ['話し合う', '商量', '標本 №'], []],                          // 升级为标本卡
  ['#series-tori', ['取り〜系', '語義拡張樹', '取り返す vs 取り戻す'], []],      // 定制系页
  ['#series-kaesu', ['〜返す系', '返す の二つの顔', '瞬間口訣'], []],            // 定制系页
  ['#series-komu', ['〜込む系', '構詞構造定位', '入って出てこない'], []],       // 定制系页
  ['#series-sugiru', ['〜過ぎる系', '食べ過ぎる', '考え過ぎる'], []],            // 新后项系通用页
  ['#series-tachi', ['立ち〜系', '立ち上がる'], []],                           // 新前项系通用页
  ['#series-yugo', ['融合系', '落ち着く', '標本 №05 予定'], []],                // 融合系页
];

let failed = 0;
const check = (label, html, expects, notExpects) => {
  const missing = expects.filter((s) => !html.includes(s));
  const unexpected = (notExpects || []).filter((s) => html.includes(s));
  if (missing.length || unexpected.length) {
    failed++;
    console.error(`✗ ${label} 缺少片段: ${missing.join(', ') || '—'} ｜ 不该出现: ${unexpected.join(', ') || '—'}`);
  } else {
    console.log(`✓ ${label} 渲染正常 (${html.length} 字符)`);
  }
};

for (const [hash, expects, notExpects] of CASES) {
  global.window.location.hash = hash;
  let html;
  try {
    html = renderToString(React.createElement(App));
  } catch (e) {
    failed++;
    console.error(`✗ ${hash || '(shelf)'} 渲染崩溃: ${e.message}`);
    continue;
  }
  check(hash || '(shelf)', html, expects, notExpects);
}

/* 矩阵两种模式（脱离 App 直接渲染 GridMap） */
try {
  const lit = renderToString(renderGrid());
  check('grid-lit', lit, ['vol-nav', 'vol-tab', 'vol-page', '取出・移動', '壱', 'class="matrix lit"', '思い出す'], ['vol-wrap']);
  const full = renderToString(renderGrid({ mode: 'full' }));
  check('grid-full', full, ['class="matrix full"', '思い出す', '前項 ＼ 後項'], ['vol-nav', 'vol-wrap']);
} catch (e) {
  failed++;
  console.error('✗ GridMap 渲染崩溃: ' + e.message);
}

if (failed) {
  console.error(`\n冒烟测试失败：${failed} 项`);
  process.exit(1);
}
console.log(`\n冒烟测试全部通过（${CASES.length} 个视图 + 2 种矩阵模式）`);
