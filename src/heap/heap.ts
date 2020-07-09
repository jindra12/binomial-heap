import { Heap, Primitives } from '../types';

const mergeTree = <T>(
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

const readMin = <T>(merged: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void) => {
    let min = merged[0][0];
    let indexes = [0, 0];
    merged.forEach((tree, i) => {
        if (compare(min, tree[0]) < 0) {
            min = tree[0];
            indexes = [i, 0];
        }
    });
    getMin(indexes as [number, number]);
    return merged;
}

const flatten = <T>(heap: T[][]): T[] => heap.reduce((p: T[], c) => {
    c.forEach(item => p.push(item));
    return p;
}, []);

const failedMerge = <T>(a: T[][], b: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void): T[][] => [
    ...flatten(a),
    ...flatten(b),
].reduce((p: T[][], c) => merge(p, [[c]], compare, getMin, true), []);

const merge = <T>(a: T[][], b: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void, failedSanityCheck?: boolean): T[][] => {
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

const getValue = <T>(item: T): number | string => {
    if (item instanceof Date) {
        return item.getTime();
    }
    switch (typeof item) {
        case 'function':
        case 'object':
            throw Error('Cannot compare functions or objects by default, need a compare function for that');
        case 'boolean':
        case 'undefined':
            return item ? 1 : 0;
        case 'bigint':
        case 'number':
            return item as any;
        case 'string':
        case 'symbol':
            return item.toString();
    }
    throw Error('Could not find typeof.. this should never happen!');
}

const sanityCheck = <T>(heap: T[][], compare: (a: T, b: T) => number): boolean => {
    let isSorted = true;
    heap.forEach(tree => {
        if (tree[0] > heap[0][0]) {
            isSorted = false
        }
    });
    if (!isSorted) {
        return false;
    }
    if (heap.length === 1) {
        return true;
    }

    return sanityCheck(heap.slice(0, heap.length / 2), compare) && sanityCheck(heap.slice(heap.length / 2, heap.length - 1), compare);
}

const preSanityCheck = <T, E>(a: T[][], b: E[][], compare?: Function) => typeof (a[0] && a[0][0]) === typeof (b[0] && b[0][0]) && !compare;

const getDefaultComparator = <T>() => (a: T, b: T) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
    }
    return valueA.toString().localeCompare(valueB.toString());
}

const mergeImpl = <T, E>(heap: Heap<T>, items: E[][], compare: ((a: T | E, b: T | E) => number) | undefined, disableSanityCheck: boolean) => {
    const trueCompare = compare || getDefaultComparator<T | E>();
    return merge<T | E>(
        heap.items,
        items,
        trueCompare,
        min => heap.minimum = min,
        !disableSanityCheck
            || preSanityCheck(heap.items, items)
            || (sanityCheck(heap.items, trueCompare) && sanityCheck(items, trueCompare)),
    ) as T[][]
}

const getRoots = <T>(tree: T[], acc: T[][]): T[][] => {
    if (tree.length === 1) {
        return acc;
    }
    acc.push(tree.slice(heap.length / 2, heap.length - 1));
    return getRoots(tree.slice(0, heap.length / 2), acc);
}

export const heap: (<T extends Primitives>(
    items: T[],
    compare?: (a: T, b: T) => number,
) => Heap<T>) | (<T extends object>(
    items: T[],
    compare: (a: T, b: T) => number,
) => Heap<T>) = <T>(items: T[], compare: (a: T, b: T) => number = getDefaultComparator<T>()) => {
    const heapImpl: Heap<T> = {
        items: items.length > 0 ? items.reduce((p: T[][], c) => merge(p, [[c]], compare, min => heapImpl.minimum = min), []) : [],
        compare: compareFunction => {
            heapImpl.compareFunction = compareFunction;
            return heapImpl;
        },
        merge: <E>(withHeap: Heap<E>, compare?: (a: T | E, b: T | E) => number, disableSanityCheck?: boolean) => {
            heapImpl.items = mergeImpl(heapImpl, withHeap.items, compare, disableSanityCheck || false);
            return heapImpl as any;
        },
        compareFunction: compare,
        minimum: [0, 0],
        min: () => heapImpl.items[heapImpl.minimum[0]] ? heapImpl.items[heapImpl.minimum[0]][heapImpl.minimum[1]] || null : null,
        push: <E>(item: E, compare?: (a: T | E, b: T | E) => number, disableSanityCheck?: boolean) => {
            heapImpl.items = mergeImpl(heapImpl, [[item]], compare, disableSanityCheck || false);
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
            const roots = heapImpl.items[heapImpl.minimum[0]];
            
            return min;
        }

    };
    return heapImpl;
};
