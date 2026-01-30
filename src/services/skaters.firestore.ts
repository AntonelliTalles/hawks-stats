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
import type { Skater } from '../types/skater';

const colRef = collection(db, 'skaters');

export async function listSkaters(): Promise<Skater[]> {
  const q = query(colRef, orderBy('name', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as Omit<Skater, 'id'> & { number?: number | null };
    return {
      id: d.id,
      ...data,
      number: data.number ?? undefined, // força undefined (nunca null)
    };
  });
}

export type CreateSkaterInput = {
  name: string;
  number?: number;
  position: Skater['position'];
  is_active: boolean;
};

export async function createSkater(values: CreateSkaterInput) {
  const ref = doc(colRef);

  const payload: Omit<Skater, 'id'> = {
    name: values.name,
    number: values.number ?? undefined,
    position: values.position,
    goals: 0,
    assists: 0,
    points: 0,
    is_active: values.is_active,
  };

  await setDoc(ref, payload);
  return ref.id;
}

export async function updateSkater(id: string, values: Partial<Skater>) {
  const ref = doc(colRef, id);

  const patch: any = { ...values };

  // normaliza number (não salva null)
  if ('number' in patch && patch.number == null) delete patch.number;

  // se mexer em goals/assists, recalcula points
  if ('goals' in patch || 'assists' in patch) {
    // a forma simples: manter points sempre atualizado via incrementStats (ver abaixo)
    // aqui a gente só recalcula se vierem ambos:
    if (typeof patch.goals === 'number' && typeof patch.assists === 'number') {
      patch.points = patch.goals + patch.assists;
    }
  }

  await updateDoc(ref, patch);
}

export async function deleteSkater(id: string) {
  await deleteDoc(doc(colRef, id));
}

export async function incrementSkaterStats(id: string, goalsDelta: number, assistsDelta: number) {
  const ref = doc(colRef, id);
  await updateDoc(ref, {
    goals: increment(goalsDelta),
    assists: increment(assistsDelta),
    points: increment(goalsDelta + assistsDelta),
  });
}
