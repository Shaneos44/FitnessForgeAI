import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Button, 
  useToast, 
  Flex, 
  Badge, 
  Divider,
  Spinner,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { getUserWorkouts, updateWorkoutStatus, deleteWorkout } from '../services/workoutService';
import { useAuth } from '../contexts/AuthContext';

interface WorkoutCardProps {
  workout: any;
  onStatusChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStatusChange, onDelete }) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'green.400';
      case 'medium': return 'yellow.400';
      case 'high': return 'red.400';
      default: return 'gray.400';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'No date';
    const d = date instanceof Date ? date : new Date(date.seconds * 1000);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Box 
      p={5} 
      shadow="md" 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={workout.completed ? 'gray.50' : 'white'}
      position="relative"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Badge colorScheme={workout.completed ? 'green' : 'blue'} mb={2}>
          {workout.completed ? 'Completed' : 'Pending'}
        </Badge>
        <Badge colorScheme={workout.type === 'strength' ? 'purple' : 'orange'} mb={2}>
          {workout.type}
        </Badge>
      </Flex>
      
      <Heading fontSize="xl" mb={2}>{workout.title}</Heading>
      <Text fontSize="sm" color="gray.500" mb={3}>
        {formatDate(workout.date)} • {workout.duration} min
      </Text>
      
      <Box mb={4} h="60px" overflow="hidden" textOverflow="ellipsis">
        <Text fontSize="sm">{workout.description}</Text>
      </Box>
      
      <Divider mb={4} />
      
      <Flex justifyContent="space-between" alignItems="center">
        <Badge 
          px={2} 
          py={1} 
          bg={getIntensityColor(workout.intensity)} 
          color="white"
          borderRadius="full"
        >
          {workout.intensity} intensity
        </Badge>
        
        <Flex>
          <Button 
            size="sm" 
            colorScheme={workout.completed ? 'gray' : 'green'} 
            mr={2}
            onClick={() => onStatusChange(workout.id!, !workout.completed)}
          >
            {workout.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          
          <Button 
            size="sm" 
            colorScheme="red" 
            variant="outline"
            onClick={() => onDelete(workout.id!)}
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userWorkouts = await getUserWorkouts(currentUser.uid);
        setWorkouts(userWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load workouts. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser, toast]);

  const handleStatusChange = async (workoutId: string, completed: boolean) => {
    try {
      await updateWorkoutStatus(workoutId, completed);
      
      // Update local state
      setWorkouts(workouts.map(workout => 
        workout.id === workoutId 
          ? { ...workout, completed, completedAt: completed ? new Date() : null } 
          : workout
      ));
      
      toast({
        title: 'Success',
        description: `Workout marked as ${completed ? 'completed' : 'incomplete'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating workout status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workout status. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (workoutId: string) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await deleteWorkout(workoutId);
      
      // Update local state
      setWorkouts(workouts.filter(workout => workout.id !== workoutId));
      
      toast({
        title: 'Success',
        description: 'Workout deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Your Workouts</Heading>
        <Button colorScheme="blue">Add New Workout</Button>
      </Flex>
      
      {workouts.length === 0 ? (
        <Box textAlign="center" p={10} bg="gray.50" borderRadius="lg">
          <Heading size="md" mb={3}>No workouts found</Heading>
          <Text mb={5}>You don't have any workouts yet. Create your first workout to get started.</Text>
          <Button colorScheme="blue">Create Workout</Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {workouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Workouts;
