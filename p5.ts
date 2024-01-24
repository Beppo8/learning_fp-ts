// Apply, Sequences and Traversals
import { pipe } from 'fp-ts/lib/function'
import { ap } from 'fp-ts/lib/Identity'

declare function write(key: string, value: string, flush: boolean): unknown

const writeC = (key: string) => (value: string) => (flush: boolean) =>
  write(key, value, flush)

// ❌ Wrong
pipe(true, 'value', 'key', writeC)

// ✅ Correct
pipe(true, pipe('value', pipe('key', writeC)))


pipe(writeC, ap('key'), ap('value'), ap(true))

// Sequence 
Array<Option<A>> => Option<A[]>

import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'

const arr = [1, 2, 3].map(O.of)
A.array.sequence(O.option)(arr) // Option<number[]>


// SequenceT

sequenceT(O.option)(O.of(123), O.of('asdf'))

declare function foo(a: number, b: string): boolean
declare function bar(a: boolean): object

// Option<object>
pipe(
  sequenceT(O.option)(O.of(123), O.of('asdf')),
  O.map((args) => foo(...args)),
  O.map(bar),
)

// SequenceS

import * as E from 'fp-ts/lib/Either'

type RegisterInput = {
  email: string
  password: string
}

declare function validateEmail(email: string): E.Either<Error, string>
declare function validatePassword(password: string): E.Either<Error, string>
declare function register(input: RegisterInput): unknown

declare const input: RegisterInput

pipe(
  input,
  ({ email, password }) =>
    sequenceS(E.either)({
      email: validateEmail(email),
      password: validatePassword(password),
    }),
  E.map(register),
)

// Traversals

import * as TE from 'fp-ts/lib/TaskEither'
import { TaskEither } from 'fp-ts/lib/TaskEither'

declare const getPartIds: () => TaskEither<Error, string[]>
declare const getPart: (partId: string) => TaskEither<Error, Blob>

// ✅ TE.TaskEither<Error, Blob[]>
pipe(getPartIds(), TE.chain(A.traverse(TE.taskEither)(getPart)))