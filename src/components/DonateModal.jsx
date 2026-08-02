import { useEffect, useState, useCallback } from 'react';
import { sponsor } from '../config.js';

/**
 * SponsorModal —— 赞助弹窗（复刻 sponsor.html）。
 *
 * 布局：左猫图 + 右文案 + 微信/支付宝双码 + 「不再显示」复选框
 * 行为：
 *   - 每次访问都弹出（除非勾选「不再显示」后关闭）
 *   - 点遮罩 / × / ESC 关闭，下次访问仍会弹出
 *   - 勾选「不再显示」+ 关闭 → localStorage 记忆，永久不再显示
 *   - 左下角有「再显示弹窗」链接供已关闭者找回
 */
export default function SponsorModal() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);

  useEffect(() => {
    if (!sponsor.enabled) return;
    let dismissed = false;
    try { dismissed = !!localStorage.getItem(sponsor.dismissKey); } catch (e) { /* 忽略 */ }
    if (dismissed) return;
    setShow(true);
    /* 下一帧触发入场动画 */
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, open]);

  /* 关闭（不写 localStorage —— 下次还弹） */
  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => setShow(false), 320);
  }, []);

  /* 永久关闭（勾选「不再显示」后） */
  const dismissForever = useCallback(() => {
    if (dontRemind) {
      try { localStorage.setItem(sponsor.dismissKey, '1'); } catch (e) { /* 忽略 */ }
    }
    close();
  }, [dontRemind, close]);

  if (!show) return null;

  return (
    <div className={'sp-ovl' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-label="可选赞助" onClick={close}>
      <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sp-x" aria-label="关闭" title="关闭" onClick={close}>×</button>
        <div className="sp-grid">
          <div className="sp-photo">
            <img src={sponsor.photo} alt="家里的猫" />
            <span className="sp-tape"></span>
            <figure className="sp-polaroid">
              <img src={sponsor.polaroid} alt="另一只猫" />
              <small>うちの猫</small>
            </figure>
          </div>
          <div className="sp-body">
            <p className="eyebrow">スポンサー <span className="zh">赞助 · Sponsor</span></p>
            <div className="sp-title-row">
              <h2 className="sp-title" lang="zh-CN">{sponsor.title}</h2>
              <div className="seal sp-seal" title="猫飯" lang="ja">猫飯</div>
            </div>
            <p className="sp-copy" lang="zh-CN" dangerouslySetInnerHTML={{ __html: sponsor.copy }} />
            <div className="sp-qrs">
              <figure className="sp-qr sp-qr-wx">
                <img src={sponsor.weixinQR} alt="微信收款码" />
                <figcaption>微信</figcaption>
              </figure>
              <figure className="sp-qr">
                <img src={sponsor.zhifubaoQR} alt="支付宝收款码" />
                <figcaption>支付宝</figcaption>
              </figure>
            </div>
            <div className="sp-foot">
              <button className="sp-btn sp-btn-close" onClick={close}>{sponsor.closeBtn}</button>
              <label className="sp-cbx">
                <input type="checkbox" checked={dontRemind} onChange={(e) => setDontRemind(e.target.checked)} />
                <span>不再显示</span>
              </label>
              <button className="sp-btn sp-btn-dismiss" onClick={dismissForever} title="确认不再显示">✕</button>
              <span className="sp-thanks">{sponsor.thanks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
