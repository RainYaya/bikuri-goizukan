import { useEffect, useRef } from 'react';
import { WORDS, seriesName } from '../lib/data.js';
import { useNav } from '../lib/nav.jsx';
import Home from './Home.jsx';
import SeriesLib from './SeriesLib.jsx';
import SeriesView from './SeriesView.jsx';
import SpecimenCard from './SpecimenCard.jsx';
import PendingCard from './PendingCard.jsx';

function crumbText(state) {
  if (state.view === 'serieslib') return '系別図鑑';
  if (state.view === 'series') return '系総覧 · ' + seriesName(state.series);
  if (state.view === 'word') return '詞目 · ' + (WORDS[state.word] ? WORDS[state.word].word : state.word);
  return '総索引';
}

function backLabel(state) {
  if (state.view === 'series') return '← 回到系別';
  if (state.view === 'word' && state.origin && state.origin.indexOf('series:') === 0) return '← 回到系総覧';
  return '← 回到地図';
}

function renderView(state) {
  if (state.view === 'word') {
    const w = WORDS[state.word];
    if (!w) return <Home />;
    return w.status === 'collected' ? <SpecimenCard w={w} /> : <PendingCard w={w} />;
  }
  if (state.view === 'series') return <SeriesView id={state.series} />;
  if (state.view === 'serieslib') return <SeriesLib />;
  return <Home />;
}

export default function Stage() {
  const { state, goBack } = useNav();
  const viewRef = useRef(null);
  const showBack = state.view === 'word' || state.view === 'series';

  /* 进入词卡 / 系总览 / 系别库时，把展示区滚到可视区域（与原版 scrollToStage 一致；首页不滚） */
  useEffect(() => {
    if (state.view === 'home') return;
    const el = viewRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [state.view, state.word, state.series]);

  return (
    <div className="stage">
      <div className="stage-bar">
        <span className="sb-label">展示区</span>
        <span className="sb-crumb" id="sb-crumb">{crumbText(state)}</span>
        {showBack && (
          <button className="sb-back" id="sb-back" onClick={goBack}>{backLabel(state)}</button>
        )}
      </div>
      <div id="view-root" className="view" ref={viewRef}>{renderView(state)}</div>
    </div>
  );
}
