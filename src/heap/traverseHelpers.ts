import { Tree } from "../types";

export const readMin = <T>(merged: Array<Tree<T>>, compare: (a: T, b: T) => number, getMin: (params: number) => void) => {
    let min = merged[0];
    let index = 0;
    merged.forEach((tree, i) => {
        if (compare(tree.item, min.item) < 0) {
            min = tree;
            index = i;
        }
    });
    getMin(index);
    return merged;
}

export const treeClimb = <T>(start: Tree<T>) => {
    if (start.parent !== null) {
        const temp = start.parent.item;
        start.parent.item = start.item;
        start.item = temp;
        treeClimb(start.parent);
    }
};