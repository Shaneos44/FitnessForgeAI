import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Button, useToast, Badge, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const WorkoutHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      loadWorkouts();
    }
  }, [currentUser]);

  const loadWorkouts = async () => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef,
        where('userId', '==', currentUser?.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const workoutsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workout history',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const formatDuration = (duration: number) => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading>Workout History</Heading>
        
        {workouts.length === 0 ? (
          <Box textAlign="center" py={10}>
            <img src="https://undraw.co/api/illustrations/undraw_in_no_time_6igu.svg" alt="No workouts yet" style={{ width: 180, margin: '0 auto 24px' }} />
            <Text fontWeight="semibold" color="gray.700" mb={2}>No workout history yet</Text>
            <Text color="gray.500">Your logged workouts will appear here. Start moving and your fitness journey will be tracked!</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <Heading size="md">{new Date(workout.timestamp.toMillis()).toLocaleDateString()}</Heading>
                </CardHeader>
                
                <CardBody>
                  <Box mb={4}>
                    <Badge colorScheme={workout.type === 'running' ? 'blue' : workout.type === 'cycling' ? 'green' : 'purple'}>
                      {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                    </Badge>
                  </Box>
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel>Distance</StatLabel>
                      <StatNumber>{formatDistance(workout.distance)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Duration</StatLabel>
                      <StatNumber>{formatDuration(workout.duration)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Pace</StatLabel>
                      <StatNumber>{workout.pace.toFixed(1)} min/km</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Speed</StatLabel>
                      <StatNumber>{workout.speed.toFixed(1)} km/h</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Calories</StatLabel>
                      <StatNumber>{Math.round(workout.caloriesBurned)} kcal</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Elevation</StatLabel>
                      <StatNumber>{workout.elevationGain} m</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </CardBody>
                
                <CardFooter>
                  <Button size="sm" onClick={() => loadWorkouts()}>
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default WorkoutHistory;
