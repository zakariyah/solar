var FSM = require('./FSM');

var Leader = require('../sScript/follower6');

var leader = new Leader();
var f = new FSM('S0', leader.getTransitionMap(), leader.getEvents(), leader.getMessages(), leader.CATCH_ALL_EVENT);

//Trace out path S0-> S1-> S2 ->S7->S8->S3->S4->S2->S3
f.transition('nc1'); //S1
f.getHistory();
f.transition('s'); //S2
f.getHistory();
f.transition('nc2'); //S7
f.getHistory();
f.transition('nc1'); //S8
f.getHistory();
f.transition('s'); //S3
f.getHistory();
f.transition('s'); //S4
f.getHistory();
f.transition('s'); //S2
f.getHistory();
f.transition('s'); //S3
console.log(f.getHistory());
// f.transition('gdsfdafsad'); //Exception! Invalid event; still at S3