import { Tile } from "./Tile";
import { TILE_SIZE } from "./opts";


export class ColorTile extends Tile{
    noiseLevel: number;
    stepTime: number = 0;
    color: string;
    constructor(color: string){
        super();
        this.color = color;
        this.noiseLevel = 1 - Math.random() * 0.2;
    }

    render(ctx: CanvasRenderingContext2D, t: number){
        super.render(ctx, t);
        ctx.globalAlpha = (1 - Math.pow(2, (this.stepTime - t) / 1000) / 3) * this.noiseLevel;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "black";
    }

    stepOn(t: number){
        this.stepTime = t;
    }
}