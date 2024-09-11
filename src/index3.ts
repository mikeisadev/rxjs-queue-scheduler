import { of, Subject, forkJoin, fromEvent, interval } from "rxjs";
import { delay, concatMap, take, map, filter, zip, toArray } from "rxjs/operators";

// HTML Elements
const startBtn: Element = document.querySelector('#start') as Element
const resetBtn: Element = document.querySelector('#reset') as Element

// Data
let counter = 0;
let registry = {};

let values = Array(5).fill(1).map((e, i) => e+(i*1));

let messageConsumed = new Subject<number>();
let enqueuedMessage = new Subject<number>();

let eventsQueue = new Subject<Event>();

// Events
fromEvent(startBtn, 'click')
    .subscribe((e: Event) => {
        e['emitted'] = false

        eventsQueue.next(e as Event)
    })

fromEvent(resetBtn, 'click')
    .subscribe(() => {
        console.clear()
        counter = 0
    })

// Functions
function readVariable(i,c, timer) {
    return new Promise((resolve, reject) => {
        let t = new Subject<number>();
    
        let retval = t.pipe(
            take(1),
            map(x => {
                messageConsumed.next(x)
                console.log(c + " " + x)
            })
        )
        
        if (!registry[i]) registry[i] = [];
    
        registry[i].push(() => t.next(i))
    
        enqueuedMessage.next(i);
    
        setTimeout(
            () => resolve(retval.pipe(take(1))),
            timer
        )
    })
}

// Message consumed
messageConsumed
    .pipe( 
        zip(enqueuedMessage.pipe(filter(x => x != null))),
        concatMap(x => of(x).pipe(delay(100))) 
    )
    .subscribe( message => registry[message[1]].pop()() )

messageConsumed.next(-1)

// Events queue
eventsQueue
    .subscribe(async (e) => {
        const c = counter
        const expectedMs = (Math.random()) * 2000

        console.log("Expected " + expectedMs * values.length + " ms")

        const promises = values.map(async (v) => await readVariable(v, c, expectedMs))

        await Promise.all(promises)

        console.log("Completed ", counter)

        counter++
    })
