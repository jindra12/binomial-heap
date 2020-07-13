import heap from '../src/index';

describe("Can delete elements in various intervals", () => {
    test("Can delete in numeric interval", () => {
        expect(heap([1, 2, 3, -4, -5, -6, 7, 9]).delete(-5)).toBe(-5);
        expect(heap([1, 2, 3, -4, -5, -6, 7, 9], (a, b) => Math.abs(a) - Math.abs(b)).delete(-7)).toBe(7);
    });
    test("Can delete in string interval", () => {
        expect(heap(['Hello', 'World', 'I', 'Am', 'Brian']).delete('I')).toBe('I');
        expect(heap(['Hello', 'World', 'I', 'Am', 'Brian']).delete('Suzzie')).toBe(null);
    });
    test("Can delete in mixed intervals", () => {
        const dates = [
            new Date(2020, 6, 12, 3).getTime(),
            new Date(2020, 6, 12, 6).toISOString(),
            new Date(2020, 6, 12, 7),
            new Date(2020, 6, 12, 2).getTime(),
            new Date(2020, 6, 12, 11),
            new Date(2020, 6, 12, 6).toISOString(),
        ];
        expect(heap(dates).delete(item => new Date(item).getTime() === dates[0])).toEqual(dates[0]);
    });
    test("Can delete in object intervals", () => {
        const objects = [
            { a: 5 },
            { c: '4' },
            { b: 5 },
            { f: 9 },
            { a: 6 },
        ];
        expect(heap(objects, (a: object, b: object) => JSON.stringify(a).localeCompare(JSON.stringify(b))).delete(item => item['a'] === 5)).toEqual({ a: 5 });
    });
    test("Deleted element will dissapear", () => {
        const test = heap([1, 2, 3, 4]);
        test.delete(1);
        test.delete(4);
        expect(test.pop()).toEqual(2);
    });
    test("Won't crash on empty heap delete", () => {
        const empty = heap([3]);
        empty.pop();
        expect(empty.delete(3)).toEqual(null);
    });
});