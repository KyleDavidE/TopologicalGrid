import {Side, getPerpendicularCCW} from './Side';
import { Cursor } from './Cursor';
import { Point } from './Point';


type DirMtx = 0|1|2|3|4|5|6|7|number;

export {DirMtx};

// function dirMtxApply(mtx: DirMTX, vec: Side): Side{
//     return (vec & 1 ? ((mtx & 0b11) + ((mtx & 0b100) ? 1 : -1) ) & 0b11 : mtx & 0b11) ^ (vec & 0b10);
// }

export function dirMtxApply(mtx: DirMtx, vec: Side): Side{
    return ( (mtx & 0b11) + ((mtx & 0b100) ? -vec : vec) ) & 0b11;
}

export function dirMtxProductImpl(left: DirMtx, right: DirMtx): DirMtx{
    const primary = dirMtxApply(left, dirMtxApply(right, 0));
    const secondary = dirMtxApply(left, dirMtxApply(right,1));
    if( (window as {[x: string]:any}).debug ) console.log(primary,secondary);
    return primary | ( getPerpendicularCCW(primary) === secondary ? 0b100 : 0)
}
export function dirMtxProduct(base: DirMtx,...args: DirMtx[]){
    return args.reduce(dirMtxProductImpl, base);
}

export function dirMtxInverse(mtx: DirMtx): DirMtx{
    return (mtx & 0b100) ? mtx : (- mtx) & 0b11;
}

export function makeDirMtx(dir: Side, det: boolean){
    return det ? (dir&0b11) | 0b100 : dir&0b11;
}

export function dirMtxApplyPt(mtx: DirMtx, pt: Point): Point{
    return new Cursor({ x: 0, y: 0 }).step(dirMtxApply(mtx, Side.right), pt.x).step(dirMtxApply(mtx, Side.bottom), pt.y)
}