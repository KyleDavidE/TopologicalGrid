import { Tile } from "./Tile";
import { TILE_SIZE } from "./opts";


export class ColorTile extends Tile{
    color: string;
    constructor(color: string){
        super();
        this.color = color;
        
    }

    render(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    }
}