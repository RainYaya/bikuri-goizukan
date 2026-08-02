import { useEffect, useState, useCallback, useRef } from 'react';
import { tour } from '../config.js';

/**
 * TourOverlay —— Spotlight 新手指引。
 *
 * 原理：固定全屏遮罩（clip-path 在目标元素处挖洞），旁边浮 tooltip 卡片。
 * 每步对应 config.js tour.steps[i]，切换步骤时自动滚到目标位置。
 */

/* tooltip 位置：优先右 → 下 → 左 → 上 */
function calcPos(rect, tipW, tipH) {
  const GAP = 14;
  let x = rect.right + GAP;
  let y = rect.top;
  if (x + tipW > window.innerWidth - 12) x = rect.left - tipW - GAP;
  if (x < 12) x = 12;
  if (y + tipH > window.innerHeight - 12) y = rect.bottom - tipH;
  if (y < 12) y = 12;
  return { x, y };
}

export default function TourOverlay({ step, onNext, onPrev, onEnd }) {
  const [hole, setHole] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [tip, setTip] = useState({ x: 100, y: 60 });
  const [ready, setReady] = useState(false);
  const tipRef = useRef(null);
  const padding = 8; // 挖洞边距

  const s = tour.steps[step];
  const isLast = step === tour.steps.length - 1;

  const updatePos = useCallback(() => {
    const el = document.querySelector(s.target);
    if (!el) { setReady(false); return; }
    const r = el.getBoundingClientRect();
    setHole({ x: r.left - padding, y: r.top - padding, w: r.width + padding * 2, h: r.height + padding * 2 });
    setReady(true);
  }, [s.target]);

  useEffect(() => {
    /* 先滚到目标位置再定位 tooltip */
    const t1 = setTimeout(() => {
      const el = document.querySelector(s.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(updatePos, 300); // 等 scrollIntoView 动画播完
    }, 200); // 等视图切换 DOM 渲染完
    let ro;
    try {
      const el = document.querySelector(s.target);
      if (el && window.ResizeObserver) {
        ro = new ResizeObserver(updatePos);
        ro.observe(el);
        ro.observe(document.body);
      }
    } catch (e) { /* 忽略 */ }
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      clearTimeout(t1);
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [updatePos, s.target]);

  /* tooltip 位置跟随挖洞 */
  useEffect(() => {
    if (!ready || !tipRef.current) return;
    const tipW = tipRef.current.offsetWidth;
    const tipH = tipRef.current.offsetHeight;
    setTip(calcPos(hole, tipW, tipH));
  }, [ready, hole]);

  const clip = ready
    ? `polygon(0% 0%, 0% 100%, ${hole.x}px 100%, ${hole.x}px ${hole.y}px, ${hole.x + hole.w}px ${hole.y}px, ${hole.x + hole.w}px ${hole.y + hole.h}px, ${hole.x}px ${hole.y + hole.h}px, ${hole.x}px 100%, 100% 100%, 100% 0%)`
    : 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)';

  return (
    <div className="tour-ovl" onClick={onEnd}>
      <div className="tour-mask" style={{ clipPath: clip }} onClick={(e) => e.stopPropagation()} />
      {ready && (
        <div className="tour-tip" ref={tipRef} style={{ left: tip.x, top: tip.y }} onClick={(e) => e.stopPropagation()}>
          <div className="tour-tip-head">
            <span className="tour-tip-step">{step + 1} / {tour.steps.length}</span>
            <h3 className="tour-tip-title">{s.title}</h3>
          </div>
          <p className="tour-tip-body">{s.body}</p>
          <div className="tour-tip-foot">
            <button className="sp-btn" onClick={onEnd}>跳过</button>
            <span style={{ flex: 1 }} />
            {step > 0 && <button className="sp-btn" onClick={onPrev}>上一步</button>}
            <button className="sp-btn tour-btn-next" onClick={onNext}>
              {isLast ? '去看看' : '下一步'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
