import { Entity } from "./Entity";
import { Tile } from "./Tile";
import { Renderer } from "./Renderer";
import { dirMtxInverse } from "./DirMtx";
import { TILE_SIZE } from "./opts";
import { TileView } from "./TileView";


export class RenderableEntity extends Entity{
    gone = false;
    constructor(width: number, height: number, baseTile: TileView){
        super(width, height, baseTile);
        console.log(this.trackingTiles);
        this.register();
    }
    move(dx: number, dy: number){
        const out = super.move(dx, dy);
        this.register();
        return  out;
    }
    respawn(tile: TileView){
        super.respawn(tile);
        this.register();
    }
    render(ctx: CanvasRenderingContext2D){
        
    }
    kill(){
        this.gone = true;
    }
    
    isOnTile(tile: Tile){
        if(this.gone) return false;
        for(let x = 0; x < this.trackWidth; x++){
            for(let y = 0; y < this.trackWidth; y++){
                if(this.trackingTiles[x][y].view.tile.id === tile.id){
                    return true;
                }
            }
        }
        return false;
    }
    
    register(){
        for(let x = 0; x < this.trackWidth; x++){
            for(let y = 0; y < this.trackWidth; y++){
                this.trackingTiles[x][y].view.track(this);
            }
        }
    }
    renderInContext(renderer: Renderer, tile: Tile){
        const renderHistory = new Set();
        (window as {[x:string]:any}).rh = renderHistory;
        for(let x = 0; x < this.trackWidth; x++){
            for(let y = 0; y < this.trackWidth; y++){
                const tracker = this.trackingTiles[x][y];
                if(tracker.view.tile === tile){
                    const renderKey = `${tracker.view.orientation}/${tracker.pt.x-tracker.onEntityX}/${tracker.pt.y-tracker.onEntityY}`;
                    
                    if(!renderHistory.has(renderKey)){
                        renderHistory.add(renderKey);
                        renderer.ctx.save();
                        renderer.applyOrientation(
                            dirMtxInverse(tracker.view.orientation)
                        );
                        renderer.ctx.translate(
                            (tracker.pt.x-tracker.onEntityX) * TILE_SIZE,
                            (tracker.pt.y-tracker.onEntityY) * TILE_SIZE
                        );
                        this.render(renderer.ctx);
                        renderer.ctx.restore();
                    }
                }
            }
        }
    }
}