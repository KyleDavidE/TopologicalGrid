import {DirMtx, makeDirMtx, dirMtxProduct } from "./DirMtx"
import { Tile } from "./Tile";
import { Side,  reverseSide } from "./Side";

export class SideReference{
    to: Tile;
    mtx: DirMtx;
    destSide: Side;

    constructor(to: Tile, mtx: DirMtx, destSide: Side){
        this.to = to;
        this.mtx = mtx;
        this.destSide = destSide;
    }

    static fromOpts(toTile: Tile, fromSide: Side, destSide: Side, reflect: boolean){
        return new SideReference(
            toTile,
            dirMtxProduct(makeDirMtx(- reverseSide(destSide), reflect), fromSide),
            destSide
        );
    }
}