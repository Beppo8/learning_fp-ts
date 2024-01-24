import { pipe } from 'fp-ts/lib/function'
import { flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function add1(num: number): number {
    return num + 1
}

function multiply2(num: number): number {
    return num * 2
}

pipe(1, add1, multiply2, toString)
flow(add1, multiply2, toString)(1) // this is equivalent


// Flow use case

function concat(
    a: number,
    transformer: (a: number) => string,
  ): [number, string] {
    return [a, transformer(a)]
  }

concat(1, (n) => pipe(n, add1, multiply2, toString)) // [1, '4']
concat(1, flow(add1, multiply2, toString)) // [1, '4']

// Option 

type Option<A> = None | Some<A>

/* Option types are useful because it gives us superpowers. 
The first superpower is the map operator. */

// Map
interface Fizz {
    buzz?: string
}

interface Foo {
    bar?: string
}

const foo = {
    bar: undefined,
} as Foo | undefined
  
pipe(foo, (f) => f?.bar) // hello

pipe(
    foo,
    O.fromNullable,
    O.map(({ bar }) => bar),
  ) // { _tag: 'Some', value: 'hello' }
  pipe(
    undefined,
    O.fromNullable,
    O.map(({ bar }) => bar),
  ) // { _tag: 'None' }


  pipe(
    foo,
    O.fromNullable,
    O.map(({ bar }) => bar),
    O.chain(
      flow(
        O.fromNullable,
        O.map(({ buzz }) => buzz),
      ),
    ),
  ) // { _tag: 'None' }