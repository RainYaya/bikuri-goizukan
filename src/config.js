/**
 * config.js —— 站点级可调项集中处。
 * 以后想改任何「站点设置」（标题、文案、赞助弹窗），先来这里找；改组件内部的不在此列。
 * 详细说明见 docs/README.md 的「扩展点」一节。
 */

export const site = {
  title: '複合動詞図鑑',
  eyebrowZh: '交互图鉴',           // 封面 eyebrow 的中文副标
  coverSub: '複合動詞を「系」ごとに棚へ——同じ言葉、二つの見方。',
  footer: [
    '複合動詞図鑑 · React 版',
    '紙と朱の標本台紙 · デザイン: Arc tokens',
  ],
};

export const sponsor = {
  enabled: true,
  /* 猫图：photo 是大背景，polaroid 是左下角小相框 */
  photo: '/cat2.jpg',                   // 弹窗左侧猫大图
  polaroid: '/cat1.jpg',                // 宝丽来小照
  weixinQR: '/weixin-qr.png',           // 微信收款码
  zhifubaoQR: '/zhifubao-qr.png',       // 支付宝收款码
  title: 'この図鑑、役に立ってますか？',
  copy: '如果它对你有帮助，欢迎<b>赞助一点</b> —— 它会变成我家猫的猫粮。',
  closeBtn: '先逛逛图鉴',
  thanks: '図鑑自体はずっと無料 · 気軽に使ってね',
};

/* 新手指引 Tour */
export const tour = {
  /* 首次访问是否自动弹出（localStorage key = tour_seen_v1） */
  autoStart: true,
  dismissKey: 'tour_seen_v1',
  steps: [
    {
      target: '[data-act="shelf"]',
      title: '収蔵棚 —— 词按系分架',
      body: '词按系归架：前項棚是同根词的家族（如「取り〜」11 词一架），後項棚是语法骨架（如「〜込む」）。架子只会变长，不会空白。点这里回到主目录。',
      view: 'shelf',
    },
    {
      target: '[data-tour="shelf-switch"]',
      title: '棚 · 卡片 两种摆法',
      body: '右上角一键切换：棚表示 = 逛词（架上 chip 点词卡），卡片表示 = 看系（系名片 + 収蔵进度 + 空槽计数）。同一份词库，两种浏览方式。',
      view: 'shelf',
    },
    {
      target: '[data-act="map"]',
      title: '交差点図 —— 组合地图',
      body: '前項 × 後項 = 一个交点就是一词。行是前项系、列是后项系，一格一个组合。点这里切换到组合地图。',
      view: 'map',
    },
    {
      target: '[data-tour="vol-nav"]',
      title: '卷导航 —— 点亮模式分巻翻页',
      body: '点亮模式把后项列按语义分成多卷（取出・移動、進入・没頭…），一次只看一卷。点卷标签或 ← → 箭头翻页，带方向动画。',
      view: 'map',
    },
    {
      target: '[data-mode="full"]',
      title: '全図点阵 —— 完整坐标',
      body: '点这里切到「全図点阵」：展开所有前项×后项的完整坐标点阵，像宝可梦图鉴一样——暗格空槽等待新词来点亮。',
      view: 'map',
    },
    {
      target: '[data-tour="nav-sponsor"]',
      title: '赞助 —— 请猫吃顿饭 🐈',
      body: '图鉴本身永远免费，随意使用就好。如果它确实帮到了你，欢迎赞助一点——会变成我家猫的猫粮。点「去看看」打开赞助页。',
      view: 'map',
    },
  ],
};
