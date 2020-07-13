export const readMin = <T>(merged: T[][], compare: (a: T, b: T) => number, getMin: (params: [number, number]) => void) => {
    let min = merged[0][0];
    let indexes = [0, 0];
    merged.forEach((tree, i) => {
        if (compare(tree[0], min) < 0) {
            min = tree[0];
            indexes = [i, 0];
        }
    });
    getMin(indexes as [number, number]);
    return merged;
}

export const getRoots = <T>(tree: T[]): T[][] => {
    const acc: T[][] = [];
    let jump = 1;
    while (jump < tree.length) {
        acc.push(tree.slice(jump, jump * 2));
        jump *= 2;
    }
    return acc;
};

export const swapElements = <T>(heap: T[][], a: [number, number], b: [number, number]) => {
    const temp = heap[b[0]][b[1]];
    heap[b[0]][b[1]] = heap[a[0]][a[1]];
    heap[a[0]][a[1]] = temp;
};

export const getPathTo = <T>(tree: T[], at: number): number[] => {
    const acc: number[] = [0];
    let start = 0;
    let end = tree.length - 1;
    if (at === start) {
        return acc;
    }
    while (start !== end) {
        const middle = Math.ceil((start + end) / 2);
        if (at >= middle) {
            acc.push(middle);
        }
        if (at === middle) {
            break;
        }
        if (at > middle) {
            start = middle;
        } else {
            end = middle;
        }
    }
    return acc;
};

export const treeClimb = <T>(heap: T[][], start: [number, number]) => {
    const tree = heap[start[0]];
    const swaps: number[] = getPathTo(tree, start[1]);
    swaps.reverse().forEach((swap, i) => {
        if (swaps[i + 1] !== undefined) {
            swapElements(heap, [start[0], swap], [start[0], swaps[i + 1]]);
        }
    });
};