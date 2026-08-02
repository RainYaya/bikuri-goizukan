/**
 * Stars —— 「可导出性 ★」展示。
 * 标本卡 / 占位卡 meta 列里用：<p class="stars">★★★<span class="off">☆☆</span></p>
 */
export default function Stars({ value, label }) {
  if (value == null) return null;
  const on = '★★★★★'.slice(0, value);
  const off = '☆☆☆☆☆'.slice(0, 5 - value);
  return (
    <p className="stars" aria-label={(label || '可导出性 ') + value + '/5'}>
      <span>{on}</span><span className="off">{off}</span>
    </p>
  );
}
