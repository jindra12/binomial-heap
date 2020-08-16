import { TypeCompareAnalysis, Tree } from "../types";

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

export const extendCompare = <T>(compare?: ((a: T, b: T) => number) | ((a: T) => number)) => {
    if (!compare || compare.length === 2) {
        return compare;
    }
    const singleParam = compare as (a: T) => number;
    return (a: T, b: T) => singleParam(a) - singleParam(b);
}

const treeSanityCheck = <T>(tree: Tree<T>, compare: (a: T, b: T) => number): boolean => tree
    .children
    .reduce(
        (p: boolean, c) => !p ? false : compare(c.item, tree.item) >= 0 && treeSanityCheck(c, compare),
        true,
    );

export const sanityCheck = <T>(heap: Array<Tree<T>>, compare: (a: T, b: T) => number): boolean => heap.reduce(
    (p: boolean, c) => !p ? false : treeSanityCheck(c, compare),
    true,
);

export const preSanityCheck = <T, E>(a: Array<Tree<T>>, b: Array<Tree<E>>, compare?: Function) => typeof (a[0] && a[0].item) === typeof (b[0] && b[0].item) && !compare;

export const typeComparisonAnalyzer = <T>(items: T[]): TypeCompareAnalysis => items.reduce(
    (p: TypeCompareAnalysis, item) => {
        if (item instanceof Date) {
            if (p === 'number') {
                return 'Date';
            }
        }
        if (typeof item === 'string') {
            if (isNaN(Date.parse(item))) {
                return 'string';
            } else if (p === 'number' || p === 'Date') {
                return 'Date';
            }
            return 'string';
        }
        return p;
    }, 
    'number',
);

export const mergeComparators = (a: TypeCompareAnalysis, b: TypeCompareAnalysis): TypeCompareAnalysis => {
    if (a === 'string' || b === 'string') {
        return 'string';
    }
    if (a === 'Date' || b === 'Date') {
        return 'Date';
    }
    return 'number';
};

export const getDefaultComparator = <T>(kindOfCompare: 'string' | 'number' | 'Date') => (a: T, b: T) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    if (typeof valueA === 'number' && typeof valueB === 'number') {
        if (kindOfCompare === 'number' || kindOfCompare === 'Date') {
            return valueA - valueB;
        }
        return valueA.toString().localeCompare(valueB.toString());
    }
    if (kindOfCompare === 'Date') {
        return new Date(valueA).getTime() - new Date(valueB).getTime();
    }
    return valueA.toString().localeCompare(valueB.toString());
};

const findInSubTree = <T>(
    tree: Tree<T>,
    item: T,
    compare: (a: T, b: T) => number,
): Tree<T> | null => {
    if (!compare(tree.item, item)) {
        return tree;
    }
    return tree.children.reduce((p: Tree<T> | null, c) => Boolean(p) 
        ? p
        : (
            compare(c.item, item) <= 0
                ? findInSubTree(c, item, compare)
                : p
        ),
        null,
    );
};

const find = <T>(heap: Array<Tree<T>>, item: T, compare: (a: T, b: T) => number, pass?: number): [Tree<T>, number] | null => heap.reduce(
    (p: [Tree<T>, number] | null, tree, i) => {
        if (p || compare(item, tree.item) < 0) {
            return p;
        }
        const found = findInSubTree(tree, item, compare);
        return found !== null ? [found, pass === undefined ? i : pass] : p;
    },
    null,
);

const seek = <T>(heap: Array<Tree<T>>, compare: (item: T) => boolean, pass?: number): [Tree<T>, number] | null => heap.reduce((p: [Tree<T>, number] | null, c, i) => {
    if (Boolean(p)) {
        return p;
    }
    if (compare(c.item)) {
        return [c, pass === undefined ? i : pass];
    }
    return seek(c.children, compare, i);
}, null);

const treeEquality = <T>(a: Tree<T>, b: Tree<T>, compare: (a: T, b: T) => number): boolean => a.children.length === b.children.length
    && !compare(a.item, b.item)
    && a.children.reduce(
        (p: boolean, c, i) => !p ? false : b.children[i] && treeEquality(c, b.children[i], compare),
        a.children.length === b.children.length,
    );

export const equality = <T>(a: Array<Tree<T>>, b: Array<Tree<T>>, compare: (a: T, b: T) => number) => a.length === b.length
    && a.reduce((p: boolean, c, i) => !p ? false : treeEquality(c, b[i], compare), true);

export const getIndex = <T>(heap: Array<Tree<T>>, compareTo: T | ((item: T) => boolean), compare: (a: T, b: T) => number): [Tree<T>, number] | null => typeof compareTo === 'function' 
    ? seek(heap, compareTo as any)
    : find(heap, compareTo as any, compare);