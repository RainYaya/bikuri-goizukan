import { useNav, inSeriesDomain } from '../lib/nav.jsx';

export default function Nav() {
  const { state, openHome, openSeriesLib } = useNav();
  const inSeries = inSeriesDomain(state);
  return (
    <nav className="nav" aria-label="图鉴导航">
      <button className={!inSeries ? 'cur' : ''} data-act="home" onClick={openHome}>総索引</button>
      <button className={inSeries ? 'cur' : ''} data-act="serieslib" onClick={openSeriesLib}>系別</button>
      <span className="nav-hint">総索引看词（格子图）· 系別看线（家族图景）</span>
    </nav>
  );
}
