export type TypeCompareAnalysis = 'string' | 'number' | 'Date';

export interface Tree<T> {
    parent: Tree<T> | null;
    item: T;
    children: Array<Tree<T>>;
}

export interface Heap<T> {

    /**
     * Index of min location
     */
    minimum: number;

    /**
     * Items in queue
     */
    items: Array<Tree<T>>;

    /**
     * Remove top element (min)
     */
    pop: () => T | null;

    /**
     * Does this heap equal another?
     */
    equals: (heap: Heap<T>) => boolean;

    /**
     * Find out minimum value in heap
     */
    min: () => T | null;

    /**
     * Returns sorted array of elements. Will empty out the heap
     */
    sort: () => T[];

    /**
     * Delete an element, min or max from heap
     */
    delete: (item: T | ((compare: T) => boolean)) => T | null;

    /**
     * Search through the heap for an element
     */
    search: (seek: T | ((compare: T) => boolean)) => T | null;

    /**
     * Function which is currently used for comparison
     */
    compareFunction: (a: T, b: T) => number;

    /**
     * What kind of default comparison function will be used
     */
    kindOfCompare: TypeCompareAnalysis;

    /**
     * Set up custom comparator function
     */
    compare: (comparison: (a: T, b: T) => number) => Heap<T>;

    /**
     * Merge two heaps together
     */
    merge: <E>(
        heap: Heap<E>,
        compare?: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>;

    /**
     * Add another element
     */
    push: <E>(
        item: E,
        compare?: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>;
}