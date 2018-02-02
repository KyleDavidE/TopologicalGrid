import { getDelta, Side } from "./Side";
import { Point } from "./Point";


export class Cursor implements Point{
    x: number
    y: number

    constructor(p: Point){
        this.x = p.x;
        this.y = p.y;
    }

    step(side: Side, mag: number = 1){
        const {x: dx, y:dy} = getDelta(side);
        this.x += dx * mag;
        this.y += dy * mag;
        return this;
    }

    fork(){
        return new Cursor(this);
    }
}