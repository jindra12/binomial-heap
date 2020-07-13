import heap from '../src/index';

describe("Can push into interval", () => {
    test("Can push into numeric interval", () => {
        expect(heap([1, -3, 4, 5]).push(-5).pop()).toBe(-5);
    });
    test("Can push into string intervals", () => {
        expect(heap(['I', 'Am', 'a', 'Robot', 'Guy']).push('John').pop()).toBe('a');
    });
    test("Can push into mixed intervals", () => {
        const dates = [
            new Date(2020, 6, 12, 3).getTime(),
            new Date(2020, 6, 12, 6).toISOString(),
            new Date(2020, 6, 12, 7),
            new Date(2020, 6, 12, 2).getTime(),
            new Date(2020, 6, 12, 11),
        ];
        const next = new Date(2020, 6, 12, 6).toISOString();
        expect(heap(dates).push(next).pop()).toEqual(dates[3]);
    });
    test("Can push/pop a small heap", () => {
        expect(heap([3]).push(4).pop()).toBe(3);
        expect(heap([4]).push(3).pop()).toBe(3);
        expect(heap([4]).pop()).toBe(4);
        const repopulate = heap([4]);
        repopulate.pop();
        repopulate.push(3);
        expect(repopulate.pop()).toBe(3);
    });
});