import heap from '../src/index';

describe("Can sort out promisified heaps", () => {
    test("Can sort basic promisified number heap", async () => {
        const unSorted = [1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5];
        const promisify = heap(unSorted).promisify();
        await promisify.pop();
        await promisify.pop();
        await promisify.push(-3);
        await promisify.push(-1);
        const sorted = await promisify.sort();
        expect(sorted).toEqual(unSorted.sort((a, b) => a - b));
    });
});