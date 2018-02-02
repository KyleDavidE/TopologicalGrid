import {SideReference} from './SideReference';
import {Side, reverseSide} from './Side';
import { TileView } from './TileView';
import { DirMtx } from './DirMtx';

let nextId = 0;
export class Tile{
    links: SideReference[] = [null, null, null, null];
    id = nextId++;

    getReference(i: Side){
        return this.links[i];
    }
    
    unlink(i: Side, reciprocate = true){
        if(this.links[i]){
            const link = this.links[i];
            if(reciprocate){
                link.to.unlink(link.destSide, false);
            }
            this.links[i] = null;
        }
    }

    link(fromSide: Side, toTile: Tile, toSide = reverseSide(fromSide), {
        reflect = false,
        addReverse = true
    } = {}){
        
        this.unlink(fromSide);

        this.links[fromSide] = SideReference.fromOpts(
            toTile,
            fromSide,
            toSide,
            reflect
        );
        

        if(addReverse){
            toTile.link(toSide, this, fromSide, {
                addReverse: false,
                reflect
            });
        }
    }

    getView(mtx: DirMtx){
        return TileView.lookup(this, mtx);
    }

    render(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = ["red","green","blue","cyan","orange"][this.id % 5];
        ctx.fillRect(0,0,1,1);
    }
    isolate(){
        for(let i = 0; i < 4; i++){
            this.unlink(i);
        }
    }
}