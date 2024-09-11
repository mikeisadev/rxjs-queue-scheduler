import { delay, fromEvent, Observable, Subject, throttleTime } from "rxjs";

// Elements
const startBtn: Element = document.querySelector('#start') as Element
const resetBtn: Element = document.querySelector('#reset') as Element

// States
// const counter = new Subject<number>();
// const registry = new Subject<object>();
// const resets = new Subject<number>();
let counter: number = 0;
let registry: Array<object> = []
let resets: number = 0;
 
// Presets
const pulses: Array<number> = [...Array(5).keys()]

console.log(pulses)

// Observables => Events + Functions
const emitObs: Observable<Event> = fromEvent(startBtn, 'click')
const resetObs: Observable<Event> = fromEvent(resetBtn, 'click')

// Implementation
emitObs
    .subscribe(e => {
        pulses.map(p => console.log(`${counter} ${p+1}`))
    })

resetObs
    .subscribe(e => {
        console.clear()
    })