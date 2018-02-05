import { RenderableEntity } from "./RenderableEntity";
import { Stepable } from "./stepable";
import { TileView } from "./TileView";
import { Side, getDelta } from "./Side";
import { Point } from "./Point";
import { TILE_SIZE } from "./opts";

const BOLT_SPEED = 10/1000;

export class Bolt extends RenderableEntity implements Stepable {
    age: number;
    dir: Side;
    dirPt: Point;
    constructor(dir: Side, tile: TileView){
        super(dir & 1 ? 1/6 : 5/6, dir & 1 ? 5/6 : 1/6,tile);
        this.age = 0;
        this.dir = dir;
        this.dirPt = getDelta(dir);
    }
    step(dt: number): boolean {
        this.age += dt;
        const hitWall = !this.move(this.dirPt.x*BOLT_SPEED*dt,this.dirPt.y*BOLT_SPEED*dt);
        if(hitWall){
            this.age += dt * 10;
        }
        const stayAlive = this.age < 5000;
        if(!stayAlive) this.kill();
        return stayAlive;
    }
    render(ctx: CanvasRenderingContext2D){
        ctx.lineWidth = 2;
        ctx.fillStyle = "red";
        ctx.fillRect(0,0,this.width*TILE_SIZE,this.height*TILE_SIZE);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0,0,this.width*TILE_SIZE,this.height*TILE_SIZE);
    }
}