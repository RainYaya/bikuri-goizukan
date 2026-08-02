import { useNav } from '../lib/nav.jsx';
import { tour } from '../config.js';

export default function Nav() {
  const { state, openShelves, openMap, openSponsor, startTour } = useNav();
  const tourSeen = (() => { try { return !!localStorage.getItem(tour.dismissKey); } catch (e) { return true; } })();
  return (
    <nav className="nav" aria-label="图鉴导航">
      <button className={state.domain === 'shelf' ? 'cur' : ''} data-act="shelf" onClick={openShelves}>収蔵棚</button>
      <button className={state.domain === 'map' ? 'cur' : ''} data-act="map" data-tour="nav-map" onClick={openMap}>交差点図</button>
      <button className={state.view === 'sponsor' ? 'cur' : ''} data-act="sponsor" data-tour="nav-sponsor" onClick={openSponsor}>赞助</button>
      {!tourSeen && (
        <button className="nav-tour-btn" onClick={startTour} title="新手指引" aria-label="新手指引">？</button>
      )}
      <span className="nav-hint">収蔵棚 = 按系看词（棚・卡片）· 交差点図 = 前項×後項 格子</span>
    </nav>
  );
}
