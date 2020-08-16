import heap from '../src/index';

describe("Can setup a custom comparator function", () => {
    test("Can setup a comparator for numbers", () => {
        const test = heap([1, 2, 3, -3]);
        expect(test.items[0].children.map(child => child.item)).toEqual([
            3, 1,
        ]);
        expect(test.compare((a, b) => Math.abs(a) - Math.abs(b)).items[0].children.map(child => child.item)).toEqual([
            2, -3,
        ]);
    });
    test("Can setup a comparator for strings", () => {
        const test = heap(['ab', 'af', 'bd', 'ef']);
        expect(test.items[0].children.map(child => child.item)).toEqual([
            'af', 'bd',
        ]);
        expect(test.compare((a, b) => a[1].localeCompare(b[1])).items[0].children.map(child => child.item)).toEqual([
            'af', 'bd',
        ]);        
    });
    test("Can setup a comparator for objects", () => {
        const heapContents = [
            {
                a: 1
            },
            {
                b: 2
            },
            {
                d: 3
            },
            {
                c: 7
            },
        ];
        const test = heap(heapContents, (a: object, b: object) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]));
        expect(test.compare((a: object, b: object) => Object.values(a)[0] - Object.values(b)[0]).items[0].children.map(child => child.item)).toEqual([
            { b: 2 },
            { d: 3 },
        ]);
    });
    test("Can use extended array interface", () => {
        const array = [1, 2, 4, 0, -1, 5];
        expect(array.heap().sort()).toEqual(array.sort());
        const objects = [
            { a: 5 },
            { c: '4' },
            { b: 5 },
            { f: 9 },
            { a: 6 },
        ];
        expect(objects.heap((a: object, b: object) => JSON.stringify(a).localeCompare(JSON.stringify(b))).search(item => item['a'] === 5)).toEqual({ a: 5 });
    });
    test("Can use shorthand fn with single param for comparison", async () => {
        const array = [5, -1, 0, 3, -2];
        const absSort = (a: number, b: number) => Math.abs(a) - Math.abs(b);
        expect(heap(array, Math.abs).sort()).toEqual(array.sort(absSort));
        expect(heap(array).compare(Math.abs).sort()).toEqual(array.sort(absSort));
        expect(heap(array).merge(heap(array), Math.abs).sort()).toEqual([...array, ...array].sort(absSort));
        expect(heap(array).push(5, Math.abs).sort()).toEqual([5, ...array].sort(absSort));
        expect(await (await heap(array).promisify().merge(heap(array).promisify(), Math.abs)).sort()).toEqual([...array, ...array].sort(absSort));
    });
});