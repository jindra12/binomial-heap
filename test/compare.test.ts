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
});