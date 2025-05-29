import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthError {
  code: string;
  message: string;
}

export const registerUser = async (email: string, password: string, displayName: string): Promise<User | AuthError> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error: any) {
    return {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during registration'
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<User | AuthError> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    return {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during login'
    };
  }
};

export const logoutUser = async (): Promise<boolean | AuthError> => {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    return {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during logout'
    };
  }
};

export const resetPassword = async (email: string): Promise<boolean | AuthError> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    return {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during password reset'
    };
  }
};
