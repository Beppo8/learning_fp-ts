// Arrays, Semigroups, Monoid

import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

const foo = [1, 2, 3, 4, 5]

const sum = pipe(
  A.array.map(foo, (x) => x - 1),
  A.filter((x) => x % 2 === 0),
  A.reduce(0, (prev, next) => prev + next),
)
console.log(sum) // 6


const fo = [1, 2, 3]
const bar = ['a', 'b', 'c']

const zipped = pipe(fo, A.zip(bar))
console.log(zipped) // [[1, 'a], [2, 'b], [3, 'c']]


/* 
Lookup
If we want to be type safe when accessing an element in an array, we should use the lookup function. 
It takes two parameters, an index and an array and returns an Option type.
In short, if you really care about type safety, use lookup to access elements in your array.
*/

pipe([1, 2, 3], A.lookup(1)) // { _tag: 'Some', value: 2 }
pipe([1, 2, 3], A.lookup(3)) // { _tag: 'None' }

// Array
export declare const head: <A>(as: A[]) => Option<A>

// NonEmptyArray
export declare const head: <A>(nea: NonEmptyArray<A>) => A

// Monoids
import { Monoid, monoidSum } from 'fp-ts/lib/Monoid'

const compute = (arr: Array<Foo | Bar>) =>
  pipe(
    A.array.partitionMap(arr, (a) =>
      a._tag === 'Foo' ? E.left(a) : E.right(a),
    ),
    ({ left: foos, right: bars }) => {
      const sum = A.array.foldMap(monoidSum)(foos, (foo) => foo.f())
      const max = A.array.foldMap(monoidMax)(bars, (bar) => bar.g())

      return sum * max
    }, 
  ) 