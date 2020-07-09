export type Primitives = string | number | Date | undefined | null;

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
    merge: (<E extends T | Primitives>(
        heap: Heap<E>,
        compare?: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>) | (<E extends object>(
        heap: Heap<T | E>,
        compare: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>);
    /**
     * Remove top element (min)
     */
    pop: () => T | null;
    /**
     * Add another element
     */
    push: (<E extends T | Primitives>(
        item: E,
        compare?: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>) | (<E extends object>(
        item: T | E,
        compare: (a: T | E, b: T | E) => number,
        disableSanityCheck?: boolean,
    ) => Heap<T | E>);
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
    delete: (item: T | 'max' | 'min' | ((compare: T) => boolean)) => Heap<T>;
    /**
     * Search through the heap for an element
     */
    search: (seek : T | ((compare: T) => boolean)) => T | null;
    /**
     * Function which is currently used for comparison
     */
    compareFunction: (a: T, b: T) => number;
}