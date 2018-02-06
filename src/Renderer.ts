import { Projector } from "./Projector";
import { TileView } from "./TileView";
import { DirMtx } from "./DirMtx";
import { TILE_SIZE } from "./opts";
import { RenderableEntity } from "./RenderableEntity";
function maxSquareSquare(z: number) {
    return Math.max(z ** 2, (z + 1) ** 2);
}
const debugColors = ['red', 'green', 'blue', 'cyan', 'orange'];
function debugColor() {
    return debugColors[(Math.random() * debugColors.length) | 0];
}
const DEBUG = false;
const SUPERDebug = false;

// const DEBUGMAP = {7:true, 3:true};
export class Renderer {
    overlay: CanvasGradient;
    ctx: CanvasRenderingContext2D;
    can: HTMLCanvasElement;
    projector = new Projector();
    constructor(can: HTMLCanvasElement) {
        this.can = can;
        this.ctx = can.getContext('2d');
    }

    render(root: TileView, offsetX: number, offsetY: number, t:number, displayOffsetX: number, displayOffsetY: number) {        
        const items = this.projector.project(root, offsetX, offsetY, this.can.width / TILE_SIZE / 2, this.can.height / TILE_SIZE / 2, displayOffsetX, displayOffsetY);
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0,0,this.can.width,this.can.height);
        this.ctx.save();
        

        this.ctx.translate(this.can.width / 2, this.can.height / 2);
        this.ctx.translate(displayOffsetX * TILE_SIZE, displayOffsetY * TILE_SIZE)
        
        // this.ctx.scale(TILE_SIZE, TILE_SIZE);


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
            const r = Math.sqrt(
                maxSquareSquare(item.x - offsetX) +
                maxSquareSquare(item.y - offsetY)
            ) + Math.sqrt(2);
            if(!item.isRoot && item.anglesLength !== 2){
                this.ctx.beginPath();
                
                for (let i = 0; i < item.anglesLength; i += 2) {

                    const fromAng = item.angles[i];
                    const toAng = item.angles[i + 1];
                    if(fromAng === toAng) continue;
                    const sf = Math.abs(1/Math.cos( (fromAng-toAng) / 2));
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(Math.cos(fromAng) * r * TILE_SIZE * sf, Math.sin(fromAng) * r * TILE_SIZE * sf);

                    // this.ctx.arc(0, 0, r * TILE_SIZE, fromAng, toAng);
                    this.ctx.lineTo(Math.cos(toAng) * r * TILE_SIZE * sf, Math.sin(toAng) * r * TILE_SIZE * sf);
                    
                    this.ctx.lineTo(0, 0);
                }
                if (DEBUG) {
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = "pink";
                    this.ctx.stroke();
                }
                
                this.ctx.clip();
                
            }
            
            this.ctx.translate(item.x * TILE_SIZE, item.y * TILE_SIZE);
            this.ctx.translate(-offsetX * TILE_SIZE, -offsetY * TILE_SIZE);

            this.applyOrientation(item.view.orientation);

            // this.ctx.beginPath();
            // this.ctx.rect(0, 0, 1, 1);
            // this.ctx.clip();
            
            item.view.tile.render(this.ctx, t);
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