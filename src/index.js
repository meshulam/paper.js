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
export { SymbolItem } from './item/SymbolItem';
export { SymbolDefinition } from './item/SymbolDefinition';
export { HitResult } from './item/HitResult';

export { Color } from './style/Color';
export { Style } from './style/Style';
export { Gradient } from './style/Gradient';
export { GradientStop } from './style/GradientStop';


export { PointText } from './text/PointText';
export { TextItem } from './text/TextItem';

export { PathItem } from './path/PathItem';
export { Path } from './path/Path';
export { CompoundPath } from './path/CompoundPath';
export { Curve } from './path/Curve';
export { Segment } from './path/Segment';

export { GlobalScope as paper } from './core/GlobalScope';

import { Item } from './item/Item';
import { Project } from './item/Project';
import { Path } from './path/Path';
import { Shape } from './item/Shape';
import { PathItem } from './path/PathItem';
import { Base } from './core/Base';
import { PaperScope } from './core/PaperScope';
import { DomEvent } from './dom/DomEvent';
import { DomElement } from './dom/DomElement';
import Numerical from './util/Numerical';


/// Add Item#rasterize()
import { injectRasterize } from './item/Item.Rasterize';
injectRasterize(Item);

/// Add Path.Circle, Path.Rectangle, etc
import { injectConstructors } from './path/Path.Constructors';
injectConstructors(Path);

// Path.Rectangle so Item can do proper intersection checks
Item.inject({ statics: { _PathRectangle: Path.Rectangle } });

/// Add style getters/setters on Item
import { injectStyleAccessors } from './style/Style';
injectStyleAccessors(Item);

/// Inject PathItem.create factory
import './path/PathItem.Create';

/// Inject _jItem helpers for intersects()
import { injectAsPathItemHelpers } from './path/AsPathItemHelpers';
injectAsPathItemHelpers(Shape);

/// Add PathItem boolean operations
import { injectBoolean } from './path/PathItem.Boolean';
injectBoolean(PathItem);

/// Add Project-specific hit test fns
import { injectHitTestFnsToProject } from './item/Item';
injectHitTestFnsToProject(Project);

/// add exportSVG/importSVG methods
import { injectSvgExport } from './svg/SvgExport';
import { injectSvgImport } from './svg/SvgImport';
injectSvgExport(Project, Item);
injectSvgImport(Project, Item);

var Key;

PaperScope.inject(Base.exports, {
  Base: Base,
  Numerical: Numerical,
  Key: Key,
  DomEvent: DomEvent,
  DomElement: DomElement,
  // Export jsdom document and window too, for Node.js
  // document: document,
  // window: window,
});
