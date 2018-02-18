import { Tile } from "./Tile";
import { Side } from "./Side";

export type TileProvider = (x: number, y: number) => Tile;
export type TileFilter = (next: TileProvider) => TileProvider;

export class TileGrid {
    tiles: Tile[][];
    constructor(width: number, height: number, layers: TileFilter[] = []) {
        const getTiles = layers.reduce(
            (a,b) => (next) => a(b(next)),
            (x) => x
        )((x,y) => new Tile());

        this.tiles = [...Array(height)].map((_, y) =>
            [...Array(width)].map((_, x) => getTiles(x,y))
        );


        this.tiles.forEach( (row, y) => {
            row.forEach( (tile, x) => {
                if(!tile) return;
                if(y !== 0 && this.tiles[y - 1][x]){
                    this.tiles[y - 1][x].link(
                        Side.bottom,
                        tile
                    );
                }
                if(x !== 0 && row[x - 1]){
                    row[x - 1].link(
                        Side.right,
                        tile
                    );
                }
            });
        })



    }

    get(x: number, y: number){
        return this.tiles[y][x];
    }
}