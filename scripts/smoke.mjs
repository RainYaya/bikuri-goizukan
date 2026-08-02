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

await build({
  entryPoints: [path.join(root, 'src/App.jsx')],
  bundle: true,
  outfile: path.join(root, 'node_modules/.tmp-smoke/app.cjs'),
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

const React = require('react');
const { default: App } = require(path.join(root, 'node_modules/.tmp-smoke/app.cjs'));
const { renderToString } = require('react-dom/server');

/* hash → [期望出现的片段, 不应出现的片段] */
const CASES = [
  ['', ['総索引', 'この図鑑の三つの記号', 'class="matrix"', 'class="cell filled"', '思い出す', '話し合う'], ['matrix dim', 'cell collected']],   // 首页（矩阵不 dim；収蔵済格是 filled；新高频词已点亮）
  ['#kangaekomu', ['考え込む', '語源解剖', '深陷内心'], []],                     // collected 标本卡
  ['#dashi_oshimi', ['出し惜しみ', '★', 'ケチる'], []],                         // collected 标本卡（含 HTML 字段）
  ['#torimodosu', ['取り戻す', '標本 未収蔵', '恢复 · 夺回'], []],               // known 占位卡
  ['#serieslib', ['系別図鑑', '前項系', '融合・特殊'], []],                      // 系别库
  ['#series-tori', ['取り〜系', '語義拡張樹', '取り返す vs 取り戻す'], []],      // 定制系页
  ['#series-kaesu', ['〜返す系', '返す の二つの顔', '瞬間口訣'], []],             // 定制系页
  ['#series-komu', ['〜込む系', '構詞構造定位', '入って出てこない'], []],        // 定制系页
  ['#series-dashi', ['出し〜系', '交差点', '4 語'], []],                         // 定制系页
  ['#series-oshimu', ['〜惜しむ系', '収蔵 1 語', '出すのをためらう'], []],       // 定制系页
  ['#series-yugo', ['融合系', '落ち着く', '標本 №05 予定'], []],                 // 融合系页
  ['#series-mi', ['見〜系', '交叉点', '見返す'], []],                            // 通用系页（无定制，有成员）
  ['#omoidasu', ['思い出す', '標本 未収蔵', '想起'], []],                        // 新 added known 词
  ['#hanashiau', ['話し合う', '商量'], []],                                     // 新 added known 词
  ['#torikumu', ['取り組む', '着手'], []],                                      // 新 added known 词（既有系 × 新系）
  ['#series-sugiru', ['〜過ぎる系', '食べ過ぎる', '考え過ぎる'], []],             // 新后项系通用页
  ['#series-tachi', ['立ち〜系', '立ち上がる'], []],                            // 新前项系通用页
];

let failed = 0;
for (const [hash, expects, notExpects] of CASES) {
  global.window.location.hash = hash;
  let html;
  try {
    html = renderToString(React.createElement(App));
  } catch (e) {
    failed++;
    console.error(`✗ ${hash || '(home)'} 渲染崩溃: ${e.message}`);
    continue;
  }
  const missing = expects.filter((s) => !html.includes(s));
  const unexpected = (notExpects || []).filter((s) => html.includes(s));
  if (missing.length || unexpected.length) {
    failed++;
    console.error(`✗ ${hash || '(home)'} 缺少片段: ${missing.join(', ') || '—'} ｜ 不该出现: ${unexpected.join(', ') || '—'}`);
  } else {
    console.log(`✓ ${hash || '(home)'} 渲染正常 (${html.length} 字符)`);
  }
}

if (failed) {
  console.error(`\n冒烟测试失败：${failed}/${CASES.length} 个视图有问题`);
  process.exit(1);
}
console.log(`\n冒烟测试全部通过（${CASES.length} 个视图）`);
