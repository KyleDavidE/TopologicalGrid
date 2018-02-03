interface Poolable{
    clean(): void;
}


export class LinearObjectPool<T extends Poolable> implements Poolable{
    
    makeT: () => T;
    items: T[];
    usedIndex: number = 0;

    constructor(makeT: () => T, size: number = 64){
        this.makeT = makeT;
        this.items = [...Array(size)].map(
            () => makeT()
        );
    }

    pop(): T{
        if(this.usedIndex + 1 >= this.items.length){
            this.items.push(
                this.makeT()
            );
            (window as {[x:string]:any}).usedSize = this.items.length;
        }
        return this.items[this.usedIndex++];
    }


    done(){
        for(let i = this.usedIndex; i >= 0; i--){
            this.items[i].clean();
        }
        this.usedIndex = 0;
    }

    clean(){
        this.done();
    }
    
}