import { queueScheduler, from, Observable, of, Subject, forkJoin, interval } from "rxjs";
import { observeOn,delay,concatMap, take,map ,filter,zip} from "rxjs/operators";

const observable$ = from([1, 2, 3, 4, 5, 6, 7, 8, 9], queueScheduler);
var sub = new Subject<number>();
var obs = sub.pipe(concatMap(x => of(x).pipe(delay(1000)))).subscribe(x=>{
  console.log(x)
})
var counter = 0;
var registry = {};

var messageConsumed = new Subject<number>();
var enqueuedMessage = new Subject<number>();

 

function readVariable(i,c){
  var t = new Subject<number>();
  var retval =  t.pipe(take(1)).pipe(map(x => {
    messageConsumed.next(x)
    console.log(c + " " + x)
  }))
  if(!registry[i])
    registry[i]=[];
  registry[i].push(()=>{ 
    t.next(i);
  });
  enqueuedMessage.next(i);
  return retval.pipe(take(1));
}

var values = Array(5).fill(1).map((e,i)=>e+(i*1));





function emit() {
  var thiscounter = counter;
  forkJoin(values.map(v => readVariable(v,thiscounter))).subscribe(v=>{
    console.log("completed "+ thiscounter)
  })
  counter++;
}

messageConsumed.pipe(zip(enqueuedMessage.pipe(filter(x => x != null)))).pipe(concatMap(x => of(x).pipe(delay(100 )))).subscribe( message => {
  registry[message[1]].pop()();
  
})
messageConsumed.next(-1)

window.emit = emit;
window.reset = ( )=>{console.clear(); counter=0};