import { Tile } from "./Tile";
import { TILE_SIZE } from "./opts";


export class ColorTile extends Tile{
    stepTime: number;
    color: string;
    constructor(color: string){
        super();
        this.color = color;
        
    }

    render(ctx: CanvasRenderingContext2D, t: number){
        super.render(ctx, t);
        ctx.globalAlpha = 1 - Math.pow(2, (this.stepTime - t) / 1000) / 3;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.globalAlpha = 1;
        
    }

    stepOn(t: number){
        this.stepTime = t;
    }
}