import { rowSeries, colSeries } from '../lib/data.js';
import Home from './Home.jsx';
import GenericSeries from './series/GenericSeries.jsx';
import ToriSeries from './series/ToriSeries.jsx';
import KaesuSeries from './series/KaesuSeries.jsx';
import KomuSeries from './series/KomuSeries.jsx';
import DashiSeries from './series/DashiSeries.jsx';
import OshimuSeries from './series/OshimuSeries.jsx';
import YugoSeries from './series/YugoSeries.jsx';

/**
 * SeriesView —— 系总览分发。
 * 有定制页的 6 个系走专属组件；其余行/列系自动走 GenericSeries（无需改代码即可扩展新系）。
 */
export default function SeriesView({ id }) {
  if (id === 'tori') return <ToriSeries />;
  if (id === 'kaesu') return <KaesuSeries />;
  if (id === 'komu') return <KomuSeries />;
  if (id === 'dashi') return <DashiSeries />;
  if (id === 'oshimu') return <OshimuSeries />;
  if (id === 'yugo') return <YugoSeries />;
  if (rowSeries(id)) return <GenericSeries kind="row" id={id} />;
  if (colSeries(id)) return <GenericSeries kind="col" id={id} />;
  return <Home />;
}
