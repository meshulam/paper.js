import { Base } from './Base';
import { PaperScope } from './PaperScope';

import Numerical from '../util/Numerical';

var Key, DomEvent, DomElement, SymbolDefinition, SymbolItem;

export const GlobalScope = new (PaperScope.inject(Base.exports, {
    Base: Base,
    Numerical: Numerical,
    Key: Key,
    DomEvent: DomEvent,
    DomElement: DomElement,
    // Export jsdom document and window too, for Node.js
    document: document,
    window: window,
    // TODO: Remove in 1.0.0? (deprecated January 2016):
    Symbol: SymbolDefinition,
    PlacedSymbol: SymbolItem
}))();
