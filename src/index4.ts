import { of, Subject, forkJoin, fromEvent, interval } from "rxjs";
import { delay, concatMap, take, map, filter, zip, toArray, tap } from "rxjs/operators";

// HTML Elements
const startBtn: Element = document.querySelector('#start') as Element
const resetBtn: Element = document.querySelector('#reset') as Element

// Presets
let pulseDelay: number = 400

// Data
let counter = 0;
let registry = {};

// let values = Array(5).fill(1).map((e, i) => e+(i*1));
let pulses = Array(5).fill(1).map((e, i) => e+(i*1)); // Imagine values as pulses

// let messageConsumed = new Subject<number>();
// let enqueuedMessage = new Subject<number>();

// let eventsQueue = new Subject<Event>();

// Events
// Start btn
fromEvent(startBtn, 'click')
    .pipe(
        concatMap(() => {
            const c = counter

            return generatePulse(c)
                .pipe(
                    tap(
                        null, null,
                        () => {
                            console.log("Completeed ", counter)

                            counter++
                        }
                    )
                )
        })
    )
    .subscribe()

// Reset btn
fromEvent(resetBtn, 'click')
    .subscribe(() => {
        console.clear()
        counter = 0
    })

// Functions
// Before it was readVariable, now generatePulse
function generatePulse(counter) {
    return interval(pulseDelay)
        .pipe(
            take(5),
            map(pulse => {
                console.log(`${counter} ${pulse + 1}`)
            })
        )
}