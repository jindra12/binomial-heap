import heap from '../src/index';

describe("Can define and construct binomial heaps", () => {
    test("Can create numerical heap", () => {
        expect(
            heap([1, 2, 3, 5, 2, -1]).minimum
        ).toBe(0)
    });
    test("Can create empty heap", () => {
        const empty: number[] = [];
        expect(heap(empty).items).toEqual([]);
    });
    test("Can create object-filled heap", () => {
        expect(heap([
            { 'd': 5 },
            { 'f': 5 },
            { 'b': 5 },
            { 'a': 5 },
            { 'e': 5 },
            { 'a': 5 },
        ], (a: object, b: object) => Object.keys(a)[0].localeCompare(Object.keys(b)[0])).items[0].item).toEqual({ 'a': 5 });
    });
});