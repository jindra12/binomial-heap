export type Primitives = string | number | Date;

export type SafeHeap<T> = T extends Heap<never> ? never : T;

export interface Heap<T> {  
    /**
     * Pointer to min location
     */
    minimum: [number, number];
    /**
     * Items in queue
     */
    items: T[][];
    /**
     * Set up custom comparator function
     */
    compare: (comparison: (a: T, b: T) => number) => Heap<T>;
    /**
     * Merge two heaps together
     */
    merge: <E, F extends ((a: T | E, b: T | E) => number) | void = void>(
        heap: Heap<E>,
        compare?: F,
        disableSanityCheck?: boolean,
    ) => F extends void ? (E extends T | Primitives ? Heap<T | E> : never) : Heap<T | E>;
    /**
     * Remove top element (min)
     */
    pop: () => T | null;
    /**
     * Add another element
     */
    push: <E, F extends ((a: T | E, b: T | E) => number) | void = void>(
        item: E,
        compare?: F,
        disableSanityCheck?: boolean,
    ) => F extends void ? (E extends T | Primitives ? Heap<T | E> : never) : Heap<T | E>;
    /**
     * Does this heap equal another?
     */
    equals: (heap: Heap<T>) => boolean;
    /**
     * Find out minimum value in heap
     */
    min: () => T | null;
    /**
     * Returns sorted array of elements
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
}