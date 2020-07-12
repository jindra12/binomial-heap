import { Heap } from "../types";
import { getDefaultComparator, preSanityCheck, sanityCheck } from "./comparators";
import { readMin } from "./traverseHelpers";

export const flatten = <T>(heap: T[][]): T[] => heap.reduce((p: T[], c) => {
    c.forEach(item => p.push(item));
    return p;
}, []);

export const failedMerge = <T>(a: T[][], b: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void): T[][] => [
    ...flatten(a),
    ...flatten(b),
].reduce((p: T[][], c) => mergeHeaps(p, [[c]], compare, getMin, false), []);

export const mergeHeaps = <T>(a: T[][], b: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void, failedSanityCheck?: boolean): T[][] => {
    if (failedSanityCheck) {
        return failedMerge(a, b, compare, getMin);
    }
    const mergingQueue: T[][] = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] !== undefined && b[i] === undefined) {
            mergingQueue.push(a[i]);
        }
        else if (b[i] !== undefined && a[i] === undefined) {
            mergingQueue.push(b[i]);
        }
        else if (a[i].length < b[i].length) {
            mergingQueue.push(a[i]);
            mergingQueue.push(b[i]);
        } else {
            mergingQueue.push(b[i]);
            mergingQueue.push(a[i]);
        }
    }
    mergingQueue.forEach((tree, i) => {
        const next = mergingQueue[i + 1];
        if (next) {
            const further = mergingQueue[i + 2];
            if (next.length === tree.length && (!further || further.length !== next.length)) {
                mergingQueue[i + 1] = mergeTree(tree, next, compare);
                delete mergingQueue[i];
            }
        }
    });
    return readMin(mergingQueue.filter(tree => tree !== undefined), compare, getMin);
};

export const mergeFunctionImpl = <T, E>(heap: Heap<T>, items: E[][], compare: ((a: T | E, b: T | E) => number) | undefined, disableSanityCheck: boolean) => {
    const trueCompare = compare || getDefaultComparator<T | E>();
    return mergeHeaps<T | E>(
        heap.items,
        items,
        trueCompare,
        min => heap.minimum = min,
        !disableSanityCheck
            || preSanityCheck(heap.items, items)
            || (sanityCheck(heap.items, trueCompare) && sanityCheck(items, trueCompare)),
    ) as T[][]
};

export const mergeTree = <T>(
    a: T[],
    b: T[],
    compare: (a: T, b: T) => number,
): T[] => compare(a[0], b[0]) < 0 ? b.reduce((p, c) => {
    p.push(c);
    return p;
}, a) : a.reduce((p, c) => {
    p.push(c);
    return p
}, b);

