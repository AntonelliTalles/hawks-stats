export type SkaterPosition = 'C' | 'LW' | 'RW' | 'D';

export interface Skater {
  id: string;
  name: string;
  number?: number;
  position: SkaterPosition;
  goals: number;
  assists: number;
  points: number;
  is_active: boolean;
}

export type SkaterBaseInput = {
  name: string;
  number?: number;
  position: SkaterPosition;
  is_active: boolean;
};
