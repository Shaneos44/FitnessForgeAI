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
  Timestamp
} from 'firebase/firestore';

export interface UserProfile {
  id?: string;
  uid: string;
  displayName: string;
  email: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  height?: number;
  weight?: number;
  birthdate?: Timestamp | Date;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Create or update user profile
export const saveUserProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'userProfiles', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        uid,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
