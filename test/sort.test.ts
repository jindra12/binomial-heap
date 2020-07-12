import heap from '../src/index';

describe("Can sort out heaps", () => {
    test("Can sort basic number heap", () => {
        expect(
            heap([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5]).sort()
        ).toEqual([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5].sort());
    });
});
