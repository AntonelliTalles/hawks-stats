import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Skater, SkaterBaseInput } from '../types/skater';

const skatersCol = collection(db, 'skaters');

export async function listSkaters(): Promise<Skater[]> {
  const q = query(skatersCol, orderBy('name', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as Omit<Skater, 'id'> & { number?: number | null };

    return {
      id: d.id,
      ...data,
      number: data.number ?? undefined,
    };
  });
}

export async function createSkater(values: SkaterBaseInput) {
  const payload: Omit<Skater, 'id'> = {
    ...values,
    goals: 0,
    assists: 0,
    points: 0,
  };

  const ref = await addDoc(skatersCol, payload);
  return ref.id;
}

export async function updateSkater(id: string, values: SkaterBaseInput) {
  const ref = doc(skatersCol, id);

  const patch: Partial<Omit<Skater, 'id'>> = { ...values };

  // se number vier vazio, não salva null
  if (patch.number == null) {
    delete patch.number;
  }

  await updateDoc(ref, patch);
}

export async function deleteSkater(id: string) {
  const ref = doc(skatersCol, id);
  await deleteDoc(ref);
}

export async function incrementSkaterStats(id: string, goalsDelta: number, assistsDelta: number) {
  const ref = doc(skatersCol, id);

  await updateDoc(ref, {
    goals: increment(goalsDelta),
    assists: increment(assistsDelta),
    points: increment(goalsDelta + assistsDelta),
  });
}
