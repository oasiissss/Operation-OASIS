
export function connectedBonus(clusterSize:number):number{
  if(clusterSize<3) return 0;
  const table={3:100,4:175,5:275,6:400,7:550,8:725,9:900};
  if(clusterSize in table) return table[clusterSize as keyof typeof table];
  return 900+(clusterSize-9)*100;
}

export function operationOasisBonus(bullsThisTurn:number):number{
  return bullsThisTurn>=2?500:0;
}
