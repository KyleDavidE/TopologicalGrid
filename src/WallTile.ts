import {Tile} from "./Tile";
import { TILE_SIZE } from "./opts";
import { SideReference } from "./SideReference";
const PERSPECTIVE = 1/5;
export class WallTile extends Tile{
    height: number;
    walkable = false;
    wallShade: number;
    constructor(height = 1){
        super();
        this.height = height;
        this.wallShade =  1 - 0.5 * Math.random() 
    }
    render(ctx: CanvasRenderingContext2D, t: number, playerDist: number, playerShear: number){
        super.render(ctx, t, playerDist, playerShear);
        if(playerDist > 0){
            ctx.globalAlpha = this.wallShade;
            
            ctx.fillStyle = "grey";
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(playerDist * PERSPECTIVE * this.height, playerShear * PERSPECTIVE * this.height);
            ctx.lineTo(playerDist * PERSPECTIVE * this.height, (playerShear + TILE_SIZE) * PERSPECTIVE * this.height + TILE_SIZE);
            ctx.lineTo(0,TILE_SIZE);
            ctx.fill();
            

        }
    }
}