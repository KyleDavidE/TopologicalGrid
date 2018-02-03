import { TileGrid, TileFilter} from "./TileGrid";
import { ColorTile } from "./ColorTile";
import { Side } from "./Side";
import { strictCompose } from "./compose";
import { Tile } from "./Tile";
import { TickTackToeTile } from "./tickTackToe/TickTackToeTile";

function colorTile(xc: number, yc: number, color: string): TileFilter {
    return (next) => (x, y) => {
        if (x === xc && y === yc) {
            return new ColorTile(color);
        }
        return next(x,y);
    }
}

function dynamicColor(w: number, h: number, base: number = 255): TileFilter {
    return (next) => (x, y) => {
        return new ColorTile(`rgb(${((x / w) ** .5 * 255) | 0},${base},${((y / h) ** .5 * 255) | 0})`);

    }
}


function rain(sf: number, offset: number = 0): TileFilter {
    return (next) => (x, y) => {
        return new ColorTile(`hsl(${(( (x + offset) / sf) * 360) | 0},50%,50%)`);

    }
}


function checkers( ...colors: string[]): TileFilter {
    return (next) => (x, y) => {
        return new ColorTile(
            colors[ (x + y) % colors.length]
        );

    }
}

function cardinal(xc: number, yc: number) {
    return strictCompose([
        colorTile(xc + 1, yc, 'red'),
        colorTile(xc, yc + 1, 'green'),
        colorTile(xc - 1, yc, 'blue'),
        colorTile(xc, yc - 1, 'cyan')
    ])
}

function tickTackToeLayer(n: number = 3): TileFilter {
    return (next) => (x, y) => {
        return new TickTackToeTile(n)
    }
}

function fullColor(color: string): TileFilter {
    return solidColorTiles(color);
}

function solidColorTiles(color: string): TileFilter{
    return (next) => (x, y) => new ColorTile(color);
}

export function flatSpace(){
    const grid = new TileGrid(9,9);
    grid.get(2,1).isolate();
    return grid.get(1,1)
}

export function portSpace() {
    const grid1 = new TileGrid(9, 9, [
        solidColorTiles("red")
    ] );
    const grid2 = new TileGrid(9, 9, [
        solidColorTiles("blue")
    ]);
    
    grid1.get(4,4).link(
        Side.right,
        grid2.get(4,4)
    );
    grid2.get(8,8).link(
        Side.bottom,
        grid1.get(0,0)
    );
    grid2.get(6,4).link(
        Side.right,
        grid1.get(2,4)
    );
    return grid1.get(4,7);
}


export function shortWay() {
    const grid = new TileGrid(11, 5, [
        cardinal(5, 2),
        dynamicColor(10, 5)
    ]);

    for (let i = 2; i < 9; i++) {
        grid.get(i,2).isolate();
    }

    for (let i = 0; i < 2; i++) {
        grid.get(1,i).link(
            Side.right,
            grid.get(8,i)
        );
    }


    return grid.get(0,4);
}


export function threeTurns() {
    const grid = new TileGrid(7, 7, [
        cardinal(2, 2),
        colorTile(0, 0, 'pink'),
        dynamicColor(7, 7)
    ]);



    for (let i = 0; i < 7; i++) {
        if (i === 1 || i === 5) {
            continue;
        }
        grid.get(i,3).isolate();
        grid.get(3,i).isolate();

    }

    grid.get(3,5).link(
        Side.right,
        grid.get(5,2),
        Side.bottom
    );


    return grid.get(2,2);
}

export function bridge(){
    const grid = new TileGrid(5, 5, [
        cardinal(2, 2),
        dynamicColor(5, 5)
    ]);

    const bridge = new ColorTile('orange');

    console.log(grid);

    grid.get(0,0).link(
        Side.top,
        bridge
    )

    grid.get(4,0).link(
        Side.top,
        bridge,
        Side.top,
        {reflect:true}
    );

    grid.get(4,4).link(
        Side.right,
        bridge
    );

    return grid.get(2,2);
}

export function fastLane(){
    const S = 27;
    const grid = new TileGrid(S,4, [
        dynamicColor(S,4)
    ]);
    for(let i = 0; i < S; i+=2){
        for(let j = 0; j < 2; j++){
            if(i < S - 2) grid.get(i,j).link(
                Side.right,
                grid.get(i+2,j)
            );
            if (i < S - 1) grid.get(i+1,j).isolate()
        }
        
    }
    return grid.get(0,3);
}


export function fastLane2(){
    const shortLength = 10;
    const zoomLevel = 5;
    
    const longGrid = new TileGrid(shortLength*zoomLevel,2, [
        rain(shortLength*zoomLevel/3)
    ]);
    for(let o = 0; o < zoomLevel; o++){
        const shortGrid = new TileGrid(shortLength,2, [
            rain(shortLength/3, o/zoomLevel)
        ]);

        
        for(let i = 0; i < shortLength; i++){
            const targ = longGrid.get(i * zoomLevel + o, 0);
            shortGrid.get(i, 1).link(
                Side.bottom,
                targ
            )
        }

    }
    return longGrid.get(0,1);
}





export function ballPort() {
    const grid1 = new TileGrid(9, 9, [
        solidColorTiles("red")
    ] );
    const grid2 = new TileGrid(9, 9, [
        solidColorTiles("blue")
    ]);
    
    
    const center1 = grid1.get(4,4);
    const center2 = grid2.get(4,4);
    let bridge;
    for(let i = 0; i < 4; i++){
        const reverse = (i + 2) % 4;
        if(i % 2 === 0) bridge = new ColorTile("pink");
        center1.getReference(i).to.link(
            reverse,
            bridge
        );
        center2.getReference(reverse).to.link(
            i,
            bridge
        );
    }



    return grid1.get(4,7);
}

export function branches(n = 7) {
    if(n === 0){
        return new ColorTile("red");
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const out = new ColorTile(color);

    function addSide(side: Side){
        const bridge = new ColorTile(color);
        out.link(
            side,
            bridge,
            Side.bottom
        );

        bridge.link(
            Side.top,
            branches(n - 1),
            Side.bottom
        )
    }

    addSide(Side.top);
    addSide(Side.bottom);
    addSide(Side.left);
    addSide(Side.right);

    


    return out;

}



export function branches2() {
    const S = 4;
    function inner(n = 7){
        const color = `hsl(${Math.random() * 360},50%,50%)`;
        
        if(n === 0){
            return new TileGrid(S,S,[
                solidColorTiles(color)
            ]);
        }
        const out = new TileGrid(S,S,[
            solidColorTiles(color)
        ]);

        const north = inner(n - 1);
        const east = inner(n - 1);
        const west = inner(n - 1);

        for(let i = 0; i < S; i++){
            out.get(i,0).link(
                Side.top,
                north.get(i,S-1)
            );
            out.get(0,S-1-i).link(
                Side.left,
                east.get(i,S-1),
                Side.bottom
            );
            out.get(S-1,i).link(
                Side.right,
                west.get(i,S-1),
                Side.bottom
            );
        }

        


        return out;
    }
    
    return inner().get( Math.floor(S/2), S - 1);

}


export function mirror(){
    const grid = new TileGrid(5,5,[
        dynamicColor(5,5)
    ]);

    for(let i = 1; i < 4; i++){
        grid.get(2,i).link(
            Side.right,
            grid.get(2,i),
            Side.right,
            {
                reflect: true
            }
        )
    }

    

    return grid.get(0,4);
}

export function tickTackToeBasic(){
    const grid = new TileGrid(3,3, [
        tickTackToeLayer()
    ]);

    return grid.get(0,2);
}


export function tickTackToeDonut(){
    const grid = new TileGrid(3,3, [
        tickTackToeLayer()
    ]);

    const bridge = new ColorTile("white");
    

    for(let i = 0; i < 3; i++){
        grid.get(0,i).link(
            Side.left,
            grid.get(2,i)
        );
        grid.get(i,0).link(
            Side.top,
            grid.get(i,2)
        );
    }


    bridge.link(
        Side.top,
        grid.get(0,2),
        Side.bottom,
        {
            addReverse:false
        }
    );

    return bridge;
}

export function tickTackToeKlign(){
    const grid = new TileGrid(3,3, [
        tickTackToeLayer(4)
    ]);

    const bridge = new ColorTile("white");
    

    for(let i = 0; i < 3; i++){
        grid.get(0,i).link(
            Side.left,
            grid.get(2,i),
            Side.right,
            {reflect:false}
        );
        grid.get(i,0).link(
            Side.top,
            grid.get(2-i,2),
            Side.bottom,
            {reflect:true}
        );
    }


    bridge.link(
        Side.top,
        grid.get(0,2),
        Side.bottom,
        {
            addReverse:false
        }
    );

    return bridge;
}



export function tickTackToeMirror(){
    const grid = new TileGrid(3,3, [
        tickTackToeLayer(5)
    ]);

    const bridge = new ColorTile("white");
    

    for(let i = 0; i < 3; i++){
        grid.get(0,i).link(
            Side.left,
            grid.get(0,i),
            Side.left,
            {reflect:true, addReverse: false}
        );
        grid.get(2,i).link(
            Side.right,
            grid.get(2,i),
            Side.right,
            {reflect:true, addReverse: false}
        );
        grid.get(i,2).link(
            Side.bottom,
            grid.get(i,2),
            Side.bottom,
            {reflect:true, addReverse: false}
        );
        grid.get(i,0).link(
            Side.top,
            grid.get(i,0),
            Side.top,
            {reflect:true, addReverse: false}
        );
    }


    bridge.link(
        Side.top,
        grid.get(0,2),
        Side.bottom,
        {
            addReverse:false
        }
    );

    return bridge;
}

export function hubRoom() {
    const worlds = [
        portSpace(),
        shortWay(),
        threeTurns(),
        bridge(),
        fastLane(),
        ballPort(),
        fastLane2(),
        branches(),
        mirror(),
        tickTackToeBasic(),
        tickTackToeDonut(),
        tickTackToeKlign(),
        tickTackToeMirror(),
        branches2()
    ];

    const root = [new ColorTile('red'), new ColorTile('pink')];


    const out = worlds.reduceRight(
        ([rightTile, rightBridge], worldRoot) => {
            const hubTile = new ColorTile('gold');
            const hubBridge = new ColorTile('gold');

            hubTile.link(
                Side.right,
                rightTile,
            );

            hubBridge.link(
                Side.right,
                rightBridge
            );

            hubBridge.link(
                Side.bottom,
                hubTile
            );
            hubBridge.link(
                Side.top,
                worldRoot
            );
            hubTile.link(
                Side.top,
                hubBridge
            );



            return [hubTile, hubBridge];
        },
        root
    );
    root.map(e => e.isolate());
    return out[0];
}
