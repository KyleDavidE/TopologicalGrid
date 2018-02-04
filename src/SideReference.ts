import {DirMtx, makeDirMtx, dirMtxProduct } from "./DirMtx"
import { Tile } from "./Tile";
import { Side,  reverseSide } from "./Side";

export class SideReference{
    to: Tile;
    mtx: DirMtx;
    destSide: Side;
    glassLevel: number
    constructor(to: Tile, mtx: DirMtx, destSide: Side, glassLevel: number){
        this.to = to;
        this.mtx = mtx;
        this.destSide = destSide;
        this.glassLevel = glassLevel;
    }

    static fromOpts(toTile: Tile, fromSide: Side, destSide: Side, reflect: boolean, glassLevel: number = 0){
        return new SideReference(
            toTile,
            dirMtxProduct(makeDirMtx(- reverseSide(destSide), reflect), fromSide),
            destSide,
            glassLevel
        );
    }
}