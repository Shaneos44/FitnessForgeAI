import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useToast,
  Avatar,
  Flex,
  Badge,
  IconButton,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { FiShare2, FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  displayName: string;
  photoURL: string;
  following: string[];
  followers: string[];
}

interface WorkoutShare {
  id: string;
  workoutId: string;
  userId: string;
  timestamp: Date;
}

const SocialFeatures: React.FC = () => {
  const { currentUser } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [sharedWorkouts, setSharedWorkouts] = useState<WorkoutShare[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      loadUserConnections();
      loadSharedWorkouts();
    }
  }, [currentUser]);

  const loadUserConnections = async () => {
    try {
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (userData) {
        setFollowing(userData.following || []);
        setFollowers(userData.followers || []);
      }
    } catch (error) {
      console.error('Error loading user connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load connections',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadSharedWorkouts = async () => {
    try {
      if (following.length === 0) {
        setSharedWorkouts([]);
        return;
      }
      
      const sharedRef = collection(db, 'sharedWorkouts');
      const q = query(
        sharedRef,
        where('userId', 'in', following)
      );
      
      const querySnapshot = await getDocs(q);
      const sharedData: WorkoutShare[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.workoutId && data.userId && data.timestamp) {
          sharedData.push({
            id: doc.id,
            workoutId: data.workoutId,
            userId: data.userId,
            timestamp: data.timestamp.toDate()
          });
        }
      });
      
      setSharedWorkouts(sharedData);
    } catch (error) {
      console.error('Error loading shared workouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shared workouts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const followUser = async (userId: string) => {
    try {
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        following: [...following, userId]
      });

      toast({
        title: 'Success',
        description: 'User followed successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFollowing([...following, userId]);
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: 'Error',
        description: 'Failed to follow user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        following: following.filter(id => id !== userId)
      });

      toast({
        title: 'Success',
        description: 'User unfollowed successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFollowing(following.filter(id => id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: 'Error',
        description: 'Failed to unfollow user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const shareWorkout = async (workoutId: string) => {
    try {
      if (!currentUser) return;

      const sharedRef = collection(db, 'sharedWorkouts');
      await setDoc(doc(sharedRef), {
        workoutId,
        userId: currentUser.uid,
        timestamp: new Date(),
      });

      toast({
        title: 'Success',
        description: 'Workout shared successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sharing workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to share workout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Image src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=600&q=80" alt="Fitness community sharing" borderRadius="xl" width="100%" maxH="200px" objectFit="cover" mb={6} />
      <Box display="flex" gap={4} mb={4}>
        <Tooltip label="Share this post" aria-label="Share">
          <IconButton aria-label="Share" icon={<FiShare2 />} />
        </Tooltip>
        <Tooltip label="Like this post" aria-label="Like">
          <IconButton aria-label="Like" icon={<span role="img" aria-label="like">❤️</span>} />
        </Tooltip>
        <Tooltip label="Comment on this post" aria-label="Comment">
          <IconButton aria-label="Comment" icon={<span role="img" aria-label="comment">💬</span>} />
        </Tooltip>
      </Box>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Social Features</Text>

        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontSize="lg" fontWeight="medium" mb={4}>Following</Text>
          <VStack spacing={3} align="stretch">
            {following.map((userId) => (
              <Flex key={userId} align="center" justify="space-between">
                <Flex align="center">
                  <Avatar size="sm" name={`User ${userId}`} />
                  <Text ml={3}>User {userId}</Text>
                </Flex>
                <IconButton
                  aria-label="Unfollow"
                  icon={<FiUserMinus />}
                  variant="ghost"
                  onClick={() => unfollowUser(userId)}
                />
              </Flex>
            ))}
          </VStack>
        </Box>

        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontSize="lg" fontWeight="medium" mb={4}>Shared Workouts</Text>
          <VStack spacing={3} align="stretch">
            {sharedWorkouts.map((shared) => (
              <Box key={shared.id} p={3} borderWidth={1} borderRadius="md">
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Avatar size="sm" name={`User ${shared.userId}`} />
                    <Text ml={3}>User {shared.userId}</Text>
                  </Flex>
                  <Text>{new Date(shared.timestamp).toLocaleDateString()}</Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SocialFeatures;
