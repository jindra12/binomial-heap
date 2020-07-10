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
].reduce((p: T[][], c) => mergeHeaps(p, [[c]], compare, getMin, true), []);

export const mergeHeaps = <T>(a: T[][], b: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void, failedSanityCheck?: boolean): T[][] => {
    if (!failedSanityCheck) {
        return failedMerge(a, b, compare, getMin);
    }
    const mergingQueue: T[][] = [];
    a.forEach((aTree) => {
        b.forEach((bTree) => {
            mergingQueue.push(aTree);
            mergingQueue.push(bTree);
        });
    });
    mergingQueue.forEach((tree, i) => {
        const next = mergingQueue[i + 1];
        if (next) {
            const further = mergingQueue[i + 2];
            if (next.length === tree.length && further.length !== next.length) {
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
): T[] => compare(a[0], b[0]) >= 1 ? b.reduce((p, c) => {
    p.push(c);
    return p;
}, a) : a.reduce((p, c) => {
    p.push(c);
    return p
}, b);
