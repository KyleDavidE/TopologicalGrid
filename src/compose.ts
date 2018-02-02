export function strictCompose<X>(fns: ((x: X) => X)[]): ((x:X) => X){
    return fns.reduce((leftFn, rightFn) => (x: X) => leftFn(rightFn(x)), x=>x);
}