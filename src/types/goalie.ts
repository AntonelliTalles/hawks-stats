export type Goalie = {
  id: string;
  name: string;
  number?: number;
  position?: string;

  games_started: number;
  shots_against: number;
  saves: number;
  wins: number;
  shutouts: number;
};
