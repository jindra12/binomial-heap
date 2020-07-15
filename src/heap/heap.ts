import { Heap, Tree } from '../types';
import { getDefaultComparator, getIndex, sanityCheck, typeComparisonAnalyzer, mergeComparators, equality } from './comparators';
import { treeClimb } from './traverseHelpers';
import { mergeHeaps, mergeFunctionImpl, failedMerge } from './mergeHelpers';

export const heap = <T>(
    items: T[],
    compare?: (a: T, b: T) => number,
): Heap<T> => {
    let minCarry: number = -1;
    const inputAnalysis = !compare ? typeComparisonAnalyzer(items) : 'string';
    const trueCompare = (compare || getDefaultComparator<T>(inputAnalysis)) as any;
    const heapImpl: Heap<T> = {
        items: items.length > 0 ? items.reduce((p: Array<Tree<T>>, c) => mergeHeaps(p, [{ parent: null, item: c, children: [] }], trueCompare, min => minCarry = min), []) : [],
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
            heapImpl.items = mergeFunctionImpl(heapImpl, withHeap.items, nextCompare as any, compare, disableSanityCheck || false);
            heapImpl.kindOfCompare = nextAnalysis;
            return heapImpl as any;
        },
        compareFunction: trueCompare,
        minimum: minCarry,
        min: () => heapImpl.items[heapImpl.minimum] ? heapImpl.items[heapImpl.minimum].item : null,
        push: (item, compare, disableSanityCheck) => {
            heapImpl.items = mergeFunctionImpl(
                heapImpl,
                [{ parent: null, item, children: [] }],
                compare || heapImpl.compareFunction as any,
                compare,
                disableSanityCheck || false,
            );
            return heapImpl as any;
        },
        equals: (otherHeap: Heap<T>): boolean => equality(heapImpl.items, otherHeap.items, heapImpl.compareFunction),
        pop: () => {
            if (heapImpl.items.length === 0) {
                return null;
            }
            const item = heapImpl.items[heapImpl.minimum].item;
            const roots = heapImpl.items[heapImpl.minimum].children;
            heapImpl.items = heapImpl.items.filter((_, i) => heapImpl.minimum !== i);
            roots.forEach(root => heapImpl.items = mergeFunctionImpl(heapImpl, [root], heapImpl.compareFunction, undefined, true));
            return item;
        },
        delete: toSeek => {
            const [sought, index] = getIndex(
                heapImpl.items,
                toSeek,
                heapImpl.compareFunction,
            ) || [];
            if (sought && index !== undefined) {
                treeClimb(sought);
                heapImpl.minimum = index;
                return heapImpl.pop();
            }
            return null;
        },
        search: toSeek => {
            const [sought] = getIndex(
                heapImpl.items,
                toSeek,
                heapImpl.compareFunction,
            ) || [];
            if (sought) {
                return sought.item;
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
