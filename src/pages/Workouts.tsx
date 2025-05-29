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
  MenuItem,
  useDisclosure
} from '@chakra-ui/react';
import { getUserWorkouts, updateWorkoutStatus, deleteWorkout, addWorkout } from '../services/workoutService';
import AddWorkoutModal from '../components/AddWorkoutModal';
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Add Workout handler
  const handleAddWorkout = async (workout: any) => {
    if (!currentUser) return;
    try {
      await addWorkout(currentUser.uid, workout);
      toast({
        title: 'Workout added!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh workouts
      const userWorkouts = await getUserWorkouts(currentUser.uid);
      setWorkouts(userWorkouts);
    } catch (e) {
      toast({ title: 'Error adding workout', status: 'error', duration: 4000, isClosable: true });
    }
  };

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

  // Calculate summary stats
  const completedCount = workouts.filter(w => w.completed).length;
  // Simple streak logic: count consecutive days with completed workouts up to today
  let streak = 0;
  let currentDate = new Date();
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toLocaleDateString();
    if (workouts.some(w => w.completed && new Date(w.date).toLocaleDateString() === dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <Box p={5}>
      {/* Motivational Banner */}
      <Box bgGradient="linear(to-r, blue.400, purple.400)" p={5} borderRadius="xl" mb={6} boxShadow="md" textAlign="center">
        <Heading size="md" color="white" mb={1}>Keep pushing forward!</Heading>
        <Text color="whiteAlpha.900">Every workout brings you closer to your goals. Stay consistent and celebrate your progress!</Text>
      </Box>

      {/* Summary Stats */}
      <Flex justify="center" gap={8} mb={8}>
        <Box textAlign="center">
          <Heading size="lg" color="blue.600">{completedCount}</Heading>
          <Text fontSize="sm" color="gray.600">Workouts Completed</Text>
        </Box>
        <Box textAlign="center">
          <Heading size="lg" color="purple.600">{streak}</Heading>
          <Text fontSize="sm" color="gray.600">Day Streak</Text>
        </Box>
      </Flex>

      {workouts.length === 0 ? (
        <Box textAlign="center" p={10} bg="gray.50" borderRadius="lg">
          <img src="https://undraw.co/api/illustrations/undraw_fitness_stats_sht6.svg" alt="No workouts" style={{ width: 220, margin: '0 auto 24px' }} />
          <Heading size="md" mb={3}>No workouts found</Heading>
          <Text mb={5}>You don't have any workouts yet. Create your first workout to get started.</Text>
          <Button colorScheme="blue" onClick={onOpen}>Create Workout</Button>
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
