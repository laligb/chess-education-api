declare module 'swiss-pairing' {
  export function getMatchups(
    round: number,
    participants: { id: number; seed: number }[],
    matches: {
      round: number;
      home: { id: number; points: number };
      away: { id: number; points: number };
    }[],
  ): { home: { id: number }; away: { id: number } }[];
}
