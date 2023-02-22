/** @typedef {typeof __propDef.props}  EntryProps */
/** @typedef {typeof __propDef.events}  EntryEvents */
/** @typedef {typeof __propDef.slots}  EntrySlots */
export default class Entry extends SvelteComponentTyped<{
    entry: Entry;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type EntryProps = typeof __propDef.props;
export type EntryEvents = typeof __propDef.events;
export type EntrySlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        entry: Entry;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
