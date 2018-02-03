import { Tile } from "./Tile";
import { DirMtx, dirMtxProduct, dirMtxApply, dirMtxInverse } from "./DirMtx";
import { Side } from "./Side";


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
        const map = lookupMaps[orientation];
        
        if(!map.has(tile)){
            const view = new TileView(tile, orientation);
            map.set(tile, view);
            return view;
        }

        return map.get(tile);
    }

    constructor(tile: Tile, orientation: DirMtx){
        
        this.tile = tile;
        this.orientation = orientation;
        this.id = `${tile.id},${orientation}`;
    }

    getNeighbor(i: Side){
        const edge = this.tile.getReference(
            dirMtxApply(
                dirMtxInverse(this.orientation),
                i
            )
            );
        
        if(edge){    
            return TileView.lookup(
                edge.to,
                dirMtxProduct(
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
}