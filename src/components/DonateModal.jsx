import { useEffect, useState } from 'react';
import { donate } from '../config.js';

/**
 * DonateModal —— 首访赞助弹窗（给猫买猫粮 🐈）。
 *
 * 行为：
 *   - 首次访问（localStorage 无记录）显示一次
 *   - 关闭后写入 localStorage，之后不再打扰（新浏览器 / 隐身模式会再看到一次）
 *   - 关闭方式：× 按钮 / 点遮罩 / ESC
 *
 * 开关与文案都在 src/config.js 的 donate 对象里；二维码图片在 public/ 下。
 */
export default function DonateModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!donate.enabled) return;
    try {
      if (!localStorage.getItem(donate.dismissKey)) setShow(true);
    } catch (e) {
      /* localStorage 不可用（如隐私模式）时静默放行，不弹窗 */
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  function dismiss() {
    try { localStorage.setItem(donate.dismissKey, '1'); } catch (e) { /* 忽略 */ }
    setShow(false);
  }

  return (
    <div className="donate-overlay" onClick={dismiss} role="dialog" aria-modal="true" aria-label="赞助">
      <div className="donate-card" onClick={(e) => e.stopPropagation()}>
        <button className="donate-close" onClick={dismiss} aria-label="关闭">×</button>
        <div className="donate-seal">{donate.seal}</div>
        <h3 className="donate-title" lang="ja">{donate.title}</h3>
        <p className="donate-sub" lang="zh-CN">{donate.subtitle}</p>
        <img className="donate-qr" src={donate.qrPath} alt="赞助二维码" />
        <p className="donate-hint" lang="zh-CN">{donate.hint}</p>
      </div>
    </div>
  );
}
