import { ViewCursor } from "./ViewCursor";
import { Side } from "./Side";
import { TileView } from "./TileView";

export class Entity{
    trackingTiles: ViewCursor[][];
    trackingTilesOld: ViewCursor[][];
    trackWidth: number = 2;
    trackHeight: number = 2;
    center: ViewCursor;
    centerOld: ViewCursor;
    width: number
    height: number
    lastMovementDir: Side
    constructor(width: number, height: number, baseTile: TileView){
        this.init(width,height,baseTile);
        
    }
    respawn(view: TileView){
        this.init(this.width,this.height, view);
    }
    init(width: number, height: number, baseTile: TileView){
        this.width = width;
        this.height = height;
        if(width > 1 || height > 1) throw new RangeError("we do not yet suport entities larger than one tile");
        this.trackingTiles = Array(this.trackWidth);
        this.trackingTilesOld = Array(this.trackWidth);
        
        for(let x = 0; x < this.trackWidth; x++){
            this.trackingTiles[x] = Array(this.trackHeight);
            this.trackingTilesOld[x] = Array(this.trackHeight);
            for(let y = 0; y < this.trackHeight; y++){
                const trackingPointX = width/(this.trackWidth-1) * x,
                trackingPointY = height/(this.trackHeight-1) * y
                const tracker = new ViewCursor(baseTile,
                    0.5 - (width/2) + trackingPointX,
                    0.5 - (height/2) + trackingPointY,
                    trackingPointX,
                    trackingPointY
                );
                this.trackingTiles[x][y] = tracker;
                this.trackingTilesOld[x][y] = tracker.clone();
            }
        }
        this.center = new ViewCursor(baseTile, 0.5,0.5,width/2,height/2);
        this.centerOld = this.center.clone();
    }
    move(dx: number, dy: number){
        let xSide = dx < 0 ? Side.left : Side.right;
        let ySide = dy < 0 ? Side.top : Side.bottom;
        
        let xLeft = Math.abs(dx);
        let yLeft = Math.abs(dy);
        let xLocked = xLeft === 0;
        let yLocked = yLeft === 0;
        let i = 0;
        this.lastMovementDir = xLeft >= yLeft ? xSide : ySide;
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

        return xLeft === 0 && yLeft === 0;

        
        


    }




    tryMove(side: Side, dist: number): number{
        let distLeft = dist;
        let i = 0;
        while(distLeft > 0 && i < 100){
            i++;
            //move to edge of tile
            let maxMovement = distLeft;
            for(let x = 0; x < this.trackWidth; x++){
                for(let y = 0; y < this.trackWidth; y++){                    
                    const newDist = this.trackingTiles[x][y].movementUpToEdge(side);
                    if(newDist < maxMovement) maxMovement = newDist;
                }
            }
            const newDist = this.center.movementUpToEdge(side);
            if(newDist < maxMovement) maxMovement = newDist;

            
            if(maxMovement > 0){
                for(let x = 0; x < this.trackWidth; x++){
                    for(let y = 0; y < this.trackWidth; y++){
                        
                        
                        this.trackingTiles[x][y].moveWithinTile(side, maxMovement);

                        
                    }
                }
                this.center.moveWithinTile(side,maxMovement);
            }
            if(maxMovement === distLeft){
                distLeft = 0;
                break;
            }
            distLeft -= maxMovement;
            //cross edge
            let crossingValid = true;

            for(let x = 0; x < this.trackWidth; x++){
                for(let y = 0; y < this.trackWidth; y++){
                    const thisTracker = this.trackingTiles[x][y];
                    
                    this.trackingTilesOld[x][y].copy(thisTracker);
                    crossingValid = crossingValid && thisTracker.tryCrossEdge(side) && thisTracker.view.tile.walkable;
                }
            }
            this.centerOld.copy(this.center);
            crossingValid = crossingValid && this.center.tryCrossEdge(side) && this.center.view.tile.walkable;
           

            if(crossingValid){
                outer: for(let x = 0; x < this.trackWidth; x++){
                    for(let y = 0; y < this.trackWidth; y++){
                        const tgtView = this.trackingTiles[x][y].view;                        
                        if(x !== 0){
                            const leftView = this.trackingTiles[x-1][y].view;
                            crossingValid = crossingValid && (
                                tgtView === leftView || tgtView.getNeighbor(Side.left) === leftView
                            );
                        }
                        if(y !== 0){
                            const topView = this.trackingTiles[x][y-1].view;
                            crossingValid = crossingValid && (
                                tgtView === topView || tgtView.getNeighbor(Side.top) === topView
                            );
                        }
                        
                        if(!crossingValid){
                            break outer;
                        }
                    }
                }
            }
            

            if(!crossingValid){
                for(let x = 0; x < this.trackWidth; x++){
                    for(let y = 0; y < this.trackWidth; y++){
                        this.trackingTiles[x][y].copy(this.trackingTilesOld[x][y]);
                    }
                }
                this.center.copy(this.centerOld);
                break;
            }            
        }
        return distLeft;
    }

    
}