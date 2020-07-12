import { Heap } from '../types';
import { getDefaultComparator, getIndex, sanityCheck, typeComparisonAnalyzer, mergeComparators } from './comparators';
import { getRoots, treeClimb } from './traverseHelpers';
import { mergeHeaps, mergeFunctionImpl, failedMerge } from './mergeHelpers';

export const heap = <T>(
    items: T[],
    compare?: (a: T, b: T) => number,
): Heap<T> => {
    let minCarry: [number, number] | null = null;
    const inputAnalysis = !compare ? typeComparisonAnalyzer(items) : 'string';
    const trueCompare = (compare || getDefaultComparator<T>(inputAnalysis)) as any;
    const heapImpl: Heap<T> = {
        items: items.length > 0 ? items.reduce((p: T[][], c) => mergeHeaps(p, [[c]], trueCompare, min => minCarry = min), []) : [[]],
        compare: compareFunction => {
            heapImpl.compareFunction = compareFunction;
            if (!sanityCheck(heapImpl.items, compareFunction)) {
                heapImpl.items = failedMerge(heapImpl.items, compareFunction, min => heapImpl.minimum = min);
            }
            return heapImpl;
        },
        merge: (withHeap, compare, disableSanityCheck) => {
            const nextAnalysis = mergeComparators(heapImpl.kindOfCompare, withHeap.kindOfCompare);
            const nextCompare = compare || getDefaultComparator<T>(nextAnalysis);
            heapImpl.items = mergeFunctionImpl(heapImpl, withHeap.items, nextCompare as any, disableSanityCheck || false);
            heapImpl.kindOfCompare = nextAnalysis;
            return heapImpl as any;
        },
        compareFunction: trueCompare,
        minimum: minCarry || [0, 0],
        min: () => heapImpl.items[heapImpl.minimum[0]] ? heapImpl.items[heapImpl.minimum[0]][heapImpl.minimum[1]] || null : null,
        push: (item, compare, disableSanityCheck) => {
            heapImpl.items = mergeFunctionImpl(heapImpl, [[item]], compare || heapImpl.compareFunction as any, disableSanityCheck || false);
            return heapImpl as any;
        },
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
        kindOfCompare: inputAnalysis,
    };
    return heapImpl as any;
};
