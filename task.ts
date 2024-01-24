import { Task } from 'fp-ts/lib/Task'

const boolTask: Task<boolean> = async () => {
  try {
    await asyncFunction()
    return true
  } catch (err) {
    return false
  }
}


// CONSTRUCTORS

import * as T from 'fp-ts/lib/Task'

const foo = 'asdf' // string
const bar = T.of(foo) // T.Task<string>

// Same As
const fdsa: T.Task<string> = () => Promise.resolve(foo)


// Task Either

import axios from 'axios'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
(async () => {
  const ok = await pipe(
    TE.tryCatch(
      () => axios.get('https://httpstat.us/200'),
      (reason) => new Error(`${reason}`),
    ),
    TE.map((resp) => resp.data),
  )()

  console.log(ok)
  // { _tag: 'Right', right: { code: 200, description: 'OK' } }
})()

type Resp = { code: number; description: string }
;(async () => {
  const result = await pipe(
    TE.tryCatch(
      () => axios.get('https://httpstat.us/500'),
      (reason) => new Error(`${reason}`),
    ),
    TE.map((resp) => resp.data),
  )()

  console.log(result)
  /**
   * {
   *   _tag: 'Left',
   *   left: Error: Error: Request failed with status code 500
   *       at /tmp/either-demo/taskeither.ts:19:19
   *       at /tmp/either-demo/node_modules/fp-ts/lib/TaskEither.js:94:85
   *       at processTicksAndRejections (internal/process/task_queues.js:97:5)
   * }
   */
})()




// Folding

import { absurd, constVoid, pipe, unsafeCoerce } from 'fp-ts/lib/function'

const result = pipe(
  TE.tryCatch(
    () => axios.get('https://httpstat.us/200'),
    () => constVoid() as never,
  ),
  TE.map((resp) => unsafeCoerce<unknown, Resp>(resp.data)),
  TE.fold(absurd, T.of),
) // Not executing the promise

// Result is of type:
// T.Task<Resp>
