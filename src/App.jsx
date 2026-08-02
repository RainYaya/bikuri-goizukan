/**
 * App.jsx —— 应用外壳与状态机。
 *
 * 状态：{ view, word, series, cls, origin }
 *   view    : 'home' | 'serieslib' | 'series' | 'word'
 *   word    : 当前词条 id（view='word' 时）
 *   series  : 当前系 id（view='series' 时）
 *   cls     : 构词分类过滤（'all' | '①'..'⑤'），跨视图保留
 *   origin  : 词卡是从哪打开的（'home' | 'serieslib' | 'series:<id>'），决定「← 回到」按钮去向
 *
 * hash 路由与原版一致用 history.replaceState（不产生浏览器历史，返回靠站内「←」按钮）。
 */
import { useCallback, useEffect, useState } from 'react';
import { WORDS } from './lib/data.js';
import { NavContext, inSeriesDomain } from './lib/nav.jsx';
import Nav from './components/Nav.jsx';
import Cover from './components/Cover.jsx';
import GridMap from './components/GridMap.jsx';
import Stage from './components/Stage.jsx';
import DonateModal from './components/DonateModal.jsx';
import { site } from './config.js';

function parseHash(h) {
  const key = (h || '').replace(/^#/, '');
  const base = { view: 'home', word: null, series: null, origin: null, cls: 'all' };
  if (!key) return base;
  if (key === 'serieslib') return { ...base, view: 'serieslib' };
  if (key.indexOf('series-') === 0) return { ...base, view: 'series', series: key.slice(7) };
  if (WORDS[key]) return { ...base, view: 'word', word: key };
  return base;
}

function hashFor(state) {
  if (state.view === 'series') return '#series-' + state.series;
  if (state.view === 'serieslib') return '#serieslib';
  if (state.view === 'word') return '#' + state.word;
  return '';
}

export default function App() {
  const [state, setState] = useState(() => parseHash(window.location.hash));

  /* 系別域：切换 body.in-series，隐藏 cover / grid-map */
  useEffect(() => {
    document.body.classList.toggle('in-series', inSeriesDomain(state));
  }, [state]);

  /* 地址栏 hash 变化（手动输入 / 外部直达）：重新解析 */
  useEffect(() => {
    const onHash = () => setState((prev) => ({ ...parseHash(window.location.hash), cls: prev.cls }));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((next) => {
    setState((prev) => {
      const merged = { ...prev, ...next };
      history.replaceState(null, '', hashFor(merged));
      return merged;
    });
  }, []);

  const openWord = useCallback((id, origin) => {
    if (!WORDS[id]) return;
    navigate({ view: 'word', word: id, series: null, origin: origin || 'home' });
  }, [navigate]);

  const openSeries = useCallback((id) => {
    navigate({ view: 'series', series: id, word: null, origin: null });
  }, [navigate]);

  const openSeriesLib = useCallback(() => {
    navigate({ view: 'serieslib', series: null, word: null, origin: null });
  }, [navigate]);

  const openHome = useCallback(() => {
    navigate({ view: 'home', word: null, series: null, origin: null });
  }, [navigate]);

  const setCls = useCallback((cls) => {
    setState((prev) => ({ ...prev, cls }));
  }, []);

  /* 展示区「← 回到」按钮（与原版 setCrumb / sb-back 逻辑一致） */
  const goBack = useCallback(() => {
    if (state.view === 'word') {
      if (state.origin && state.origin.indexOf('series:') === 0) openSeries(state.origin.slice(7));
      else if (state.origin === 'serieslib') openSeriesLib();
      else openHome();
    } else if (state.view === 'series') {
      openSeriesLib();
    }
  }, [state, openSeries, openSeriesLib, openHome]);

  const nav = { state, openWord, openSeries, openSeriesLib, openHome, goBack, setCls };

  return (
    <NavContext.Provider value={nav}>
      <div className="wrap">
        <Nav />
        <Cover />
        <GridMap />
        <Stage />
        <div className="footer">
          <span>{site.footer[0]}</span>
          <span>{site.footer[1]}</span>
        </div>
      </div>
      <DonateModal />
    </NavContext.Provider>
  );
}
