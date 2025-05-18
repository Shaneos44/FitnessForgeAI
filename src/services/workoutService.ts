import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  addDoc,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore';

export interface Workout {
  id?: string;
  userId: string;
  title: string;
  description: string;
  date: Timestamp | Date;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  type: string;
  completed: boolean;
  completedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
  trainingPlanId?: string;
}

// Add a workout
export const addWorkout = async (userId: string, workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const workoutDataWithUser: Omit<Workout, 'id'> = {
      ...workoutData,
      userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const docRef = await addDoc(collection(db, 'workouts'), workoutDataWithUser);
    return docRef.id;
  } catch (error) {
    console.error('Error adding workout:', error);
    throw error;
  }
};

// Get all workouts for a user
export const getUserWorkouts = async (userId: string): Promise<Workout[]> => {
  try {
    const q = query(
      collection(db, 'workouts'), 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const workouts: Workout[] = [];
    querySnapshot.forEach((doc) => {
      workouts.push({
        id: doc.id,
        ...doc.data()
      } as Workout);
    });
    
    return workouts;
  } catch (error) {
    console.error('Error getting workouts:', error);
    throw error;
  }
};

// Get a specific workout
export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  try {
    const docRef = doc(db, 'workouts', workoutId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Workout;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting workout:', error);
    throw error;
  }
};

// Update workout
export const updateWorkout = async (workoutId: string, workoutData: Partial<Workout>): Promise<boolean> => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    await updateDoc(workoutRef, {
      ...workoutData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

// Update workout completion status
export const updateWorkoutStatus = async (workoutId: string, completed: boolean): Promise<boolean> => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    await updateDoc(workoutRef, {
      completed,
      completedAt: completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating workout status:', error);
    throw error;
  }
};

// Delete a workout
export const deleteWorkout = async (workoutId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'workouts', workoutId));
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};
