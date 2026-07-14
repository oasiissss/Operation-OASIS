
import { territories } from "../map/NetherlandsMap";
import type { TerritoryState } from "./TerritoryState";

export function largestCluster(states:TerritoryState[], owner:string):number{
  const owned=new Set(states.filter(s=>s.owner===owner).map(s=>s.territoryId));
  const seen=new Set<number>();
  let best=0;
  for(const id of owned){
    if(seen.has(id)) continue;
    let size=0;
    const stack=[id];
    while(stack.length){
      const cur=stack.pop()!;
      if(seen.has(cur)) continue;
      seen.add(cur);
      size++;
      for(const n of territories.find(t=>t.id===cur)?.neighbors||[]){
        if(owned.has(n)&&!seen.has(n)) stack.push(n);
      }
    }
    best=Math.max(best,size);
  }
  return best;
}
