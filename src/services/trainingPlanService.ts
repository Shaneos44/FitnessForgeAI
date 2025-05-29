import { db } from '../config/firebase';
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
  Timestamp
} from 'firebase/firestore';

export interface TrainingPlan {
  id?: string;
  name: string;
  description: string;
  eventType: string;
  eventDate: Timestamp | Date;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
  weeks: TrainingWeek[];
}

export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  workouts: Workout[];
}

export interface Workout {
  day: string;
  title: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  type: string;
  completed?: boolean;
}

// Add a new training plan
export const addTrainingPlan = async (userId: string, planData: Omit<TrainingPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const trainingPlanData: Omit<TrainingPlan, 'id'> = {
      ...planData,
      userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const planCollectionRef = collection(db, 'trainingPlans', userId, 'PlanID');
    const docRef = await addDoc(planCollectionRef, trainingPlanData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding training plan:', error);
    throw error;
  }
};

// Get a specific training plan
export const getTrainingPlan = async (userId: string, planId: string): Promise<TrainingPlan | null> => {
  try {
    const docRef = doc(db, 'trainingPlans', userId, 'PlanID', planId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as TrainingPlan;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting training plan:', error);
    throw error;
  }
};

// Get all training plans for a user
export const getUserTrainingPlans = async (userId: string): Promise<TrainingPlan[]> => {
  try {
    const planCollectionRef = collection(db, 'trainingPlans', userId, 'PlanID');
    const querySnapshot = await getDocs(planCollectionRef);
    
    const plans: TrainingPlan[] = [];
    querySnapshot.forEach((doc) => {
      plans.push({
        id: doc.id,
        ...doc.data()
      } as TrainingPlan);
    });
    
    return plans;
  } catch (error) {
    console.error('Error getting training plans:', error);
    throw error;
  }
};

// Update a training plan
export const updateTrainingPlan = async (userId: string, planId: string, planData: Partial<TrainingPlan>): Promise<boolean> => {
  try {
    const planRef = doc(db, 'trainingPlans', userId, 'PlanID', planId);
    await updateDoc(planRef, {
      ...planData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating training plan:', error);
    throw error;
  }
};

// Delete a training plan
export const deleteTrainingPlan = async (userId: string, planId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'trainingPlans', userId, 'PlanID', planId));
    return true;
  } catch (error) {
    console.error('Error deleting training plan:', error);
    throw error;
  }
};
