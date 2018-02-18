import { Tile } from "./Tile";
import { WallTile } from "./WallTile";
import { Side } from "./Side";

export function autoWall(root: Tile){

    console.time("wall");
    const explored = new Set<Tile>();
    
    const wallsToLink = new Set<WallTile>();
    
    let maxExplore = 1000;
    explored.add(root);
    console.time("wallExplore");
    
    for(let tile of explored){
        
        for(let i = 0; i < 4; i++){
            const edge = tile.getReference(i);
            if(edge){
                const nextTile = edge.to;
                if(nextTile instanceof WallTile || explored.has(nextTile)){
                    continue;
                }
                explored.add(nextTile);

            }else{
                const nt = new WallTile();
                wallsToLink.add(nt);
                nt.link(
                    Side.left,
                    tile,
                    i
                );
            }
        }
    }
    console.timeEnd("wallExplore");
    
    console.time("wallLink");

    for(let wall of wallsToLink){
        const base = wall.getView(0).getNeighbor(Side.left);
        if(!base) continue;
        for(let dir of [Side.top, Side.bottom]){
            if(wall.getReference(dir)) continue;
            const nextBase = base.getNeighbor(dir);
            if(nextBase.tile instanceof WallTile) continue;
            const targWall = nextBase.getNeighbor(Side.right);
            if(! (targWall.tile instanceof WallTile)) continue;
            wall.getView(0).link(
                dir,
                targWall
            );
        }
    }
    console.timeEnd("wallLink");
    
    console.timeEnd("wall");
    

}