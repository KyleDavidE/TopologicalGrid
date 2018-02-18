import { Projector } from "./Projector";
import { TileView } from "./TileView";
import { DirMtx, dirMtxApply } from "./DirMtx";
import { TILE_SIZE } from "./opts";
import { RenderableEntity } from "./RenderableEntity";
import { Side } from "./Side";

function maxSquareSquare(z: number) {
    return Math.max(z ** 2, (z + 1) ** 2);
}
const debugColors = ['red', 'green', 'blue', 'cyan', 'orange'];
function debugColor() {
    return debugColors[(Math.random() * debugColors.length) | 0];
}
const DEBUG = false;
const SUPERDebug = false;
const TARGET_SIZE = 12;
// const DEBUGMAP = {7:true, 3:true};
export class Renderer {
    overlay: CanvasGradient;
    ctx: CanvasRenderingContext2D;
    can: HTMLCanvasElement;
    projector = new Projector();
    scale: number
    constructor(can: HTMLCanvasElement) {
        this.can = can;
        this.ctx = can.getContext('2d');
    }

    render(root: TileView, offsetX: number, offsetY: number, t:number, displayOffsetX: number, displayOffsetY: number, warpDest: TileView, warpProg: number ) {        
        const scale = this.scale = 1/Math.max(TILE_SIZE*TARGET_SIZE/this.can.width,TILE_SIZE*TARGET_SIZE/this.can.height);
        
        const items = this.projector.project(root, offsetX, offsetY, this.can.width / TILE_SIZE / 2 / scale, this.can.height / TILE_SIZE / 2 / scale, displayOffsetX, displayOffsetY, warpDest, warpProg);
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0,0,this.can.width,this.can.height);
        this.ctx.save();
        

        this.ctx.translate(this.can.width / 2, this.can.height / 2);
        this.ctx.scale(scale,scale);
        
        this.ctx.translate( (displayOffsetX * TILE_SIZE), (displayOffsetY * TILE_SIZE));
        
        // this.ctx.scale(TILE_SIZE, TILE_SIZE);

        const r = Math.sqrt(
            maxSquareSquare(this.can.width + offsetX * TILE_SIZE) +
            maxSquareSquare(this.can.height + offsetY * TILE_SIZE)
        ) / 2;

        for (let item of items) {
            // if (DEBUG) console.log(item);
            
            this.ctx.save();
            if(SUPERDebug){
                if( (item.x !== 0 || item.y !== -2)){

                
                this.ctx.beginPath();
                this.ctx.rect( (item.x  - offsetX) * TILE_SIZE, (item.y - offsetY) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                this.ctx.clip();
                }else{
                    this.ctx.beginPath();
                    this.ctx.moveTo(1000 * Math.cos(item.minTheta), 1000 * Math.sin(item.minTheta));
                    this.ctx.lineTo(0,0);
                    this.ctx.lineTo(1000 * Math.cos(item.maxTheta), 1000 * Math.sin(item.maxTheta))
                    this.ctx.strokeStyle = 'orange';
                    this.ctx.stroke();
                }
            }
            
            if( /* !item.isRoot && */ item.anglesLength !== 2){
                this.ctx.beginPath();
                
                for (let i = 0; i < item.anglesLength; i += 2) {

                    const fromAng = item.angles[i];
                    const toAng = item.angles[i + 1];
                    if(fromAng === toAng) continue;
                    const sf = Math.abs(1/Math.cos( (fromAng-toAng) / 2));
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(Math.cos(fromAng) * r * sf, Math.sin(fromAng) * r * sf);

                    // this.ctx.arc(0, 0, r * TILE_SIZE, fromAng, toAng);
                    this.ctx.lineTo(Math.cos(toAng) * r * sf, Math.sin(toAng) * r * sf);
                    
                    this.ctx.lineTo(0, 0);
                }
                if (DEBUG) {
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = "pink";
                    this.ctx.stroke();
                }
                
                this.ctx.clip();
                
            }
            const translateX = ( (item.x -offsetX)* TILE_SIZE);
            const translateY = ((item.y-offsetY) * TILE_SIZE);
            this.ctx.translate( translateX , translateY);

            this.applyOrientation(item.view.orientation);
            const leftOrientation = dirMtxApply(item.view.orientation, Side.left);
            const topOrientation = dirMtxApply(item.view.orientation, Side.top);
            

            // this.ctx.beginPath();
            // this.ctx.rect(0, 0, 1, 1);
            // this.ctx.clip();
            const cornerDist = (leftOrientation & 0b1 ? translateY  : translateX);
            const cornerShear = (topOrientation & 0b1 ? translateY  : translateX);
            
            item.view.tile.render(this.ctx, t,  leftOrientation &0b10 ? cornerDist : (-TILE_SIZE-cornerDist), topOrientation &0b10 ? cornerShear : (-TILE_SIZE-cornerShear));
            if(DEBUG){
                this.ctx.fillStyle = "black";
                
                this.ctx.fillText(
                    `${item.view.id}`,
                    10,
                    10
                );
            }

            let entitiesInit = false;
            const tile = item.view.tile;
            for(let entity of item.view.tile.entities){

                const isOnTile = entity.isOnTile(item.view.tile);

                if(!isOnTile){
                    tile.entities.delete(entity);
                }else{
                    if(!entitiesInit){
                        this.ctx.beginPath();
                        this.ctx.rect(0,0,TILE_SIZE,TILE_SIZE);
                        this.ctx.clip();
                        entitiesInit= true;
                    }
                    entity.renderInContext(this, item.view.tile);
                }
                
            }

            this.ctx.restore();
        }

        // this.ctx.beginPath();
        // this.ctx.fillStyle = 'black';
        // this.ctx.arc(0, 0, TILE_SIZE / 3, 0, Math.PI * 2);

        // this.ctx.fill();

        

        this.ctx.restore();

        // this.ctx.beginPath();
        // for (let x = (this.can.width / 2 - offsetX * TILE_SIZE) % TILE_SIZE - TILE_SIZE; x < this.can.width; x += TILE_SIZE) {
        //     this.ctx.moveTo(x, 0);
        //     this.ctx.lineTo(x, this.can.height);
        // }
        // for (let y = (this.can.height / 2 - offsetY * TILE_SIZE) % TILE_SIZE - TILE_SIZE; y < this.can.height; y += TILE_SIZE) {
        //     this.ctx.moveTo(0, y);
        //     this.ctx.lineTo(this.can.width, y);
        // }    
        // this.ctx.strokeStyle = 'rgba(255,255,255,1)';
        // this.ctx.lineWidth = 1;
        // this.ctx.stroke();

    }

    applyOrientation(orientation: DirMtx, doTranslate = true) {
        const { ctx } = this;
        if(doTranslate) this.ctx.translate(0.5 * TILE_SIZE, 0.5 * TILE_SIZE);
        ctx.rotate((orientation & 0b11) * Math.PI / 2);
        if (orientation & 0b100) ctx.scale(1, -1);
        if(doTranslate) this.ctx.translate(-0.5 * TILE_SIZE, -0.5 * TILE_SIZE);        
    }

}