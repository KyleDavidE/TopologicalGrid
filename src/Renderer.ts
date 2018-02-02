import { Projector } from "./Projector";
import { TileView } from "./TileView";
import { DirMtx } from "./DirMtx";
import { TILE_SIZE } from "./opts";
function maxSquareSquare(z: number) {
    return Math.max(z ** 2, (z + 1) ** 2);
}
const debugColors = ['red', 'green', 'blue', 'cyan', 'orange'];
function debugColor() {
    return debugColors[(Math.random() * debugColors.length) | 0];
}
const DEBUG = false;

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

    render(root: TileView, offsetX: number, offsetY: number) {
        const items = this.projector.project(root, offsetX, offsetY);
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0,0,this.can.width,this.can.height);
        this.ctx.save();
        

        this.ctx.translate(this.can.width / 2, this.can.height / 2);
        
        
        // this.ctx.scale(TILE_SIZE, TILE_SIZE);


        for (let item of items) {
            // if (DEBUG) console.log(item);
            this.ctx.save();
            this.ctx.beginPath();
            const r = Math.sqrt(
                maxSquareSquare(item.x - offsetX) +
                maxSquareSquare(item.y - offsetY)
            );

            for (let i = 0; i < item.angles.length; i += 2) {
                const fromAng = item.angles[i];
                const toAng = item.angles[i + 1];

                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(Math.cos(fromAng) * r * TILE_SIZE, Math.sin(fromAng) * r * TILE_SIZE);

                this.ctx.arc(0, 0, r * TILE_SIZE, fromAng, toAng);
                this.ctx.lineTo(0, 0);
            }
            if (DEBUG) {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = "pink";
                this.ctx.stroke();
            }
            this.ctx.clip();
            this.ctx.translate(item.x * TILE_SIZE, item.y * TILE_SIZE);
            this.ctx.translate(-offsetX * TILE_SIZE, -offsetY * TILE_SIZE);

            this.ctx.translate(-0.5 * TILE_SIZE, -0.5 * TILE_SIZE);
            // this.applyOrientation(item.view.orientation);
            this.ctx.translate(0.5 * TILE_SIZE, 0.5 * TILE_SIZE);

            // this.ctx.beginPath();
            // this.ctx.rect(0, 0, 1, 1);
            // this.ctx.clip();
            item.view.tile.render(this.ctx);





            this.ctx.restore();
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.arc(0, 0, TILE_SIZE / 3, 0, Math.PI * 2);

        this.ctx.fill();



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

    applyOrientation(orientation: DirMtx) {
        const { ctx } = this;
        ctx.rotate((orientation & 0b11) * Math.PI / 2);
        if (orientation & 0b100) ctx.scale(1, -1);
    }

}