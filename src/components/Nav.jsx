import { useNav } from '../lib/nav.jsx';

export default function Nav() {
  const { state, openShelves, openMap } = useNav();
  return (
    <nav className="nav" aria-label="图鉴导航">
      <button className={state.domain === 'shelf' ? 'cur' : ''} data-act="shelf" onClick={openShelves}>収蔵棚</button>
      <button className={state.domain === 'map' ? 'cur' : ''} data-act="map" onClick={openMap}>交差点図</button>
      <span className="nav-hint">収蔵棚 = 按系看词（棚・卡片两种摆法一键切换）· 交差点図 = 前項×後項 格子</span>
    </nav>
  );
}
