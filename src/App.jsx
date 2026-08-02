/**
 * App.jsx —— 应用外壳与状态机（新版本：収蔵棚 / 交差点図 双域）。
 *
 * 状态：{ view, domain, word, series, backSeries, cls, mode, shelfMode }
 *   domain    : 'shelf'（収蔵棚）| 'map'（交差点図）—— 顶层导航
 *   view      : 'shelf' | 'map' | 'series' | 'word'
 *   word      : 当前词条 id（view='word'）
 *   series    : 当前系 id（view='series'）
 *   backSeries: 从哪个系打开的词卡（返回键 → 系総覧）
 *   cls       : 构词分类过滤（'all' | '①'..'⑤'）
 *   mode      : 'lit'（点亮模式，分巻剪枝）| 'full'（全図点阵）
 *   shelfMode : 'shelves'（棚表示）| 'cards'（卡片表示）
 *
 * hash 路由与原版一致用 history.replaceState。默认进入 収蔵棚。
 */
import { useCallback, useEffect, useState } from 'react';
import { WORDS } from './lib/data.js';
import { NavContext } from './lib/nav.jsx';
import Nav from './components/Nav.jsx';
import Cover from './components/Cover.jsx';
import GridMap from './components/GridMap.jsx';
import Stage from './components/Stage.jsx';
import TourOverlay from './components/TourOverlay.jsx';
import { site, tour } from './config.js';

const BASE = { view: 'shelf', domain: 'shelf', word: null, series: null, backSeries: null, cls: 'all', mode: 'lit', shelfMode: 'shelves', tourStep: -1, _gotoSponsor: false };

function parseHash(h) {
  const key = (h || '').replace(/^#/, '');
  if (!key) return { ...BASE };
  if (key === 'map') return { ...BASE, view: 'map', domain: 'map' };
  if (key === 'sponsor') return { ...BASE, view: 'sponsor' };
  if (key.indexOf('series-') === 0) return { ...BASE, view: 'series', series: key.slice(7) };
  if (WORDS[key]) return { ...BASE, view: 'word', word: key };
  return { ...BASE };
}

function hashFor(state) {
  if (state.view === 'map') return '#map';
  if (state.view === 'sponsor') return '#sponsor';
  if (state.view === 'series') return '#series-' + state.series;
  if (state.view === 'word') return '#' + state.word;
  return '';
}

export default function App() {
  const [state, setState] = useState(() => parseHash(window.location.hash));

  /* body 类：in-series（藏封面）· map-view（显交差点図）。shelf 域默认藏 #grid-map */
  useEffect(() => {
    const inSeries = state.view === 'series' || (state.view === 'word' && state.backSeries);
    const mapView = state.domain === 'map' && !inSeries;
    document.body.classList.toggle('in-series', inSeries);
    document.body.classList.toggle('map-view', mapView);
  }, [state]);

  useEffect(() => {
    const onHash = () => setState((prev) => ({ ...parseHash(window.location.hash), cls: prev.cls, mode: prev.mode, shelfMode: prev.shelfMode }));
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

  const openShelves = useCallback(() => {
    navigate({ view: 'shelf', domain: 'shelf', word: null, series: null, backSeries: null });
  }, [navigate]);

  const openMap = useCallback(() => {
    navigate({ view: 'map', domain: 'map', word: null, series: null, backSeries: null });
  }, [navigate]);

  const openSeries = useCallback((id) => {
    navigate({ view: 'series', series: id, word: null, backSeries: null });
  }, [navigate]);

  const openWord = useCallback((id) => {
    if (!WORDS[id]) return;
    setState((prev) => {
      const fromSeries = prev.view === 'series' || (prev.view === 'word' && prev.backSeries);
      const merged = { ...prev, view: 'word', word: id, series: null, backSeries: fromSeries ? prev.backSeries : null };
      history.replaceState(null, '', hashFor(merged));
      return merged;
    });
  }, []);

  const setCls = useCallback((cls) => { setState((prev) => ({ ...prev, cls })); }, []);
  const setMode = useCallback((mode) => { setState((prev) => ({ ...prev, mode })); }, []);
  const setShelfMode = useCallback((shelfMode) => {
    setState((prev) => ({ ...prev, shelfMode }));
  }, []);

  const openSponsor = useCallback(() => {
    navigate({ view: 'sponsor', word: null, series: null, backSeries: null });
  }, [navigate]);

  /* Tour */
  const startTour = useCallback(() => {
    setState((prev) => ({ ...prev, tourStep: 0 }));
  }, []);
  const nextTour = useCallback(() => {
    setState((prev) => {
      const n = prev.tourStep + 1;
      if (n >= tour.steps.length) {
        try { localStorage.setItem(tour.dismissKey, '1'); } catch (e) { /* 忽略 */ }
        /* 先结束 Tour（移除遮罩），再通过 effect 跳赞助页——不在 updater 内调 navigate */
        return { ...prev, tourStep: -1, _gotoSponsor: true };
      }
      return { ...prev, tourStep: n, _gotoSponsor: false };
    });
  }, []);
  /* 最后一步「去看看」→ 遮罩移除后跳赞助页 */
  useEffect(() => {
    if (state._gotoSponsor) {
      setState((prev) => ({ ...prev, _gotoSponsor: false }));
      openSponsor();
    }
  }, [state._gotoSponsor, openSponsor]);
  const prevTour = useCallback(() => {
    setState((prev) => ({ ...prev, tourStep: Math.max(0, prev.tourStep - 1) }));
  }, []);
  /* 自动切视图：tour 步骤的 view 字段决定当前应处于的域 */
  useEffect(() => {
    if (state.tourStep < 0) return;
    const step = tour.steps[state.tourStep];
    if (!step || !step.view) return;
    if (step.view === 'map' && state.domain !== 'map') openMap();
    else if (step.view === 'shelf' && state.domain !== 'shelf') openShelves();
  }, [state.tourStep, state.domain, openMap, openShelves]);
  const endTour = useCallback(() => {
    try { localStorage.setItem(tour.dismissKey, '1'); } catch (e) { /* 忽略 */ }
    setState((prev) => ({ ...prev, tourStep: -1 }));
  }, []);

  /* 首次访问自动弹出 Tour（非 hash 直达时） */
  useEffect(() => {
    if (!tour.autoStart) return;
    let seen = false;
    try { seen = !!localStorage.getItem(tour.dismissKey); } catch (e) { /* 忽略 */ }
    if (!seen && !window.location.hash) startTour();
  }, [startTour]);

  const goBack = useCallback(() => {
    if (state.view === 'word') {
      if (state.backSeries) openSeries(state.backSeries);
      else if (state.domain === 'map') openMap();
      else openShelves();
    } else if (state.view === 'series') {
      if (state.domain === 'map') openMap();
      else openShelves();
    } else if (state.view === 'sponsor') {
      openShelves();
    }
  }, [state, openSeries, openMap, openShelves]);

  const nav = { state, openWord, openSeries, openShelves, openMap, openSponsor, startTour, goBack, setCls, setMode, setShelfMode };

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
      {state.tourStep >= 0 && <TourOverlay step={state.tourStep} onNext={nextTour} onPrev={prevTour} onEnd={endTour} />}
    </NavContext.Provider>
  );
}
