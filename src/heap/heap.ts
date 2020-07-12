import { Heap } from '../types';
import { getDefaultComparator, getIndex, sanityCheck } from './comparators';
import { getRoots, treeClimb } from './traverseHelpers';
import { mergeHeaps, mergeFunctionImpl, failedMerge } from './mergeHelpers';

export const heap = <T>(
    items: T[],
    compare: (a: T, b: T) => number = getDefaultComparator<T>(),
): Heap<T> => {
    let minCarry: [number, number] | null = null;
    const heapImpl: Heap<T> = {
        items: items.length > 0 ? items.reduce((p: T[][], c) => mergeHeaps(p, [[c]], compare as any, min => minCarry = min), []) : [[]],
        compare: compareFunction => {
            heapImpl.compareFunction = compareFunction;
            if (!sanityCheck(heapImpl.items, compareFunction)) {
                heapImpl.items = failedMerge(heapImpl.items, compareFunction, min => heapImpl.minimum = min);
            }
            return heapImpl;
        },
        merge: (withHeap, compare, disableSanityCheck) => {
            heapImpl.items = mergeFunctionImpl(heapImpl, withHeap.items, compare, disableSanityCheck || false);
            return heapImpl as any;
        },
        compareFunction: compare as any,
        minimum: minCarry || [0, 0],
        min: () => heapImpl.items[heapImpl.minimum[0]] ? heapImpl.items[heapImpl.minimum[0]][heapImpl.minimum[1]] || null : null,
        push: (<E>(item: E, compare?: any, disableSanityCheck?: boolean) => {
            heapImpl.items = mergeFunctionImpl(heapImpl, [[item]], compare, disableSanityCheck || false);
            return heapImpl;
        }) as any,
        equals: (otherHeap: Heap<T>) => heapImpl.items.length === otherHeap.items.length && otherHeap.items.reduce(
            (all: boolean, tree, i) => {
                if (!all) {
                    return false;
                }
                return tree.length === heapImpl.items[i].length && tree.reduce((branch: boolean, leaf, j) => {
                    if (!branch) {
                        return false;
                    }
                    return !heapImpl.compareFunction(leaf, heapImpl.items[i][j]);
                }, true);
            },
            true,
        ),
        pop: () => {
            if (heapImpl.items.length === 0) {
                return null;
            }
            const min = heapImpl.items[heapImpl.minimum[0]][heapImpl.minimum[1]];
            const roots = getRoots(heapImpl.items[heapImpl.minimum[0]]);
            heapImpl.items = heapImpl.items.filter((_, i) => heapImpl.minimum[0] !== i);
            roots.forEach(root => heapImpl.items = mergeFunctionImpl(heapImpl, [root], heapImpl.compareFunction, true));
            return min;
        },
        delete: toSeek => {
            const sought = getIndex(
                heapImpl.items,
                toSeek,
                heapImpl.compareFunction,
            );
            if (sought) {
                treeClimb(heapImpl.items, sought);
                return heapImpl.pop();
            }
            return null;
        },
        search: toSeek => {
            const sought = getIndex(
                heapImpl.items,
                toSeek,
                heapImpl.compareFunction,
            );
            if (sought) {
                return heapImpl.items[sought[0]][sought[1]];
            }
            return null;
        },
        sort: () => {
            const acc: T[] = [];
            let popped = heapImpl.pop();
            while (popped !== null) {
                acc.push(popped);
                popped = heapImpl.pop();
            }
            return acc;
        },

    };
    return heapImpl as any;
};
