import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';

import { db } from './firebase';

export type Goalie = {
  id: string;
  name: string;
  games_started: number;
  shots_against: number;
  saves: number;
  save_pct: number;
  wins: number;
  shutouts: number;
  is_active: boolean;
};

const colRef = collection(db, 'goalies');

export async function listGoalies(): Promise<Goalie[]> {
  const q = query(colRef, orderBy('name', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as Omit<Goalie, 'id'>;
    return {
      id: d.id,
      ...data,
    };
  });
}

type CreateGoalieInput = Omit<Goalie, 'id'>;

export async function createGoalie(values: CreateGoalieInput) {
  const ref = doc(colRef);

  await setDoc(ref, values);
  return ref.id;
}

export async function updateGoalie(id: string, values: Partial<CreateGoalieInput>) {
  const ref = doc(colRef, id);
  await updateDoc(ref, values);
}

export async function deleteGoalie(id: string) {
  await deleteDoc(doc(colRef, id));
}

export async function incrementGoalieStats(
  id: string,
  deltas: {
    gs_delta: number;
    sa_delta: number;
    sv_delta: number;
    w_delta: number;
    so_delta: number;
  },
) {
  const ref = doc(colRef, id);

  await updateDoc(ref, {
    games_started: increment(deltas.gs_delta),
    shots_against: increment(deltas.sa_delta),
    saves: increment(deltas.sv_delta),
    wins: increment(deltas.w_delta),
    shutouts: increment(deltas.so_delta),
  });
}
