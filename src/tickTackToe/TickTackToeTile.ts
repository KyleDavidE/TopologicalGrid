import { ColorTile } from "../ColorTile";
import { TILE_SIZE } from "../opts";
import { Side } from "../Side";
import { TileView } from "../TileView";
import { strictCompose } from "../compose";

enum Turn{
    RED = -1,
    NONE = 0,
    BLACK = 1,
}

function turnColor(turn: Turn){
    return turn === Turn.RED ? "RED" : turn === Turn.BLACK ? "black" : "grey";
}
 
class TickTackToeGame{
    turn = Turn.RED
    won = Turn.NONE
    blankTiles = 0
}
const MARGIN = TILE_SIZE / 6;
function singleStepMovement(dir: Side){
    return (t: TileView) => {
        if(!t) return null;
        return t.getNeighbor(dir);
    }
}
function movement(dirs: Side[]){
    return strictCompose(
        dirs.map(singleStepMovement)
    )
}
const movementMethods = [
    [Side.top,Side.bottom].map(singleStepMovement),
    [Side.left,Side.right].map(singleStepMovement),
    [
        [Side.left, Side.bottom],
        [Side.top, Side.right]
    ].map(movement),
    [
        [Side.bottom, Side.left],
        [Side.right, Side.top]
    ].map(movement),
    [
        [Side.left, Side.top],
        [Side.bottom, Side.right]
    ].map(movement),
    [
        [Side.top, Side.left],
        [Side.right, Side.bottom]
    ].map(movement)
]



export class TickTackToeTile extends ColorTile{
    
    constructor(lengthForWin = 3){
        super("white");
        this.lengthForWin = lengthForWin;
    }
    lengthForWin: number
    occupied = Turn.NONE;
    game: TickTackToeGame = null;
    isWinningLine = false;
    render(ctx: CanvasRenderingContext2D, t: number, playerDist: number, playerShear: number){

        super.render(ctx,t, playerDist, playerShear);

        ctx.fillStyle = turnColor(this.occupied);

        const margin = this.game && ( (this.game.won !== Turn.NONE || this.game.blankTiles === 0) && !this.isWinningLine) ? MARGIN * 2 : MARGIN;
        ctx.fillRect(margin,margin,TILE_SIZE-margin*2,TILE_SIZE-margin*2);

        if(this.game && t-this.stepTime < 100){
            ctx.strokeStyle = turnColor(this.game.turn);
            ctx.lineWidth = 5;
            ctx.strokeRect(margin,margin,TILE_SIZE-margin*2,TILE_SIZE-margin*2);
            
        }
        
    }
    tallyInDir(movmentPattern: (t: TileView) => TileView){
        let view = this.getView(0);
        for(let i = 0; i < this.lengthForWin; i++){
            view = movmentPattern(view);
            if(!view || !(view.tile instanceof TickTackToeTile && view.tile.occupied === this.occupied)){
                return i;
            }
        }
        return this.lengthForWin;
    }
    drawWinningLine(movmentPattern: (t: TileView) => TileView){
        let view = this.getView(0);
        for(let i = 0; i < this.lengthForWin; i++){
            view = movmentPattern(view);
            if(!view || !(view.tile instanceof TickTackToeTile && view.tile.occupied === this.occupied)){
                return;
            }
            view.tile.isWinningLine = true;
        }
    }
    didWin(){
        for(let pair of movementMethods){
            const n = this.tallyInDir(pair[0]) + this.tallyInDir(pair[1]) + 1;
            if(n >= this.lengthForWin){
                this.drawWinningLine(pair[0]);
                this.drawWinningLine(pair[1]);
                this.isWinningLine = true;
                return true;                
            }
        }
        return false;
    }
    linkGame(game: TickTackToeGame = new TickTackToeGame()) {
        if(this.game !== game){
            this.occupied = Turn.NONE;
            this.isWinningLine = false;
            this.game = game;
            game.blankTiles++;
            this.links.forEach((link) => {
                if(!link) return;
                const tile = link.to;

                if(tile instanceof TickTackToeTile){
                    tile.linkGame(game);
                }
            })
        }
    }
    stepOn(t: number){
        super.stepOn(t);
        if(this.game === null){
            this.linkGame();    
        }
        
    }
    interact(){
        if(this.game === null || this.game.won !== Turn.NONE || this.game.blankTiles  === 0){
            this.linkGame();
            return;
        }
        if(this.occupied === Turn.NONE){
            this.occupied = this.game.turn;
            this.game.turn = -this.game.turn;
            this.game.blankTiles--;
            if(this.didWin()){
                this.game.won = this.occupied;
            }
        }
        
        

    }
}