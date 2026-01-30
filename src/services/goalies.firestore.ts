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
import type { Goalie } from '../types/goalie';

const colRef = collection(db, 'goalies');

export async function listGoalies(): Promise<Goalie[]> {
  const q = query(colRef, orderBy('name', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as Omit<Goalie, 'id'> & { number?: number | null };
    return { id: d.id, ...data, number: data.number ?? undefined };
  });
}

export async function createGoalie(values: Omit<Goalie, 'id'>) {
  const ref = doc(colRef);
  const payload: Omit<Goalie, 'id'> = {
    ...values,
    number: values.number ?? undefined,
    games_started: values.games_started ?? 0,
    shots_against: values.shots_against ?? 0,
    saves: values.saves ?? 0,
    wins: values.wins ?? 0,
    shutouts: values.shutouts ?? 0,
  };
  await setDoc(ref, payload);
  return ref.id;
}

export async function updateGoalie(id: string, values: Partial<Goalie>) {
  const ref = doc(colRef, id);
  const patch: any = { ...values };
  if ('number' in patch && patch.number == null) delete patch.number;
  await updateDoc(ref, patch);
}

export async function deleteGoalie(id: string) {
  await deleteDoc(doc(colRef, id));
}

export async function incrementGoalieStats(
  id: string,
  deltas: { gs: number; sa: number; sv: number; w: number; so: number },
) {
  const ref = doc(colRef, id);
  await updateDoc(ref, {
    games_started: increment(deltas.gs),
    shots_against: increment(deltas.sa),
    saves: increment(deltas.sv),
    wins: increment(deltas.w),
    shutouts: increment(deltas.so),
  });
}
