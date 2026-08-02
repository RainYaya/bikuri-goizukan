import { useEffect, useRef } from 'react';
import { WORDS, seriesName } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';
import Home from './Home.jsx';
import Shelves from './Shelves.jsx';
import SeriesLib from './SeriesLib.jsx';
import SeriesView from './SeriesView.jsx';
import SpecimenCard from './SpecimenCard.jsx';
import PendingCard from './PendingCard.jsx';
import SponsorPage from './SponsorPage.jsx';

function crumbText(state) {
  if (state.view === 'shelf') return state.shelfMode === 'cards' ? '収蔵棚 · 卡片表示' : '収蔵棚';
  if (state.view === 'sponsor') return '赞助';
  if (state.view === 'map') return '交差点図';
  if (state.view === 'series') return '系総覧 · ' + seriesName(state.series);
  if (state.view === 'word') return '詞目 · ' + (WORDS[state.word] ? WORDS[state.word].word : state.word);
  return '収蔵棚';
}

function backLabel(state) {
  if (state.view === 'word' && state.backSeries) return '← 回到系総覧';
  if (state.view === 'sponsor') return '← 回到収蔵棚';
  return state.domain === 'map' ? '← 回到交差点図' : '← 回到収蔵棚';
}

function renderView(state) {
  if (state.view === 'sponsor') return <SponsorPage />;
  if (state.view === 'word') {
    const w = WORDS[state.word];
    if (!w) return <Home />;
    return w.status === 'collected' ? <SpecimenCard w={w} /> : <PendingCard w={w} />;
  }
  if (state.view === 'series') return <SeriesView id={state.series} />;
  if (state.view === 'map') return <Home />;
  return state.shelfMode === 'cards' ? <SeriesLib /> : <Shelves />;
}

export default function Stage() {
  const { state, goBack, setShelfMode } = useNav();
  const viewRef = useRef(null);
  const showBack = state.view === 'word' || state.view === 'series' || state.view === 'sponsor';
  const showShelfSwitch = state.domain === 'shelf' && state.view === 'shelf' && state.view !== 'sponsor';

  /* 进入任何视图都把展示区滚到可视区域（与原版 open* 全部 scrollToStage 一致） */
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [state.view, state.word, state.series, state.shelfMode]);

  return (
    <div className="stage">
      <div className="stage-bar">
        <span className="sb-label">展示区</span>
        <span className="sb-crumb" id="sb-crumb">{crumbText(state)}</span>
        {showShelfSwitch && (
          <div className="shelf-switch" id="shelf-switch" data-tour="shelf-switch" aria-label="収蔵棚显示方式">
            <span className="sw-label">表示</span>
            <button className={'fbtn' + (state.shelfMode === 'shelves' ? ' on' : '')} data-shelf-mode="shelves" onClick={() => setShelfMode('shelves')}>棚表示</button>
            <button className={'fbtn' + (state.shelfMode === 'cards' ? ' on' : '')} data-shelf-mode="cards" onClick={() => setShelfMode('cards')}>卡片表示</button>
          </div>
        )}
        {showBack && (
          <button className="sb-back" id="sb-back" onClick={goBack}>{backLabel(state)}</button>
        )}
      </div>
      <div id="view-root" className="view" ref={viewRef}>{renderView(state)}</div>
    </div>
  );
}
