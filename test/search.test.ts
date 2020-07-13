import heap from '../src/index';

describe("Can search in interval", () => {
    test("Can search in numeric interval", () => {
        expect(heap([1, 2, 3, -4, -5, -6, 7, 9]).search(-5)).toBe(-5);
        expect(heap([1, 2, 3, -4, -5, -6, 7, 9], (a, b) => Math.abs(a) - Math.abs(b)).search(-7)).toBe(7);
    });
    test("Can search in string interval", () => {
        expect(heap(['Hello', 'World', 'I', 'Am', 'Brian']).search('I')).toBe('I');
        expect(heap(['Hello', 'World', 'I', 'Am', 'Brian']).search('Suzzie')).toBe(null);
    });
    test("Can search in mixed intervals", () => {
        const dates = [
            new Date(2020, 6, 12, 3).getTime(),
            new Date(2020, 6, 12, 6).toISOString(),
            new Date(2020, 6, 12, 7),
            new Date(2020, 6, 12, 2).getTime(),
            new Date(2020, 6, 12, 11),
            new Date(2020, 6, 12, 6).toISOString(),
        ];
        expect(heap(dates).search(item => new Date(item).getTime() === dates[0])).toEqual(dates[0]);
    });
    test("Can search in object intervals", () => {
        const objects = [
            { a: 5 },
            { c: '4' },
            { b: 5 },
            { f: 9 },
            { a: 6 },
        ];
        expect(heap(objects, (a: object, b: object) => JSON.stringify(a).localeCompare(JSON.stringify(b))).search(item => item['a'] === 5)).toEqual({ a: 5 });
    });
    test("Won't crash on empty heap search", () => {
        const empty = heap([3]);
        empty.pop();
        expect(empty.search(3)).toEqual(null);
    });
});