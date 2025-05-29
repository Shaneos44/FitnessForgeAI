import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, DocumentData } from 'firebase/firestore';

export interface WorkoutPlan {
  id?: string;
  uid: string;
  event: string;
  eventDate: string;
  ability: string;
  sex: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  experience: string;
  days: number;
  notes: string;
  plan: string;
  createdAt?: any;
}

export const saveWorkoutPlan = async (uid: string, planData: Omit<WorkoutPlan, 'id' | 'createdAt'> & { plan: string }): Promise<string> => {
  const docRef = await addDoc(collection(db, 'workoutPlans'), {
    ...planData,
    uid,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getWorkoutPlans = async (uid: string): Promise<WorkoutPlan[]> => {
  const q = query(collection(db, 'workoutPlans'), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
};
