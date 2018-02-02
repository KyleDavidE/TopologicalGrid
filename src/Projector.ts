import { TileView } from "./TileView";
import { LinearObjectPool } from "./LinearObjectPool";
import { Side } from "./Side";

function trueMod(a: number, b: number) {
    return ((a % b) + b) % b;
}

function reduceAngle(angle: number) {
    return trueMod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

function reduceAngleCentered(center: number, angle: number) {
    return reduceAngle(angle - center) + center;
}
const DEBUG = false;
const ANGLE_RANGE = Math.PI / 1000;
class ProjectionPath {
    id: string;
    view: TileView
    x: number
    y: number
    centerAngle: number
    angles: number[] = []
    isRoot: boolean;
    constructor() {

    }
    static id(view: TileView, x: number, y: number) {
        return `${view.id},${x},${y}`;
    }
    init(view: TileView, x: number, y: number, isRoot = false) {
        this.view = view;
        this.x = x;
        this.y = y;
        this.angles.length = 0;
        this.centerAngle = Math.atan2(y, x);
        if (isRoot) {

            //    this.angles.push(
            //        0,
            //        Math.PI / 2
            //    );
            for (let i = 0; i < 8; i++) {
                this.angles.push(
                    Math.PI / 4 * (i + .5)
                );

                this.angles.push(
                    Math.PI / 4 * (i + 1.5)
                );

            }
        }
        this.id = ProjectionPath.id(view, x, y);
        this.isRoot = isRoot;
        return this;
    }
    addRange(from: number, to: number) {
        this.addRangeImpl(
            reduceAngleCentered(this.centerAngle, from),
            reduceAngleCentered(this.centerAngle, to)
        );
    }
    addRangeImpl(from: number, to: number) {
        if (this.isRoot) return;
        if (DEBUG) console.log('adding range', this.id, from, to);
        if (to === from) {
            return;
        }
        if (to < from) {
            // console.log(to, from);
            this.addRangeImpl(to, from);
            return;
        }

        let startIndex = 0;

        for (; startIndex < this.angles.length; startIndex++) {
            if (this.angles[startIndex] >= from) {
                break;
            }
        }

        let endIndex = startIndex;
        for (; endIndex < this.angles.length; endIndex++) {
            if (this.angles[endIndex] > to) {
                break;
            }
        }
        const startIsOutside = startIndex % 2 == 0;
        const endIsOutside = endIndex % 2 == 0;

        if (startIsOutside && endIsOutside) {
            this.angles.splice(startIndex, endIndex - startIndex, from, to);
        } else if (startIsOutside) {
            this.angles.splice(startIndex, endIndex - startIndex, from);
        } else if (endIsOutside) {
            this.angles.splice(startIndex, endIndex - startIndex, to);
        } else {
            this.angles.splice(startIndex, endIndex - startIndex);
        }

        return;
    }

    clean() {
        this.view = null; //this ref could be very costly
    }

}


const EDGE_GLITCH_REDUCTION_DIST = 1 / 100000;

export class Projector {
    offsetY: number;
    offsetX: number;
    lookup: Map<string, ProjectionPath>;
    que: ProjectionPath[];
    projectionPathPool = new LinearObjectPool<ProjectionPath>(() => new ProjectionPath());

    project(root: TileView, offsetX: number, offsetY: number): IterableIterator<ProjectionPath> {
        this.que = [];
        this.lookup = new Map();
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        const addRoot = (root: TileView, x: number, y: number) => {
            if (!root) return;

            if (x === 0) {
                if (offsetX <= EDGE_GLITCH_REDUCTION_DIST) {
                    addRoot(root.getNeighbor(Side.left), -1, y);
                }
                if (offsetX >= 1 - EDGE_GLITCH_REDUCTION_DIST) {
                    addRoot(root.getNeighbor(Side.right), 1, y);
                }
            }
            if (y === 0) {
                if (offsetY <= EDGE_GLITCH_REDUCTION_DIST) {
                    addRoot(root.getNeighbor(Side.top), x, -1);
                }
                if (offsetY >= 1 - EDGE_GLITCH_REDUCTION_DIST) {
                    addRoot(root.getNeighbor(Side.bottom), x, 1);
                }
            }
            const rootPath = this.projectionPathPool.pop().init(
                root,
                x,
                y,
                true
            );
            this.lookup.set(
                rootPath.id,
                rootPath
            );
            this.que.push(rootPath);

        }
        addRoot(root, 0, 0);


        while (this.que.length > 0) {
            const item = this.que.shift();
            this.considerItem(item);
        }

        return this.lookup.values();
    }

    considerItem(item: ProjectionPath) {
        if (Math.sqrt(item.x ** 2 + item.y ** 2) > 10) return;
        if (item.x >= 0 || item.isRoot) this.considerSide(item, true, 1, item.view.getNeighbor(0), item.x + 1, item.y);
        if (item.y >= 0 || item.isRoot) this.considerSide(item, false, 1, item.view.getNeighbor(1), item.x, item.y + 1);
        if (item.x < 1 || item.isRoot) this.considerSide(item, true, 0, item.view.getNeighbor(2), item.x - 1, item.y);
        if (item.y < 1 || item.isRoot) this.considerSide(item, false, 0, item.view.getNeighbor(3), item.x, item.y - 1);
    }

    /**
     * 
     * @param axis true = line goes up down
     */

    considerSide(item: ProjectionPath, axis: boolean, offsetZ: number, nextTile: TileView, nextX: number, nextY: number) {
        if (!nextTile) return;
        if (DEBUG) console.log("consider side", axis, offsetZ, nextTile, nextX, nextY, item.id);
        const lineZ = axis ? item.x + offsetZ - this.offsetX : item.y + offsetZ - this.offsetY;

        const topU = axis ? item.y - this.offsetY : item.x - this.offsetX;
        const bottomU = topU + 1;
        function makeAng(u: number) {
            return axis ? Math.atan2(u, lineZ) : -Math.atan2(u, lineZ) + Math.PI / 2
        }
        function projectAng(angle: number): number | false {

            if (Math.abs(reduceAngle(angle + (axis ? Math.PI / 2 : Math.PI))) < ANGLE_RANGE) {

                return makeAng(topU);
            } else if (Math.abs(reduceAngle(angle + (axis ? Math.PI / 2 : 0))) < ANGLE_RANGE) {
                return makeAng(bottomU);
            }

            const slopeUZ = axis ? Math.tan(angle) : Math.tan(Math.PI / 2 - angle);
            const colU = slopeUZ * lineZ;
            if (DEBUG) console.log("proj", angle, slopeUZ, colU);

            if ((axis ? Math.cos(angle) : Math.sin(angle)) * lineZ < 0) {
                // return projectAng(-angle);
                return (!axis ? Math.cos(angle) : Math.sin(angle)) < 0 ? makeAng(topU) : makeAng(bottomU);
            }
            if (colU < topU) {
                return makeAng(topU);
            } else if (colU > bottomU) {
                return makeAng(bottomU);
            } else {
                return angle;
            }

        }
        let newItem: ProjectionPath = null;

        const considerAngleRange = (fromAng: number, toAng: number) => {
            
            const newFromAng = projectAng(fromAng);
            const newToAng = projectAng(toAng);

            if (DEBUG) console.log("proj section", item.id, fromAng, toAng, newFromAng, newToAng);

            if (newFromAng === false || newToAng === false) {
                return;
            }
            if (newFromAng !== newToAng) {
                if (newItem === null) {
                    const key = ProjectionPath.id(nextTile, nextX, nextY);
                    if (this.lookup.has(key)) {
                        newItem = this.lookup.get(key);
                    } else {
                        newItem = this.projectionPathPool.pop();
                        newItem.init(nextTile, nextX, nextY);
                        this.lookup.set(key, newItem);
                        this.que.push(newItem);
                    }
                }
                newItem.addRange(newFromAng, newToAng);
            }
        }
        const foldAngleRange = (fromAng: number, toAng: number) => {
            if (Math.abs(reduceAngle(toAng - fromAng)) > Math.PI / 2) {
                const mid = reduceAngle((fromAng + toAng) / 2);
                considerAngleRange(reduceAngle(fromAng), mid);
                considerAngleRange(mid, reduceAngle(toAng));
                return;
            }else{
                considerAngleRange(
                    reduceAngle(fromAng),
                    reduceAngle(toAng)
                );
            }
        }
        for (let i = 0; i < item.angles.length / 2; i++) {
            const fromAng = item.angles[2 * i];
            const toAng = item.angles[2 * i + 1];

            foldAngleRange(fromAng, toAng);
        }

    }

}