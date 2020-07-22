# binomial-heap

No dependency binomial heap, compatible with typescript, can have custom compare function.

Can merge and push different primitive types into the heap, after which it will do automatic sanity check and restructure itself.


Algoritm costs should be standard for binomial heap. If not, please consider adding a task / pull request.


This heap is fully typed, including multi-type heaps. Heaps which contain strings, numbers and/or Dates do not need custom compare function.
Heaps which contain objects have to use custom compare.


## Examples (from unit tests):

Basic numerical heap sort:

```typescript

expect(
    heap([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5]).sort()
).toEqual([1, 2, 3, -3, 5, 10, 22, -1, 0, 0, 0, 5].sort((a, b) => a - b));

```

Type combination heap sort:

```typescript

const dates = [
    new Date(2020, 6, 12, 3).getTime(),
    new Date(2020, 6, 12, 6).toISOString(),
    new Date(2020, 6, 12, 7),
    new Date(2020, 6, 12, 2).getTime(),
    new Date(2020, 6, 12, 11),
    new Date(2020, 6, 12, 6).toISOString(),
];
expect(heap(dates).sort()).toEqual(dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));

```

Can merge two types of variables / two heaps of different types (Sanity check is O(n), won't happen unless necessary):

```typescript

expect(
    heap(['1', '2', 3, '11', 11, 'Hello', '0', 0]).sort().map(item => item.toString())
).toEqual(['1', '2', 3, '11', 11, 'Hello', '0', 0].sort(
    (a, b) => a.toString().localeCompare(b.toString())
).map(item => item.toString()));

expect(
    heap(['1', '2', '11', 'Hello', '0']).merge(heap([0, 3, 11])).sort().map(item => item.toString())
).toEqual(['1', '2', 3, '11', 11, 'Hello', '0', 0].sort(
    (a, b) => a.toString().localeCompare(b.toString())
).map(item => item.toString()));

```

The heap also supports these operations: pop (deletes minimum), push, search, delete, compare (sets up a new compare function).


Examples of compare and search/delete (both search and delete accept a function or item as an argument):

```typescript

const test = heap([1, 2, 3, -3]);
expect(test.items).toEqual([
    [-3, 3, 1, 2]
]);
expect(test.compare((a, b) => Math.abs(a) - Math.abs(b)).items).toEqual([
    [1, 2, -3, 3]
]);

const dates = [
    new Date(2020, 6, 12, 3).getTime(),
    new Date(2020, 6, 12, 6).toISOString(),
    new Date(2020, 6, 12, 7),
    new Date(2020, 6, 12, 2).getTime(),
    new Date(2020, 6, 12, 11),
    new Date(2020, 6, 12, 6).toISOString(),
];
expect(heap(dates).search(item => new Date(item).getTime() === dates[0])).toEqual(dates[0]);

const dates = [
    new Date(2020, 6, 12, 3).getTime(),
    new Date(2020, 6, 12, 6).toISOString(),
    new Date(2020, 6, 12, 7),
    new Date(2020, 6, 12, 2).getTime(),
    new Date(2020, 6, 12, 11),
    new Date(2020, 6, 12, 6).toISOString(),
];
expect(heap(dates).delete(item => new Date(item).getTime() === dates[0])).toEqual(dates[0]);

```

### Changes since 1.0.1

Binomial heap now has an inner representation of tree instead of array. Done this in order to fix linear cost merge operation.


### Changes since 1.1.0

Binomial heap now can be converted into a promisified heap, returning promises for each operation.


Also, fixed a bug in pop function. Added appropriate unit tests.


If you encounter any bugs, or have ideas for improvement, do not hesitate to add a task or a pull request.