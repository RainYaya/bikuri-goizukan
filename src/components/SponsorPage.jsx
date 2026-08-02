import { sponsor } from '../config.js';

/**
 * SponsorPage —— 赞助页（导航入口，非弹窗）。
 * 布局与 sponsor.html 一致：左猫图 + 右双码 + 猫飯朱印。
 */
export default function SponsorPage() {
  return (
    <div className="sponsor-page" style={{ maxWidth: 'min(920px, 100%)', marginInline: 'auto' }}>
      <section>
        <p className="eyebrow">スポンサー <span className="zh">赞助 · Sponsor</span></p>
        <h2 className="sec-title" lang="ja">この図鑑、役に立ってますか？</h2>
        <p className="sec-sub" lang="zh-CN">
          如果它对你有帮助，欢迎<b>赞助一点</b> —— 它会变成我家猫的猫粮。图鉴本身永远免费，随意使用就好。
        </p>
      </section>

      <div className="sp-page-grid">
        <div className="sp-pg-photo">
          <img src={sponsor.photo} alt="家里的猫" />
          <span className="sp-tape"></span>
          <figure className="sp-polaroid">
            <img src={sponsor.polaroid} alt="另一只猫" />
            <small>うちの猫</small>
          </figure>
        </div>
        <div className="sp-pg-body">
          <div className="sp-title-row">
            <h3 className="sp-title" lang="zh-CN">{sponsor.title}</h3>
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
            <span className="sp-thanks">{sponsor.thanks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
