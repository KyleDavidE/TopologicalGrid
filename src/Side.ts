import { Point } from "./Point";


const enum Side {
    right = 0,
    bottom = 1,
    left = 2,
    top = 3
}

export {Side};

export const directions = [Side.right, Side.bottom, Side.left, Side.top];
type UnitDelta = { x: -1 | 1, y: 0 } | { y: -1 | 1, x: 0 };
function makeDelta(i: Side): UnitDelta {
    const delta = i > 1 ? -1 : 1;
    if (i & 1) {
        return { y: delta, x: 0 };
    } else {
        return { x: delta, y: 0 };
    }
}


const deltas = Array.from({ length: 4 }).map((_, i) => makeDelta(i));

export function getDelta(side: Side) {
    return deltas[side];
}

export function reverseSide(side: Side): Side {
    return side ^ 2;
}

export function getPerpendicularCW(side: Side): Side {
    return (side + 1) & 3;
}

export function getPerpendicularCCW(side: Side): Side {
    return (side + 3) & 3;
}

export function makePositive(side: Side): Side {
    return side & 1;
}

export function getTravel(side: Side): Side {
    return makePositive(getPerpendicularCW(side));
}

export function rotate(side: Side, by: Side | number): Side {
    return (side + by) & 3;
}

export function reflect(side: Side, { x, y }: { x: boolean, y: boolean }): Side {
    return (side & 1 ? y : x) ? reverseSide(side) : side;
}
export interface Reflection {
    x: boolean,
    y: boolean
}
export function invertReflection({ x, y }: Reflection) {
    return { x: !x, y: !y };
}
export function mergeReflections({ x, y }: Reflection, { x: x2, y: y2 }: Reflection) {
    return {
        x: x !== x2,
        y: y !== y2
    }
}

export function getOffside(posn: Point): Side | -1 {
    if (posn.x > 1) return Side.right;
    if (posn.x < -1) return Side.left;
    if (posn.y > 1) return Side.bottom;
    if (posn.y < -1) return Side.top;
    return -1;
}