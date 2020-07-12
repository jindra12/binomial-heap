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
    heap[b[0]][b[1]] = heap[a[0]][b[0]];
    heap[a[0]][b[0]] = temp;
};

export const treeClimb = <T>(heap: T[][], start: [number, number]) => {
    const tree = heap[start[0]];
    const swaps: number[] = [];
    
    swaps.reverse().forEach((swap, i) => {
        if (swaps[i + 1] !== undefined) {
            swapElements(heap, [start[0], swap], [start[0], swaps[i + 1]]);
        }
    });
};