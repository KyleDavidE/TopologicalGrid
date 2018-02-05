import { Renderer } from "./Renderer";
import * as testLevels from './testLevels';
import { TileView } from "./TileView";
import { Cursor } from "./Cursor";
import { Side, reverseSide, getOffside} from "./Side";
import { Player } from "./Player";
import { Stepable } from "./stepable";

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


const shootKeys: KeyState<Side> = {
    i: Side.top,
    l: Side.right,
    k: Side.bottom,
    j: Side.left
}
const PLAYER_SPEED = 5/1000

export class App {
    
    player: Player;
    stepables: Set<Stepable> = new Set<Stepable>();
    renderer: Renderer;
    can: HTMLCanvasElement;
    vel: Cursor = new Cursor({x:0,y:0});
    monitorKeys: KeyState<boolean> = {
        w:false,
        a:false,
        s:false,
        d:false
    };
    interactLock = false
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
        this.player = new Player(level.getView(0).getNeighbor(Side.right), this);
    }

    tick(t: number, dt: number) {
        if(this.can.width !== innerWidth || this.can.height !== innerHeight){
            this.can.width = innerWidth;
            this.can.height = innerHeight;
        }
        
        this.tryMove(dt);
        for(let stepable of this.stepables){
            if(!stepable.step(dt)){
                this.stepables.delete(stepable);
            }
        }
        const ctr = this.player.center;
        
        ctr.view.stepOn(t);
        
        this.renderer.render(
            ctr.view,
            ctr.pt.x,
            ctr.pt.y,
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
        if(e.key === "e" && !this.interactLock){
            this.interactLock = true;
            this.player.center.view.interact(performance.now());

        }
        if(e.key in shootKeys){
            this.player.shoot(shootKeys[e.key]);
        }
    }
    keyUp(e: KeyboardEvent) {
        if (e.key in this.monitorKeys) {
            this.monitorKeys[e.key] = false;
        }
        if(e.key === "e"){
            this.interactLock = false;
        }
        if(e.key === "h"){
            this.player.respawn(level.getView(0));
        }
    }
    tryMove(dt: number){
        this.vel.x = 0;
        this.vel.y = 0;
        for(let key in movementKeys){
            if(this.monitorKeys[key]){
                this.vel.step(
                    movementKeys[key],
                    PLAYER_SPEED * dt
                );
            }
        }
        if(this.vel.x !== 0 || this.vel.y !== 0){
            this.player.move(this.vel.x, this.vel.y);
        }
        // if(this.posn.x > 1){
        //     if(!this.tryStep(Side.right)){
        //         this.posn.x = 1
        //     }
        // }
        // if (this.posn.y > 1) {
        //     if (!this.tryStep(Side.bottom)) {
        //         this.posn.y = 1;
        //     }
        // }
        // if (this.posn.x < 0) {
        //     if (!this.tryStep(Side.left)) {
        //         this.posn.x = 0;
        //     }
        // }
        // if (this.posn.y < 0) {
        //     if (!this.tryStep(Side.top)) {
        //         this.posn.y = 0;
        //     }
        // }
        
    }
    // tryStep(dir: Side){
    //     if(this.view.getNeighbor(dir)){
    //         this.view = this.view.getNeighbor(dir);
    //         this.posn.step(dir,-1);
    //         return true;
    //     }
    //     return false;
    // }
    addStepable(stepable: Stepable){
        this.stepables.add(stepable);
    }
}

