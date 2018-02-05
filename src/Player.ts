import { RenderableEntity } from "./RenderableEntity";
import { TileView } from "./TileView";
import { Renderer } from "./Renderer";
import { TILE_SIZE } from "./opts";

const onScreenSize = TILE_SIZE/2;
export class Player extends RenderableEntity{
    constructor(spawnPt: TileView){
        super(1/2,1/2,spawnPt)
    }
    render(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(0,0,onScreenSize/2,onScreenSize/2);
        ctx.fillRect(0,0,onScreenSize/2,onScreenSize/2);
        ctx.strokeRect(0,onScreenSize/2,onScreenSize,onScreenSize/2);
        ctx.fillRect(0,onScreenSize/2,onScreenSize,onScreenSize/2);
        
    }
}