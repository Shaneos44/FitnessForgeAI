import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  DocumentReference, 
  DocumentData,
  getDocs,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { FitnessForgeUserProfile } from '../types/FitnessForgeUserProfile';
import { getApp } from "firebase/app";

console.log("FIREBASE PROJECT ID:", getApp().options.projectId);


// Create or update user profile
export const saveUserProfile = async (uid: string, profileData: Partial<FitnessForgeUserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid); // <-- changed here
    const docSnap = await getDoc(userRef);

    // Prepare data to save (remove undefined values)
    const dataToSave = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value !== undefined)
    );

    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...dataToSave,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        uid,
        ...dataToSave,
        completedSetup: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error; // Re-throw to handle in the component
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<FitnessForgeUserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid); // <-- changed here
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FitnessForgeUserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
