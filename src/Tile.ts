import {SideReference} from './SideReference';
import {Side, reverseSide} from './Side';
import { TileView } from './TileView';
import { DirMtx } from './DirMtx';
import { RenderableEntity } from './RenderableEntity';

let nextId = 0;
export class Tile{
    loadTimer: number;
    links: SideReference[] = [null, null, null, null];
    id = nextId++;
    entities = new Set<RenderableEntity>();
    tileViews: TileView[];
    constructor(){
        this.tileViews = Array(8);
        for(let i = 0; i < 8; i++){
            this.tileViews[i] = new TileView(this, i);
        }
    }
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
        return this.tileViews[mtx];
    }

    render(ctx: CanvasRenderingContext2D, t: number){
        this.loadTimer = t;
    }
    isolate(){
        for(let i = 0; i < 4; i++){
            this.unlink(i);
        }
    }
    stepOn(t: number){
        
    }
    interact(t: any): any {
        
    }
    track(entity: RenderableEntity) {
        this.entities.add(entity);
    }
}