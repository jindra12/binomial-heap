import heap from '../src/index';

describe("Can sort out heaps", () => {
    test("Can sort basic number heap", () => {
        expect(
            heap([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5]).sort()
        ).toEqual([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5].sort((a, b) => a - b));
    });
    test("Can sort string heap", () => {
        expect(
            heap(['Hello', 'World', 'I', 'Am', 'Donny', 'Bounce']).sort()
        ).toEqual(['Hello', 'World', 'I', 'Am', 'Donny', 'Bounce'].sort((a, b) => a.localeCompare(b)));
    });
    test("Can sort Date heap", () => {
        expect(
            heap([new Date(2020, 6, 12, 8), new Date(2020, 6, 12, 7), new Date(2020, 6, 12, 10), new Date(2020, 6, 12, 5)]).sort()
        ).toEqual([new Date(2020, 6, 12, 8), new Date(2020, 6, 12, 7), new Date(2020, 6, 12, 10), new Date(2020, 6, 12, 5)].sort((a, b) => a.getTime() - b.getTime()));
    });
    test("Can sort multi-type heap", () => {
        expect(
            heap(['1', '2', 3, '11', 11, 'Hello', '0', 0]).sort().map(item => item.toString())
        ).toEqual(['1', '2', 3, '11', 11, 'Hello', '0', 0].sort((a, b) => a.toString().localeCompare(b.toString())).map(item => item.toString()))
    });
    test("Can sort multi type merge heap", () => {
        expect(
            heap(['1', '2', '11', 'Hello', '0']).merge(heap([0, 3, 11])).sort().map(item => item.toString())
        ).toEqual(['1', '2', 3, '11', 11, 'Hello', '0', 0].sort((a, b) => a.toString().localeCompare(b.toString())).map(item => item.toString()))
    });
    test("Can sort a Date/string/number heap", () => {
        const dates = [
            new Date(2020, 6, 12, 3).getTime(),
            new Date(2020, 6, 12, 6).toISOString(),
            new Date(2020, 6, 12, 7),
            new Date(2020, 6, 12, 2).getTime(),
            new Date(2020, 6, 12, 11),
            new Date(2020, 6, 12, 6).toISOString(),
        ];
        expect(heap(dates).sort()).toEqual(dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
    });
});
