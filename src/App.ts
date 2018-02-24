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

export class App {
    
    locCam: ViewCursor;
    watNumber: number;
    player: Player;
    stepables: Set<Stepable> = new Set<Stepable>();
    renderer: Renderer;
    can: HTMLCanvasElement;
    vel: Cursor = new Cursor({x:0,y:0});
    monitorKeys: KeyState<boolean> = {
        w:false,
        a:false,
        s:false,
        d:false,
        q:false
    };
    cam: ViewCursor;
    interactLock = false;
    currentWarp: {
        dest: TileView,
        mockPlayer: Player,
        progress: number
    } = {
        dest: level.getView(0),
        mockPlayer: new Player( level.getView(0), null),
        progress: 0.5
    };
    explodeLevel = 0
    explodeVelocity = 0
    constructor() {
        this.can = document.getElementById("can") as HTMLCanvasElement;
        this.renderer = new Renderer(this.can);
        
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
                if(Math.abs(e.movementX) < 200 && Math.abs(e.movementY) < 200){
                    this.killWarp();
                    this.player.move(e.movementX/TILE_SIZE,e.movementY/TILE_SIZE);
                }
            }
            this.allEvt(e);
        }
        this.player = new Player(level.getView(0).getNeighbor(Side.right), this);
        this.cam = this.player.center.clone();
    }

    tick(t: number, dt: number, wat: number) {
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
        if(this.currentWarp){
            this.currentWarp.progress += dt/1000;
            if(this.currentWarp.progress > 1){
                this.player.respawn(this.currentWarp.dest);
                this.player.move(this.currentWarp.mockPlayer.center.pt.x - 0.5,this.currentWarp.mockPlayer.center.pt.y - 0.5);
                this.killWarp();
            }
        }
        const ctr = this.locCam || this.player.center;
        this.cam.copy(ctr);
        const offsetX = 0;
        const offsetY = 0;
        this.explodeVelocity -= (this.monitorKeys.q ? -1 : 1) * dt / 1000 / 1000 * 5;
        this.explodeLevel += this.explodeVelocity * dt;
        if(this.explodeLevel > 0)
        {
            // this.explodeVelocity = 
        }else if(this.explodeLevel < 0){
            this.explodeVelocity = 0;
            this.explodeLevel = 0;
        }

        ctr.view.stepOn(t);
        if(!this.cam.move(offsetX, offsetY)){
            console.log("wat");
        }
        this.renderer.render(
            this.cam.view,
            this.cam.pt.x,
            this.cam.pt.y,
            t,
            offsetX,
            offsetY,
            this.currentWarp ? this.currentWarp.dest : null,
            this.currentWarp ? this.currentWarp.progress : 0,
            2**this.explodeLevel
        );  
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
            this.startWarpHome();
            // this.player.respawn(level.getView(0));
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
            this.killWarp();            
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
    killWarp(){
        if(this.explodeVelocity > -1/100) this.explodeVelocity = -1/100;
        if(this.currentWarp){
            this.currentWarp.progress = 0;
            this.currentWarp.mockPlayer.kill();
            this.currentWarp = null;
        }
    }
    startWarpHome(){
        if(!this.currentWarp){
            const viewTile = this.player.center.view;
            const isOnTile = this.player.trackingTiles.every((row) => row.every((tracker) => !tracker || tracker.view === viewTile));
            if(!isOnTile) return;
            const dest = level.getView(0);
            this.currentWarp = {
                dest: dest,
                mockPlayer: new Player(dest, this),
                progress: 0
            }
            this.currentWarp.mockPlayer.move(
                this.player.center.pt.x - 0.5,
                this.player.center.pt.y - 0.5
            );
            
        }
    }
    addStepable(stepable: Stepable){
        this.stepables.add(stepable);
    }
}

