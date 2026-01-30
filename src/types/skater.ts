export type Skater = {
  id: string;
  name: string;
  number?: number;
  position: 'C' | 'LW' | 'RW' | 'D';
  goals: number;
  assists: number;
  points: number;
  is_active: boolean;
};
