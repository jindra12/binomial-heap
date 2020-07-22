import { Heap, PromiseHeap } from "..";

export const promisifyHeap = <T>(heap: Heap<T>): PromiseHeap<T> => {
    const promisified: PromiseHeap<T> = {
        heap,
        compare: cmp => new Promise<PromiseHeap<T>>(resolve => {
            promisified.heap.compare(cmp);
            return resolve(promisified);
        }),
        delete: cmp => new Promise<T | null>(resolve => resolve(promisified.heap.delete(cmp))),
        equals: to => new Promise<boolean>(resolve => resolve(promisified.heap.equals(to.heap))),
        merge: (next, compare, disable) => new Promise<PromiseHeap<any>>(resolve => {
            promisified.heap.merge(next.heap, compare, disable);
            resolve(promisified);
        }),
        min: () => promisified.heap.min(),
        pop: () => new Promise<T | null>(resolve => resolve(promisified.heap.pop())),
        push: (item, compare, disable) => new Promise<PromiseHeap<any>>(resolve => {
            promisified.heap.push(item, compare, disable);
            resolve(promisified);
        }),
        search: cmp => new Promise<T | null>(resolve => resolve(promisified.heap.search(cmp))),
        sort: () => new Promise<T[]>(resolve => resolve(promisified.heap.sort())),
        sync: () => promisified.heap,
    };

    return promisified;
};