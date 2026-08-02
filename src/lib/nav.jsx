/**
 * nav.jsx —— 导航 Context。
 * App 通过 NavContext 向下提供：state、openWord、openSeries、openSeriesLib、openHome、goBack。
 * 任何视图组件用 useNav() 取到后即可跳转（等价于原单文件版的全局函数 + 事件委托）。
 */
import { createContext, useContext } from 'react';

export const NavContext = createContext(null);

export function useNav() {
  return useContext(NavContext);
}

/* 是否处于「系別域」：此时 cover 会被 body.in-series 隐藏 */
export function inSeriesDomain(state) {
  return state.view === 'series' || (state.view === 'word' && state.backSeries);
}
