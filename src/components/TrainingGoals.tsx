import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  useToast,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, Timestamp, query, where, DocumentData } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Goal {
  id: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  progress: number;
}

const TrainingGoals: React.FC = () => {
  const navigate = (path: string) => window.location.href = path; // fallback if useNavigate not available
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    type: '',
    targetValue: 0,
    currentValue: 0,
    unit: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      loadGoals();
    }
  }, [currentUser]);

  // If not authenticated, show message and login button
  if (!currentUser) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Sign in to track your goals and progress</Text>
        <Button colorScheme="blue" size="lg" onClick={() => navigate('/login')}>Log In</Button>
      </Box>
    );
  }

  const loadGoals = async () => {
    try {
      if (!currentUser) return;
      
      const goalsRef = collection(db, 'goals');
      const q = query(goalsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const goalsData: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData & {
          type?: string;
          targetValue?: number;
          currentValue?: number;
          unit?: string;
          startDate?: { toDate: () => Date };
          endDate?: { toDate: () => Date };
          progress?: number;
        };
        
        if (data.type && data.targetValue !== undefined && data.currentValue !== undefined) {
          goalsData.push({
            id: doc.id,
            type: data.type,
            targetValue: data.targetValue,
            currentValue: data.currentValue,
            unit: data.unit || '',
            startDate: data.startDate?.toDate() || new Date(),
            endDate: data.endDate?.toDate() || new Date(),
            progress: data.progress || 0
          });
        }
      });
      
      setGoals(goalsData);
    } catch (error: any) {
      console.error('Error loading goals:', error);
      let description = 'Failed to load goals';
      if (error.code === 'permission-denied') {
        description = 'Permission denied. Please log in or check your account access.';
      }
      toast({
        title: 'Error',
        description,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addGoal = async () => {
    try {
      if (!currentUser) return;

      const goalsRef = collection(db, 'goals');
      const newGoalRef = doc(goalsRef);
      
      await setDoc(newGoalRef, {
        ...newGoal,
        userId: currentUser.uid,
        progress: 0,
        startDate: Timestamp.fromDate(newGoal.startDate),
        endDate: Timestamp.fromDate(newGoal.endDate),
      });

      toast({
        title: 'Success',
        description: 'Goal added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewGoal({
        type: '',
        targetValue: 0,
        currentValue: 0,
        unit: '',
        startDate: new Date(),
        endDate: new Date(),
      });
      loadGoals();
    } catch (error: any) {
      console.error('Error adding goal:', error);
      let description = 'Failed to add goal';
      if (error.code === 'permission-denied') {
        description = 'Permission denied. Please log in or check your account access.';
      }
      toast({
        title: 'Error',
        description,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(goalRef);
      const goalData = goalDoc.data();

      if (!goalData) return;

      const progress = (currentValue / goalData.targetValue) * 100;
      
      await updateDoc(goalRef, {
        currentValue,
        progress,
      });

      toast({
        title: 'Success',
        description: 'Goal progress updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      loadGoals();
    } catch (error: any) {
      console.error('Error updating goal:', error);
      let description = 'Failed to update goal';
      if (error.code === 'permission-denied') {
        description = 'Permission denied. Please log in or check your account access.';
      }
      toast({
        title: 'Error',
        description,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Training Goals</Text>

        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontSize="lg" fontWeight="medium" mb={4}>Add New Goal</Text>
          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Goal type (e.g. Running Distance)"
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
            />
            <Input
              placeholder="Target Value"
              type="number"
              value={newGoal.targetValue}
              onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
            />
            <Input
              placeholder="Unit (e.g. km)"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
            />
            <Button colorScheme="blue" onClick={addGoal}>
              Add Goal
            </Button>
          </VStack>
        </Box>

        {goals.length === 0 ? (
          <Box textAlign="center" py={10}>
            <img src="https://undraw.co/api/illustrations/undraw_road_to_knowledge_m8s0.svg" alt="No goals yet" style={{ width: 180, margin: '0 auto 24px' }} />
            <Text fontWeight="semibold" color="gray.700" mb={2}>No goals yet</Text>
            <Text color="gray.500">Set your first training goal and start tracking your progress. Every journey begins with a single step!</Text>
          </Box>
        ) : (
          <VStack spacing={4}>
            {goals.map((goal) => (
              <Box key={goal.id} p={4} borderWidth={1} borderRadius="md">
                <VStack spacing={2} align="stretch">
                  <Text fontSize="lg" fontWeight="medium">{goal.type}</Text>
                  <Stat>
                    <StatLabel>Progress</StatLabel>
                    <StatNumber>
                      {goal.progress.toFixed(1)}%
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type={goal.progress >= 100 ? "increase" : "decrease"} />
                      {goal.currentValue} {goal.unit} / {goal.targetValue} {goal.unit}
                    </StatHelpText>
                  </Stat>
                  <Progress value={goal.progress} size="sm" />
                  <Input
                    type="number"
                    value={goal.currentValue}
                    onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                    placeholder="Current Value"
                  />
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default TrainingGoals;
