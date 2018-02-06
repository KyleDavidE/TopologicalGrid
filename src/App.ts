import { Renderer } from "./Renderer";
import * as testLevels from './testLevels';
import { TileView } from "./TileView";
import { Cursor } from "./Cursor";
import { Side, reverseSide, getOffside} from "./Side";
import { Player } from "./Player";
import { Stepable } from "./stepable";
import { TILE_SIZE } from "./opts";
import { ViewCursor } from "./ViewCursor";

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
const N_CAM = 3;
export class App {
    
    locCam: ViewCursor;
    watNumber: number;
    player: Player;
    stepables: Set<Stepable> = new Set<Stepable>();
    renderers: Renderer[];
    cans: HTMLCanvasElement[];
    can: HTMLCanvasElement
    vel: Cursor = new Cursor({x:0,y:0});
    monitorKeys: KeyState<boolean> = {
        w:false,
        a:false,
        s:false,
        d:false
    };
    cam: ViewCursor;
    interactLock = false
    constructor() {
        this.cans = Array.from(Array(N_CAM), (_,i) => document.createElement("canvas"));
        this.cans.forEach((e)=>document.body.appendChild(e));
        this.renderers = this.cans.map(e=>new Renderer(e));
        this.can = this.cans[N_CAM-1];
        requestAnimationFrame(t =>
            requestAnimationFrame(
                (nt) => this.tick(nt, nt - t, Math.random())
            )
        );

        document.onkeydown = (e) => {
            this.keyDown(e);
        }
        document.onkeyup = (e) => {
            this.keyUp(e);
        }
        this.can.ondblclick = (e) => {
            this.can.requestPointerLock();
            this.allEvt(e);
        }
        this.can.onmousemove = (e) => {
            if(document.pointerLockElement === this.can){
                if(Math.abs(e.movementX) < 200 && Math.abs(e.movementY) < 200) this.player.move(e.movementX/TILE_SIZE,e.movementY/TILE_SIZE)
            }
            this.allEvt(e);
        }
        this.player = new Player(level.getView(0).getNeighbor(Side.right), this);
        this.cam = this.player.center.clone();
    }

    tick(t: number, dt: number, wat: number) {
        
        this.tryMove(dt);
        for(let stepable of this.stepables){
            if(!stepable.step(dt)){
                this.stepables.delete(stepable);
            }
        }
        const ctr = this.locCam || this.player.center;
        for(let i = 0; i < this.cans.length; i++){
            const can = this.cans[i];
            const renderer = this.renderers[i];
            this.cam.copy(ctr);
            if(can.width !== innerWidth || can.height !== innerHeight){
                can.width = innerWidth;
                can.height = innerHeight;
            }
            
            const offsetX = Math.sin(t/1000000 + i / N_CAM * 2 * Math.PI)/8;
            const offsetY = Math.cos(t/1000000 + i / N_CAM * 2 * Math.PI)/8;
            
            ctr.view.stepOn(t);
            if(!this.cam.move(offsetX, offsetY)){
                console.log("wat");
            }
            renderer.render(
                this.cam.view,
                this.cam.pt.x,
                this.cam.pt.y,
                t,
                offsetX,
                offsetY
            );
        }
        
        if(this.watNumber !== wat)  console.log('wat');
        this.watNumber = wat;

        requestAnimationFrame(
            (nt) => this.tick(nt, nt - t, wat)
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
        this.allEvt(e);
        
    }
    allEvt(e: MouseEvent|KeyboardEvent){
        if(e.shiftKey && !this.locCam){
            this.locCam = this.player.center.clone();
        }
        if(!e.shiftKey){
            this.locCam = null;
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
        this.allEvt(e);
        
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

