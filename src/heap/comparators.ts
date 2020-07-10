export const getValue = <T>(item: T): number | string => {
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
};

export const sanityCheck = <T>(heap: T[][], compare: (a: T, b: T) => number): boolean => {
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
};

export const preSanityCheck = <T, E>(a: T[][], b: E[][], compare?: Function) => typeof (a[0] && a[0][0]) === typeof (b[0] && b[0][0]) && !compare;

export const getDefaultComparator = <T>() => (a: T, b: T) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
    }
    return valueA.toString().localeCompare(valueB.toString());
};

const findInSubTree = <T>(
    tree: T[],
    item: T,
    compare: (a: T, b: T) => number,
    onSuccess: (pos: number) => void,
    succeeded: () => boolean,
    start: number = 0,
    end: number = tree.length - 1
) => {
    if (!compare(tree[start], item)) {
        onSuccess(start);
    }
    if (start === end || succeeded()) {
        return;
    }
    const middle = end / 2
    if (compare(tree[start], item) < 0) {
        findInSubTree(tree, item, compare, onSuccess, succeeded, start, Math.floor(middle));
    }
    if (compare(tree[end], item) < 0) {
        findInSubTree(tree, item, compare, onSuccess, succeeded, Math.ceil(middle), end);
    }
};

const find = <T>(heap: T[][], item: T, compare: (a: T, b: T) => number): [number, number] | null => heap.reduce(
    (p: [number, number] | null, tree, i) => {
        if (p || compare(item, tree[0]) < 0) {
            return p;
        }
        let found: number | undefined;
        const succeeded = () => found !== undefined;
        const onSuccess = (pos: number) => found = pos;
        findInSubTree(tree, item, compare, onSuccess, succeeded);
        return found ? [i, found] : p;
    },
    null,
);

const seek = <T>(heap: T[][], compare: (item: T) => boolean): [number, number] | null => heap.reduce(
    (p: [number ,number] | null, tree, i) => p ? p : tree.reduce((p: [number, number] | null, item, j) => p ? p : (compare(item) ? [i, j] : null), null),
    null,
);

export const getIndex = <T>(heap: T[][], compareTo: T | ((item: T) => boolean), compare: (a: T, b: T) => number): [number, number] | null => typeof compareTo === 'function' 
    ? seek(heap, compareTo as any)
    : find(heap, compareTo as any, compare);