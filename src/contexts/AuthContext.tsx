import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/userService';
import { FitnessForgeUserProfile } from '../types/FitnessForgeUserProfile';

interface AuthContextType {
  currentUser: User | null;
  userProfile: FitnessForgeUserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<FitnessForgeUserProfile | null>>;
  loading: boolean;
  refreshUserProfile: () => Promise<FitnessForgeUserProfile | null>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  setUserProfile: () => {},
  loading: true,
  refreshUserProfile: async () => null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FitnessForgeUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: User) => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      return null;
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      return fetchUserProfile(currentUser);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    loading,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
