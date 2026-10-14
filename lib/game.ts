import { puzzle, themes, normalize } from './puzzles';
import { properties } from './properties';
export type Player={id:string;name:string;team:number;host:boolean};
export type Board={id:number;players:string[];theme:string;index:number;since:number;seed:number;hintRequests?:string[]};
export type Room={code:string;players:Player[];status:string;round:number;until:number;tiles:number[];streak:number[];solved:number[];boards:Board[];settings:string[];log:string[];winner:number|null;created:number;solo?:boolean};
export function allocate(players:Player[],settings:string[],now:number):Board[]{
 const a=players.filter(p=>p.team===0),b=players.filter(p=>p.team===1);
 const count=Math.ceil(Math.max(a.length,b.length)/2);
 return Array.from({length:count},(_,i)=>({id:i,players:[...a.filter((_,j)=>j%count===i),...b.filter((_,j)=>j%count===i)].map(p=>p.id),theme:settings[i]||themes[0],index:0,since:now,seed:i*13}));
}
export function tick(r:Room,now:number){
 if(r.status==='playing'&&r.solo){const team=r.solved.findIndex(n=>n>=12);if(team>=0){r.status='finished';r.winner=team;return;}}
 if(!['playing','sudden'].includes(r.status)||now<r.until)return;
 if(r.status==='sudden'){r.boards[0].index++;r.boards[0].since=now;r.boards[0].hintRequests=[];r.until=now+60000;r.log.unshift('No answer in sudden death. A new deciding puzzle is live.');return;}
 if(r.round>=10){
  if(r.solo){r.status='finished';r.winner=null;return;}
  const scores=[0,1].map(t=>r.tiles.filter(x=>x===t).length);
  if(scores[0]!==scores[1]){r.status='finished';r.winner=scores[0]>scores[1]?0:1;}
  else{r.status='sudden';r.until=now+60000;r.boards=[{id:0,players:r.players.map(p=>p.id),theme:r.settings[0]||themes[0],index:0,since:now,seed:109}];r.log.unshift('Territory tied! Everyone joins sudden death.');}
 }else{r.round++;r.until=now+120000;r.boards.forEach(b=>{b.index++;b.since=now;b.hintRequests=[];});r.log.unshift('Round '+r.round+' has begun!');}
 r.log=r.log.slice(0,8);
}
function activeBoard(r:Room,p:Player,boardId:number,index:number){
 if(!['playing','sudden'].includes(r.status))throw Error('This game is not accepting answers.');
 const b=r.boards.find(b=>b.id===boardId&&b.players.includes(p.id));
 if(!b)throw Error('You are not on this board.');
 if(b.index!==index)throw Error('That puzzle was already won. Try the new one!');
 return b;
}
export function requestHint(r:Room,p:Player,boardId:number,index:number,now:number){
 tick(r,now);const b=activeBoard(r,p,boardId,index);
 if(r.status==='sudden')throw Error('Sudden death has one automatic hint at 15 seconds.');
 if(now-b.since<30000)throw Error('Your first hint is available after 30 seconds.');
 if(b.hintRequests?.includes(p.id))throw Error('You already requested the first hint for this puzzle.');
 b.hintRequests=[...(b.hintRequests||[]),p.id];
}
export function solve(r:Room,p:Player,boardId:number,index:number,answer:string,now:number){
 tick(r,now);const b=activeBoard(r,p,boardId,index);
 if(normalize(answer)!==normalize(puzzle(b.theme,b.seed+b.index).answer))throw Error('Not quite — try another answer!');
 if(r.status==='sudden'){r.winner=p.team;r.status='finished';return;}
 r.streak[p.team]++;r.streak[1-p.team]=0;r.solved[p.team]++;
 let tile=-1;
 if(r.streak[p.team]>=3)tile=r.tiles.findIndex(t=>t===1-p.team);
 if(tile<0)tile=r.tiles.findIndex(t=>t===-1);
 if(tile<0)tile=r.tiles.findIndex(t=>t===1-p.team);
 const captured=tile>=0&&r.tiles[tile]===1-p.team;
 if(tile>=0)r.tiles[tile]=p.team;
 r.log.unshift(p.name+' '+(captured?'captured ':'claimed ')+(properties[tile]||'territory')+' · '+puzzle(b.theme,b.seed+b.index).answer);
 r.log=r.log.slice(0,8);b.index++;b.since=now;b.hintRequests=[];
 if(r.solo?r.solved[p.team]>=12:r.tiles.filter(t=>t===p.team).length>=25){r.winner=p.team;r.status='finished';}
}
export function view(r:Room,now:number,viewerId?:string){
 return {...r,serverNow:now,boards:r.boards.map(b=>{
  const q=puzzle(b.theme,b.seed+b.index),elapsed=now-b.since;
  const requested=!!viewerId&&!!b.hintRequests?.includes(viewerId);
  const first=q.kind==='clue'?'Starts with '+q.answer[0]+'. '+q.answer.split(' ').length+' word(s).':q.hints[0];
  const {hintRequests,...publicBoard}=b;
  return {...publicBoard,puzzle:{kind:q.kind,prompt:q.prompt,lengths:q.answer.split(' ').map(w=>w.length),firstHintRequested:requested,hints:r.status==='sudden'?[elapsed>=15000?q.hints[1]:null]:[requested?first:null,elapsed>=60000?q.hints[1]:null]}};
 })};
}
