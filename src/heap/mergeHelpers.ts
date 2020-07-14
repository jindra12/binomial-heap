import { Heap, Tree } from "../types";
import { preSanityCheck, sanityCheck } from "./comparators";
import { readMin } from "./traverseHelpers";

export const flattenTree = <T>(tree: Tree<T>, acc: T[]) => {
    acc.push(tree.item);
    tree.children.forEach(child => flattenTree(child, acc));
}

export const flatten = <T>(heap: Array<Tree<T>>): T[] => heap.reduce((p: T[], c) => {
    flattenTree(c, p);
    return p;
}, []);

export const failedMerge = <T>(a: Array<Tree<T>>, compare: (a: T, b: T) => number, getMin: (params: number) => void): Array<Tree<T>> => [
    ...flatten(a),
].reduce((p: Array<Tree<T>>, c) => mergeHeaps(p, [[c]] as any, compare, getMin), []);

export const mergeHeaps = <T>(a: Array<Tree<T>>, b: Array<Tree<T>>, compare: (a: T, b: T) => number, getMin: (params: number) => void): Array<Tree<T>> => {
    const mergingQueue: Array<Tree<T>> = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] !== undefined && b[i] === undefined) {
            mergingQueue.push(a[i]);
        }
        else if (b[i] !== undefined && a[i] === undefined) {
            mergingQueue.push(b[i]);
        }
        else if (a[i].children.length < b[i].children.length) {
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
            if (next.children.length === tree.children.length && (!further || further.children.length !== next.children.length)) {
                mergingQueue[i + 1] = mergeTree(tree, next, compare);
                delete mergingQueue[i];
            }
        }
    });
    return readMin(mergingQueue.filter(tree => tree !== undefined), compare, getMin);
};

export const mergeFunctionImpl = <T, E>(heap: Heap<T>, items: Array<Tree<E>>, compare: ((a: T | E, b: T | E) => number), disableSanityCheck: boolean) => {
    heap.compareFunction = compare;
    const merged = mergeHeaps<T | E>(
        heap.items,
        items,
        compare,
        min => heap.minimum = min as any,
    ) as Array<Tree<T>>;
    return disableSanityCheck 
        || preSanityCheck(heap.items, items)
        || sanityCheck(merged, compare) ? merged : failedMerge(merged, compare, min => heap.minimum = min); 
};

export const mergeTree = <T>(
    a: Tree<T>,
    b: Tree<T>,
    compare: (a: T, b: T) => number,
): Tree<T> => {
    if (compare(a.item, b.item) < 0){
        b.children.push(a);
        return b;  
    }
    a.children.push(b);
    return a;
};

