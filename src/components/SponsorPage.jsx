import { sponsor } from '../config.js';
import { useNav } from '../lib/nav.jsx';

/**
 * SponsorPage —— 赞助页（导航入口，非弹窗）。
 * HTML 结构与 CSS 类名与 sponsor.html 原型逐字一致。
 */
export default function SponsorPage() {
  const { openShelves } = useNav();
  return (
    <div style={{ maxWidth: 'min(880px, 100%)', marginInline: 'auto' }}>
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
            <h2 className="sp-title" lang="zh-CN">这个图鉴对你有帮助吗？</h2>
            <div className="seal sp-seal" title="猫飯" lang="ja">猫飯</div>
          </div>
          <p className="sp-copy" lang="zh-CN">如果它对你确实有帮助，欢迎<b>赞助一点</b> —— 这笔钱会变成我家猫的猫粮。</p>
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
            <button className="sp-btn" onClick={openShelves}>先逛逛图鉴</button>
            <span className="sp-thanks">图鉴本身永远免费 · 随意用就好</span>
          </div>
        </div>
      </div>
    </div>
  );
}
