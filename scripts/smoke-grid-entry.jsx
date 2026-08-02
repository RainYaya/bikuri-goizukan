/**
 * smoke-grid-entry.jsx —— 冒烟测试辅助：脱离 App 状态机，直接渲染 GridMap（点亮 / 全図 两种模式）。
 * 用法见 scripts/smoke.mjs。
 */
import GridMap from '../src/components/GridMap.jsx';
import { NavContext } from '../src/lib/nav.jsx';

export function renderGrid(overrides = {}) {
  const nav = {
    state: { cls: 'all', word: null, mode: 'lit', domain: 'map', ...overrides },
    openWord() {}, setCls() {}, setMode() {}, setShelfMode() {},
  };
  return (
    <NavContext.Provider value={nav}>
      <GridMap />
    </NavContext.Provider>
  );
}
