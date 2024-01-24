import * as T from 'fp-ts/lib/Task'

// filler values for brevity
type A = 'A'
type B = 'B'
type C = 'C'

declare const fa: () => T.Task<A>
declare const fb: (a: A) => T.Task<B>
declare const fc: (ab: { a: A; b: B }) => T.Task<C>

T.task.chain(fa(), (a) => T.task.chain(fb(a), (b) => fc({ a, b }))) // Task<"C">
flow(fa, T.chain(fb), T.chain(fc)) // ❌ "a" will go out of scope

// Using the Do notation

import { Do } from 'fp-ts-contrib/lib/Do'

Do(T.task)
  .bind('a', fa()) // task
  .bindL('b', ({ a } /* context */) => fb(a)) // lazy task
  .bindL('c', fc) // lazy task
  .return(({ c }) => c) // Task<"C">

import { log } from 'fp-ts/lib/Console'

Do(T.task)
.bind('a', fa())
.bindL('b', ({ a }) => fb(a))
.doL(({ b }) => pipe(log(b), T.fromIO)) // 👈 side effect
.bindL('c', fc)
.return(({ c }) => c)

// with TE
import * as TE from 'fp-ts/lib/TaskEither'

type D = 'D'
declare const fd: (ab: { a: A; b: B; c: C }) => TE.TaskEither<D, Error>

Do(TE.taskEither)
  .bind('a', TE.fromTask(fa()))
  .bindL('b', ({ a }) => TE.fromTask(fb(a)))
  .doL(({ b }) => pipe(log(b), T.fromIO, TE.fromTask))
  .bindL('c', ({ a, b }) => TE.fromTask(fc({ a, b })))
  .return(({ c }) => c)

// Combine

pipe(
    T.bindTo('a')(fa()),
    T.bind('b', ({ a }) => fb(a)),
    T.chainFirst(({ b }) => pipe(log(b), T.fromIO)),
    T.bind('c', ({ a, b }) => fc({ a, b })),
    TE.fromTask,
    TE.bind('d', ({ a, b, c }) => fd({ a, b, c })),
    TE.map(({ d }) => d),
  )

/* 
The Do notation is a powerful way of writing monadic code that makes it easy to chain functions while at the same time maintaining variable scope. 
Its inspired by the Haskell Do notation and Scala's for-yield notation.

In Typescript, we can use the Do notation from the fp-ts-contrib package or the built in bind methods. 
But there's another notation thats being discussed on the fp-ts Github. 
It proposes using function generators and along with yield syntax to make monadic code look imperative. 
Its an interesting approach and definitely worth investigating further.
*/