import { Heap, Tree, DefinedCompare } from '../types';
import { getDefaultComparator, getIndex, sanityCheck, typeComparisonAnalyzer, mergeComparators, equality, extendCompare } from './comparators';
import { treeClimb, readMin } from './traverseHelpers';
import { mergeHeaps, mergeFunctionImpl, failedMerge } from './mergeHelpers';
import { promisifyHeap } from './promisify';

Array.prototype.heap = function(compare) {
    return heap(this, compare);
}

export const heap = <T>(
    items: T[],
    compare?: DefinedCompare<T>,
): Heap<T> => {
    let minCarry: number = -1;
    const inputAnalysis = !compare ? typeComparisonAnalyzer(items) : 'string';
    const trueCompare = (extendCompare(compare) || getDefaultComparator<T>(inputAnalysis)) as any;
    const heapImpl: Heap<T> = {
        items: items.length > 0 ? items.reduce((p: Array<Tree<T>>, c) => mergeHeaps(p, [{ parent: null, item: c, children: [] }], trueCompare, min => minCarry = min), []) : [],
        compare: compareFunction => {
            const realCompare = extendCompare(compareFunction)!;
            heapImpl.compareFunction = realCompare;
            if (!sanityCheck(heapImpl.items, realCompare)) {
                heapImpl.items = failedMerge(heapImpl.items, realCompare, min => heapImpl.minimum = min);
            }
            return heapImpl;
        },
        merge: (withHeap, compare, disableSanityCheck) => {
            const nextAnalysis = mergeComparators(heapImpl.kindOfCompare, withHeap.kindOfCompare);
            const nextCompare = extendCompare(compare) || getDefaultComparator<T>(nextAnalysis);
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
                extendCompare(compare) || heapImpl.compareFunction as any,
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
            if (roots.length > 0) {
                roots.forEach(root => heapImpl.items = mergeFunctionImpl(heapImpl, [root], heapImpl.compareFunction, undefined, true));
            } else {
                readMin(heapImpl.items, heapImpl.compareFunction, min => heapImpl.minimum = min);
            }
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
        promisify: () => promisifyHeap(heapImpl),
        kindOfCompare: inputAnalysis,
    };
    return heapImpl as any;
};
