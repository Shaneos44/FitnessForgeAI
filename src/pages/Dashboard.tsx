import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Divider
} from '@chakra-ui/react';
import { FiActivity, FiCalendar, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserWorkouts } from '../services/workoutService';
import { getUserTrainingPlans } from '../services/trainingPlanService';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const [workoutsData, plansData] = await Promise.all([
            getUserWorkouts(currentUser.uid),
            getUserTrainingPlans(currentUser.uid)
          ]);
          
          setWorkouts(workoutsData);
          setTrainingPlans(plansData);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [currentUser]);

  // Calculate stats
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
  
  // Get upcoming workouts (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingWorkouts = workouts
    .filter(w => {
      const workoutDate = w.date.toDate ? w.date.toDate() : new Date(w.date);
      return !w.completed && workoutDate >= today && workoutDate <= nextWeek;
    })
    .sort((a, b) => {
      const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      
      {loading ? (
        <Text>Loading your fitness data...</Text>
      ) : (
        <>
          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <StatLabel>Completed Workouts</StatLabel>
              <StatNumber>{completedWorkouts}</StatNumber>
              <StatHelpText>Total: {totalWorkouts}</StatHelpText>
              <Icon as={FiActivity} boxSize={6} color="green.500" position="absolute" top={4} right={4} />
            </Stat>
            
            <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <StatLabel>Active Training Plans</StatLabel>
              <StatNumber>{trainingPlans.length}</StatNumber>
              <StatHelpText>Personalized for you</StatHelpText>
              <Icon as={FiCalendar} boxSize={6} color="blue.500" position="absolute" top={4} right={4} />
            </Stat>
            
            <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <StatLabel>Completion Rate</StatLabel>
              <StatNumber>{completionRate.toFixed(0)}%</StatNumber>
              <Progress value={completionRate} colorScheme="green" size="sm" mt={2} />
              <Icon as={FiTrendingUp} boxSize={6} color="purple.500" position="absolute" top={4} right={4} />
            </Stat>
            
            <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <StatLabel>Fitness Level</StatLabel>
              <StatNumber>{userProfile?.fitnessLevel || 'Beginner'}</StatNumber>
              <StatHelpText>Keep improving!</StatHelpText>
              <Icon as={FiAward} boxSize={6} color="orange.500" position="absolute" top={4} right={4} />
            </Stat>
          </SimpleGrid>
          
          {/* Upcoming Workouts */}
          <Card mb={8} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Upcoming Workouts</Heading>
            </CardHeader>
            <CardBody>
              {upcomingWorkouts.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {upcomingWorkouts.map((workout, index) => {
                    const workoutDate = workout.date.toDate ? workout.date.toDate() : new Date(workout.date);
                    return (
                      <React.Fragment key={workout.id || index}>
                        {index > 0 && <Divider />}
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="bold">{workout.title}</Text>
                            <Text fontSize="sm">{workoutDate.toLocaleDateString()} • {workout.duration} min • {workout.type}</Text>
                          </Box>
                          <Button size="sm" colorScheme="green" onClick={() => navigate(`/workouts?id=${workout.id}`)}>
                            View
                          </Button>
                        </HStack>
                      </React.Fragment>
                    );
                  })}
                </VStack>
              ) : (
                <Text>No upcoming workouts for the next 7 days.</Text>
              )}
              
              <Button 
                mt={4} 
                colorScheme="blue" 
                variant="outline" 
                onClick={() => navigate('/workouts')}
                size="sm"
              >
                View All Workouts
              </Button>
            </CardBody>
          </Card>
          
          {/* Training Plans */}
          <Card mb={8} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Your Training Plans</Heading>
                <Button 
                  colorScheme="green" 
                  size="sm"
                  onClick={() => navigate('/training-plans')}
                >
                  Generate New Plan
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              {trainingPlans.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {trainingPlans.slice(0, 2).map((plan) => (
                    <Box 
                      key={plan.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={2}>{plan.name}</Heading>
                      <Text fontSize="sm" mb={3}>{plan.description}</Text>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.500">
                          {plan.eventType} • {plan.weeks?.length || 0} weeks
                        </Text>
                        <Button 
                          size="xs" 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => navigate(`/training-plans?id=${plan.id}`)}
                        >
                          View Plan
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <VStack spacing={4} align="center" py={4}>
                  <Text>You don't have any training plans yet.</Text>
                  <Button 
                    colorScheme="green" 
                    onClick={() => navigate('/training-plans')}
                  >
                    Create Your First Plan
                  </Button>
                </VStack>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
