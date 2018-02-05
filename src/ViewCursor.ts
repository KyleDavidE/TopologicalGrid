import { TileView } from "./TileView";
import { Cursor } from "./Cursor";
import { Point } from "./Point";
import { Side } from "./Side";

export class ViewCursor{
    view: TileView;
    pt: Cursor;
    onEntityX: number;
    onEntityY: number;
    constructor(view: TileView,x:number,y:number, onEntityX: number, onEntityY: number){
        this.view = view;
        this.pt = new Cursor({x,y});
        this.onEntityX = onEntityX;
        this.onEntityY = onEntityY;
    }
    movementUpToEdge(dir: Side){
        switch(dir){
            case Side.left: return this.pt.x;
            case Side.right: return 1-this.pt.x;
            case Side.top: return this.pt.y;
            case Side.bottom: return 1-this.pt.y;
            
        }
    }
    moveWithinTile(dir: Side, dist: number){
        this.pt.step(dir, dist);
        
    }
    tryCrossEdge(dir: Side): boolean{
        if(this.movementUpToEdge(dir) === 0){
            const next = this.view.getNeighbor(dir);
            if(!next) return false;
            this.pt.step(dir,-1);
            this.view = next;
            return true;            
        }

        return true;
    }
    copy(other: ViewCursor){
        this.pt = other.pt.fork();
        this.view = other.view;
        this.onEntityY = other.onEntityY;
        this.onEntityX = other.onEntityX;
    }
    clone(){
        return new ViewCursor(this.view, this.pt.x, this.pt.y,this.onEntityX,this.onEntityY);
    }
}