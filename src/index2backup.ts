import { of, Subject, forkJoin, fromEvent } from "rxjs";
import { delay, concatMap, take, map, filter, zip} from "rxjs/operators";

// HTML Elements
const startBtn: Element = document.querySelector('#start') as Element
const resetBtn: Element = document.querySelector('#reset') as Element

// Data
let counter = 0;
let registry = {};

let values = Array(5).fill(1).map((e,i) => e+(i*1));

let messageConsumed = new Subject<number>();
let enqueuedMessage = new Subject<number>();

// Events
fromEvent(startBtn, 'click')
    .subscribe(emit)

fromEvent(resetBtn, 'click')
    .subscribe(() => {
        console.clear()
        counter = 0
    })

// Functions
function emit() {
    let thiscounter = counter;
      
    forkJoin(
        values
            .map(v => readVariable(v,thiscounter)))
            .subscribe(v => console.log("completed "+ thiscounter)
    )
      
    counter++;
}

function readVariable(i,c){
    var t = new Subject<number>();

    var retval = t.pipe(
        take(1),
        map(x => {
            messageConsumed.next(x)
            console.log(c + " " + x)
        })
    )
    
    if (!registry[i]) registry[i] = [];

    registry[i].push(() => t.next(i))

    enqueuedMessage.next(i);

    return retval.pipe(take(1));
}

messageConsumed
    .pipe( 
        zip(enqueuedMessage.pipe(filter(x => x != null))),
        concatMap(x => of(x).pipe(delay(100))) 
    )
    .subscribe( message => registry[message[1]].pop()() )

messageConsumed.next(-1)