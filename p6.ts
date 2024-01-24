// Monad

export interface None {
    readonly _tag: 'None'
  }
  export interface Some<A> {
    readonly _tag: 'Some'
    readonly value: A
  }
  declare type Option<A> = None | Some<A>
  export declare const none: Option<never>
  
  // this option "contains" nothing
  const option = {
    of: <A>(a: A) => none,
    map: <A, B>(fa: Option<A>, f: (a: A) => B) => none,
    chain: <A, B>(fa: Option<A>, f: (a: A) => Option<B>) => none,
    ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>) => none,
  }