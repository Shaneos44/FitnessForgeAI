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
  Divider,
  CircularProgress
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

  // Motivational quotes
  const quotes = [
    "Small steps every day lead to big results.",
    "Consistency is the key to progress.",
    "You are stronger than you think.",
    "Every workout counts. Keep going!",
    "Push yourself, because no one else will do it for you."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Personalized greeting
  const userName = userProfile?.displayName || currentUser?.email?.split('@')[0] || "Athlete";

  return (
    <Box>
      {/* Motivational Banner */}
      <Box bgGradient="linear(to-r, blue.400, purple.400)" p={4} borderRadius="xl" mb={4} boxShadow="md" textAlign="center">
        <Heading size="md" color="white" mb={1}>Welcome back, {userName}! 💪</Heading>
        <Text color="whiteAlpha.900" fontStyle="italic">{randomQuote}</Text>
      </Box>

      {/* Quick Actions */}
      <HStack spacing={4} mb={6} justify="center">
        <Button colorScheme="blue" size="md" leftIcon={<FiActivity />} onClick={() => navigate('/workouts')} aria-label="Log Workout">
          Log Workout
        </Button>
        <Button colorScheme="green" size="md" leftIcon={<FiTrendingUp />} onClick={() => navigate('/plan-generator')} aria-label="Generate Plan">
          Generate Plan
        </Button>
        <Button colorScheme="purple" size="md" leftIcon={<FiAward />} onClick={() => navigate('/community')} aria-label="Join Challenge">
          Join Challenge
        </Button>
      </HStack>

      <Heading mb={6}>Dashboard</Heading>
      {/* Congratulatory message for high completion rate */}
      {completionRate >= 80 && (
        <Box bg="green.50" borderRadius="md" p={3} mb={4} borderWidth="1px" borderColor="green.200" textAlign="center">
          <Text color="green.700" fontWeight="bold">Amazing consistency! Keep up the great work 💪</Text>
        </Box>
      )}
      
      {loading ? (
        <Text>Loading your fitness data...</Text>
      ) : (
        <>
          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            {/* Weekly Goal Progress Ring */}
            <Box
              p={4}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-2px) scale(1.03)', transition: 'all 0.18s cubic-bezier(.4,0,.2,1)' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
              aria-label="Weekly Goal Progress"
            >
              <Text fontWeight="bold" mb={2} fontSize="md">Weekly Goal</Text>
              <Box position="relative" display="inline-block">
                <CircularProgress
                  value={(() => {
                    // Calculate weekly progress
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6); // Saturday
                    const thisWeekWorkouts = workouts.filter(w => {
                      const d = w.date.toDate ? w.date.toDate() : new Date(w.date);
                      return d >= weekStart && d <= weekEnd && w.completed;
                    });
                    const goal = (typeof userProfile?.weeklyGoal === 'number' ? userProfile.weeklyGoal : 3) || 3;
                    return Math.min((thisWeekWorkouts.length / goal) * 100, 100);
                  })()}
                  size="68px"
                  thickness="10px"
                  color={(() => {
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    const thisWeekWorkouts = workouts.filter(w => {
                      const d = w.date.toDate ? w.date.toDate() : new Date(w.date);
                      return d >= weekStart && d <= weekEnd && w.completed;
                    });
                    const goal = (typeof userProfile?.weeklyGoal === 'number' ? userProfile.weeklyGoal : 3) || 3;
                    return thisWeekWorkouts.length >= goal ? 'green.400' : 'blue.400';
                  })()}
                  trackColor="gray.200"
                  aria-label="Weekly Workout Goal Progress"
                >
                  {/* Optional: Add icon in center if goal met */}
                  {(() => {
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    const thisWeekWorkouts = workouts.filter(w => {
                      const d = w.date.toDate ? w.date.toDate() : new Date(w.date);
                      return d >= weekStart && d <= weekEnd && w.completed;
                    });
                    const goal = (typeof userProfile?.weeklyGoal === 'number' ? userProfile.weeklyGoal : 3) || 3;
                    if (thisWeekWorkouts.length >= goal) {
                      return <Icon as={FiAward} color="green.400" boxSize={7} position="absolute" top="10px" left="10px" />;
                    }
                    return null;
                  })()}
                </CircularProgress>
                <Box position="absolute" top="0" left="0" w="68px" h="68px" display="flex" alignItems="center" justifyContent="center">
                  <Text fontWeight="bold" fontSize="lg">
                    {(() => {
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      const thisWeekWorkouts = workouts.filter(w => {
                        const d = w.date.toDate ? w.date.toDate() : new Date(w.date);
                        return d >= weekStart && d <= weekEnd && w.completed;
                      });
                      return thisWeekWorkouts.length;
                    })()}
                  </Text>
                </Box>
              </Box>
              <Text fontSize="sm" color="gray.600" mt={2}>
                {(() => {
                  const goal = (typeof userProfile?.weeklyGoal === 'number' ? userProfile.weeklyGoal : 3) || 3;
                  return `Goal: ${goal} / week`;
                })()}
              </Text>
            </Box>
            <Stat
              as={Box}
              p={4}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              position="relative"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-2px) scale(1.03)', transition: 'all 0.18s cubic-bezier(.4,0,.2,1)' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
              aria-label="Completed Workouts Stat"
            >
              <StatLabel>Completed Workouts</StatLabel>
              <StatNumber>{completedWorkouts}</StatNumber>
              <StatHelpText>Total: {totalWorkouts}</StatHelpText>
              <Icon as={FiActivity} boxSize={6} color="green.500" position="absolute" top={4} right={4} />
            </Stat>
            
            <Stat
              as={Box}
              p={4}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              position="relative"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-2px) scale(1.03)', transition: 'all 0.18s cubic-bezier(.4,0,.2,1)' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
              aria-label="Active Training Plans Stat"
            >
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
                          <Button size="sm" colorScheme="green" onClick={() => navigate(`/workouts?id=${workout.id}`)} aria-label="View workout details">
                            View
                          </Button>
                        </HStack>
                      </React.Fragment>
                    );
                  })}
                </VStack>
              ) : (
                <Box textAlign="center" py={4}>
                  <img src="https://undraw.co/api/illustrations/undraw_workout_gcgu.svg" alt="No upcoming workouts" style={{ width: 120, margin: '0 auto 14px' }} />
                  <Text color="gray.500">No upcoming workouts for the next 7 days.</Text>
                  <Text fontSize="xs" color="gray.400">Schedule your next session to stay on track!</Text>
                </Box>
              )}
              
              <Button 
                mt={4} 
                colorScheme="blue" 
                variant="outline" 
                onClick={() => navigate('/workouts')}
                size="sm"
                aria-label="View all workouts"
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
                  aria-label="Generate new plan"
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
                          aria-label="View training plan details"
                        >
                          View Plan
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <VStack spacing={4} align="center" py={4}>
                  <Box textAlign="center" py={4}>
                    <img src="https://undraw.co/api/illustrations/undraw_goal_0v5v.svg" alt="No plans yet" style={{ width: 120, margin: '0 auto 14px' }} />
                    <Text color="gray.500">You don't have any training plans yet.</Text>
                    <Text fontSize="xs" color="gray.400">Let AI help you build your first plan!</Text>
                  </Box>
                  <Button 
                    colorScheme="green" 
                    onClick={() => navigate('/training-plans')}
                    aria-label="Create your first plan"
                  >
                    Create Your First Plan
                  </Button>
                </VStack>
              )}
            </CardBody>
          </Card>
        </>
      )}
      {/* Join the Community Callout */}
      <Box mt={10} mb={6} p={6} bgGradient="linear(to-r, purple.100, blue.50)" borderRadius="2xl" boxShadow="lg" textAlign="center" role="region" aria-labelledby="community-heading">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="center">
          <Box flexShrink={0} mb={{ base: 4, md: 0 }} mr={{ md: 8 }}>
            <img src="https://undraw.co/api/illustrations/undraw_team_spirit_re_yl1v.svg" alt="Join the Community Illustration" style={{ width: 120 }} />
          </Box>
          <Box>
            <Heading id="community-heading" size="md" mb={2} color="purple.700">Join the FitnessForgeAI Community</Heading>
            <Text mb={3} color="gray.700">Share your journey, join challenges, and get support from trainers and peers. Motivation is stronger together!</Text>
            <Button colorScheme="purple" size="lg" fontWeight="bold" onClick={() => navigate('/social')} aria-label="Join the FitnessForgeAI Community">
              Join the Community
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Dashboard;
