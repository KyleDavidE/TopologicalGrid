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
    
    move(dx: number, dy: number){
        let xSide = dx < 0 ? Side.left : Side.right;
        let ySide = dy < 0 ? Side.top : Side.bottom;
        
        let xLeft = Math.abs(dx);
        let yLeft = Math.abs(dy);
        let xLocked = xLeft === 0;
        let yLocked = yLeft === 0;
        let i = 0;
        while( (xLeft > 0 || yLeft > 0) && i < 100){
            i++;
            if(!xLocked && xLeft > 0){
                let oPosn = xLeft;
                xLeft = this.tryMove(xSide, xLeft);
                yLocked = yLocked && (oPosn === xLeft || yLeft <= 0);
                xLocked = true;
            }
            if(yLocked) break;
            if(!yLocked && yLeft > 0){
                let oPosn = yLeft;
                yLeft = this.tryMove(ySide, yLeft);
                xLocked =xLocked &&(oPosn === yLeft || xLeft <= 0);
                yLocked = true;
            }
            if(xLocked) break;
        }
        if(xLeft !== 0 && yLeft !== 0) console.log(xLeft,yLeft);

        return xLeft === 0 && yLeft === 0;

        
        


    }
    tryMove(dir: Side, dist: number){
        let i = 0;
        let left = dist;
        while(left > 0 && i < 100){
            i--;
            const canMove = Math.min(this.movementUpToEdge(dir), left);
            if(canMove > 0){
                this.moveWithinTile(dir, canMove);
            }
            left -= canMove;
            
            if(left === canMove) break;

            if(!this.tryCrossEdge(dir)) break;
            

        }

        return left;
    }


}