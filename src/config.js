/**
 * config.js —— 站点级可调项集中处。
 * 以后想改任何「站点设置」（标题、文案、赞助弹窗），先来这里找；改组件内部的不在此列。
 * 详细说明见 docs/README.md 的「扩展点」一节。
 */

export const site = {
  title: '複合動詞図鑑',
  eyebrowZh: '交互图鉴',           // 封面 eyebrow 的中文副标
  coverSub: '前項 × 後項 の組み合わせ地図——格子就是目录，词卡就在格子下面。',
  footer: [
    '複合動詞図鑑 · React 版',
    '紙と朱の標本台紙 · デザイン: Arc tokens',
  ],
};

export const donate = {
  enabled: true,                 // 一键开关赞助弹窗
  dismissKey: 'zukan_donate_seen_v1', // localStorage 记忆键；改版本号可让老访客再看到一次
  qrPath: '/donate-qr.svg',      // 二维码文件（public/ 下）。换成你的收款码后在这里改路径（.png/.jpg/.svg 均可）
  seal: '🐈',
  title: 'この図鑑が良かったら',
  subtitle: '猫にごはんを買ってください 🐟',
  hint: '扫一扫，投喂一罐猫粮；不扫也没关系，去继续看图鉴吧。',
};
