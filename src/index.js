export { Base } from './core/Base';
export { GlobalScope } from './core/GlobalScope';

export { Line } from './basic/Line';
export { Matrix } from './basic/Matrix';
export { Point } from './basic/Point';
export { Rectangle } from './basic/Rectangle';
export { Size } from './basic/Size';

export { Group } from './item/Group';
export { Item } from './item/Item';
export { Layer } from './item/Layer';
export { Shape } from './item/Shape';
export { Project } from './item/Project';
export { Raster } from './item/Raster';
export { SymbolItem } from './Item/SymbolItem';

export { Color } from './style/Color';
export { Style } from './style/Style';
export { Gradient } from './style/Gradient';
export { GradientStop } from './style/GradientStop';


export { PointText } from './text/PointText';
export { TextItem } from './text/TextItem';

export { Path } from './path/Path';
export { PathItem } from './path/PathItem';
export { CompoundPath } from './path/CompoundPath';
export { Segment } from './path/Segment';

export { GlobalScope as paper } from './core/GlobalScope';

/// Add Item#rasterize()
import { Item } from './item/Item';
import { injectRasterize } from './item/Item.Rasterize';
injectRasterize(Item);

/// Add Path.Circle, Path.Rectangle, etc
import { Path } from './path/Path';
import { injectConstructors } from './path/Path.Constructors';
injectConstructors(Path);


///
import { Base } from './core/Base';
import { PaperScope } from './core/PaperScope';

import Numerical from './util/Numerical';

var Key, DomEvent, DomElement;

PaperScope.inject(Base.exports, {
  Base: Base,
  Numerical: Numerical,
  Key: Key,
  DomEvent: DomEvent,
  DomElement: DomElement,
  // Export jsdom document and window too, for Node.js
  // document: document,
  // window: window,
  // TODO: Remove in 1.0.0? (deprecated January 2016):
  // Symbol: SymbolDefinition,
  // PlacedSymbol: SymbolItem
});
