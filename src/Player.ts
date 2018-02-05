import { RenderableEntity } from "./RenderableEntity";
import { TileView } from "./TileView";
import { Renderer } from "./Renderer";
import { TILE_SIZE } from "./opts";
import { App } from "./App";
import { Bolt } from "./Bolt";
import { Side } from "./Side";
const PLAYER_SIZE = 1/3;
const onScreenSize = TILE_SIZE*PLAYER_SIZE;
export class Player extends RenderableEntity{
    app: App;
    constructor(spawnPt: TileView, app: App){
        super(PLAYER_SIZE,PLAYER_SIZE,spawnPt);
        this.app = app;
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

    shoot(dir = this.lastMovementDir){
        const bolt = new Bolt(dir,this.center.view);
        bolt.move(
            this.center.pt.x - bolt.center.pt.x,
            this.center.pt.y - bolt.center.pt.y
        );
        this.app.addStepable(bolt);
    }
}