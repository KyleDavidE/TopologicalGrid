import { Renderer } from "./Renderer";
import * as testLevels from './testLevels';
import { TileView } from "./TileView";
import { Cursor } from "./Cursor";
import { Side, reverseSide, getOffside} from "./Side";

const level = testLevels.hubRoom();

interface KeyState<Val>{
    [key: string]: Val
}
const movementKeys: KeyState<Side> = {
    w: Side.top,
    a: Side.left,
    s: Side.bottom,
    d: Side.right
}
const PLAYER_SPEED = 5/1000

export class App {
    
    renderer: Renderer;
    can: HTMLCanvasElement;
    posn: Cursor = new Cursor({x:0,y:0});
    view: TileView = level.getView(0);
    monitorKeys: KeyState<boolean> = {
        w:false,
        a:false,
        s:false,
        d:false
    }
    constructor() {
        this.can = document.getElementById("can") as HTMLCanvasElement;
        this.renderer = new Renderer(this.can);
        
        requestAnimationFrame(t =>
            requestAnimationFrame(
                (nt) => this.tick(nt, nt - t)
            )
        );

        document.onkeydown = (e) => {
            this.keyDown(e);
        }
        document.onkeyup = (e) => {
            this.keyUp(e);
        }
    }

    tick(t: number, dt: number) {
        if(this.can.width !== innerWidth || this.can.height !== innerHeight){
            this.can.width = innerWidth;
            this.can.height = innerHeight;
        }
        this.view.stepOn(t);
        
        this.tryMove(dt);
        this.renderer.render(
            this.view,
            this.posn.x,
            this.posn.y,
            t
        );

        requestAnimationFrame(
            (nt) => this.tick(nt, nt - t)
        );
    }

    keyDown(e: KeyboardEvent){
        if (e.key in this.monitorKeys){
            this.monitorKeys[e.key] = true;
        }
    }
    keyUp(e: KeyboardEvent) {
        if (e.key in this.monitorKeys) {
            this.monitorKeys[e.key] = false;
        }
    }
    tryMove(dt: number){
        for(let key in movementKeys){
            if(this.monitorKeys[key]){
                this.posn.step(
                    movementKeys[key],
                    PLAYER_SPEED * dt
                );
            }
        }
        if(this.posn.x > 1){
            if(!this.tryStep(Side.right)){
                this.posn.x = 1
            }
        }
        if (this.posn.y > 1) {
            if (!this.tryStep(Side.bottom)) {
                this.posn.y = 1;
            }
        }
        if (this.posn.x < 0) {
            if (!this.tryStep(Side.left)) {
                this.posn.x = 0;
            }
        }
        if (this.posn.y < 0) {
            if (!this.tryStep(Side.top)) {
                this.posn.y = 0;
            }
        }
        
    }
    tryStep(dir: Side){
        if(this.view.getNeighbor(dir)){
            this.view = this.view.getNeighbor(dir);
            this.posn.step(dir,-1);
            return true;
        }
        return false;
    }
}

