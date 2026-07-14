export interface Territory {
  id: number;
  name: string;
  neighbors: number[];
}

export const territories: Territory[] = [
  { id: 1, name: "Texel", neighbors: [2, 7] },
  { id: 2, name: "Vlieland", neighbors: [1, 3, 8] },
  { id: 3, name: "Terschelling", neighbors: [2, 4, 8] },
  { id: 4, name: "Ameland", neighbors: [3, 5, 8] },
  { id: 5, name: "Schiermonnikoog", neighbors: [4, 6, 9] },
  { id: 6, name: "Rottumeroog", neighbors: [5, 9] },
  { id: 7, name: "Noord-Holland", neighbors: [1, 8, 10, 12, 13] },
  { id: 8, name: "Friesland", neighbors: [2, 3, 4, 7, 9, 11] },
  { id: 9, name: "Groningen", neighbors: [5, 6, 8, 10] },
  { id: 10, name: "Drenthe", neighbors: [9, 11, 14] },
  { id: 11, name: "Flevoland", neighbors: [8, 10, 13, 14] },
  { id: 12, name: "Zuid-Holland", neighbors: [7, 13, 15, 16] },
  { id: 13, name: "Utrecht", neighbors: [7, 11, 12, 14, 16] },
  { id: 14, name: "Overijssel", neighbors: [10, 11, 13, 17] },
  { id: 15, name: "Zeeland", neighbors: [12, 16] },
  { id: 16, name: "Noord-Brabant", neighbors: [12, 13, 15, 17, 18] },
  { id: 17, name: "Gelderland", neighbors: [14, 16, 18, 20] },
  { id: 18, name: "Limburg", neighbors: [16, 17] },
  { id: 19, name: "Amsterdam", neighbors: [7] },
  { id: 20, name: "Arnhem", neighbors: [17] }
];
