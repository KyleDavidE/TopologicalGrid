import { Tile } from "./Tile";
import { DirMtx, dirMtxProduct, dirMtxApply, dirMtxInverse, dirMtxProductImpl } from "./DirMtx";
import { Side, reverseSide } from "./Side";
import { Entity } from "./Entity";
import { RenderableEntity } from "./RenderableEntity";


const lookupMaps = [...Array(8)].map(
    (i) => {
        return new WeakMap<Tile, TileView>()
    }
);




export class TileView{
    tile: Tile;
    orientation: DirMtx;
    id: string;
    
    static lookup(tile: Tile, orientation: DirMtx) {
        return tile.tileViews[orientation];
        // const map = lookupMaps[orientation];
        
        // if(!map.has(tile)){
        //     const view = new TileView(tile, orientation);
        //     map.set(tile, view);
        //     return view;
        // }

        // return map.get(tile);
    }

    constructor(tile: Tile, orientation: DirMtx){
        
        this.tile = tile;
        this.orientation = orientation;
        this.id = `${tile.id},${orientation}`;
    }
    computeSide(i: Side){
        return dirMtxApply(
            dirMtxInverse(this.orientation),
            i
        );
    }
    getNeighbor(i: Side){
        const edge = this.tile.getReference(
                this.computeSide(i)
            );
        
        if(edge){    
            return TileView.lookup(
                edge.to,
                dirMtxProductImpl(
                    this.orientation,
                    edge.mtx
                )
            );
        }

        return null;
    }
    stepOn(t: number){
        this.tile.stepOn(t);
    }
    interact(t: number){
        this.tile.interact(t);

    }
    track(entity: RenderableEntity){
        this.tile.track(entity);
    }

    link(fromSide: Side, toTile: TileView, toSide = reverseSide(fromSide), {
        reflect = false,
        addReverse = true
    } = {}){
        this.tile.link(
            this.computeSide(fromSide),
            toTile.tile,
            toTile.computeSide(toSide),
            {
                reflect: !reflect !== !( (toTile.orientation ^ this.orientation) & 0b100),
                addReverse
            }
        );
    }

    rotate(mtx: DirMtx){
        return this.tile.getView(
            dirMtxProductImpl(
                mtx,
                this.orientation
            )
        );
    }
}