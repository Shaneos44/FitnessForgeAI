import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Button,
  Input,
  Select,
  Textarea,
  useToast,
  useColorModeValue,
  Spinner,
  Tooltip,
  Divider,
  IconButton
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { saveWorkoutPlan, getWorkoutPlans, WorkoutPlan } from '../services/planService';

const WorkoutPlanGenerator: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const planBg = useColorModeValue('gray.50', 'gray.700');
  const [goal, setGoal] = useState(userProfile?.goals?.[0] || '');
  const [experience, setExperience] = useState(userProfile?.fitnessLevel || 'beginner');
  const [days, setDays] = useState(3);
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [sportType, setSportType] = useState('');
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Placeholder: Replace with OpenAI API or backend call
  const handleGenerate = async () => {
    if (!currentUser || !userProfile) {
      toast({
      title: 'Login required',
      description: 'Please log in to generate your personalized workout plan and unlock your fitness journey!',
      status: 'error',
      duration: 3500,
      isClosable: true,
      position: 'top',
    });
      return;
    }
    setGenerating(true);
    setPlan(null);
    setPlanId(null);
    setError(null);
    try {
      const response = await fetch('/api/generateWorkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          event: eventType,
          eventDate: eventDate,
          sportType: sportType,
          ability: experience,
          sex: userProfile.sex || '',
          age: (() => {
            if (!userProfile.birthdate) return '';
            let birthDateObj: Date | undefined;
            if (typeof userProfile.birthdate === 'object' && 'seconds' in userProfile.birthdate) {
              birthDateObj = new Date(userProfile.birthdate.seconds * 1000);
            } else if (userProfile.birthdate instanceof Date) {
              birthDateObj = userProfile.birthdate;
            }
            if (birthDateObj) {
              const today = new Date();
              return today.getFullYear() - birthDateObj.getFullYear();
            }
            return '';
          })(),
          height: userProfile.height || '',
          weight: userProfile.weight || '',
          goal,
          experience,
          days,
          notes
        })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        toast({
        title: 'Could not generate plan',
        description: data.error || 'Something went wrong while generating your plan. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      } else {
        setPlan(data.plan);
        setPlanId(data.planId || null);
        toast({
        title: 'Plan generated! 💪',
        description: 'Your AI-powered workout plan is ready. Let\'s crush those goals together!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
        // Reload plans
        loadPlans();
      }
    } catch (err: any) {
      setError(err.message);
      toast({
      title: 'Unexpected error',
      description: err.message || 'An unexpected error occurred. Please try again or check your connection.',
      status: 'error',
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
    } finally {
      setGenerating(false);
    }
  };

  const loadPlans = async () => {
    if (!currentUser) return;
    setLoadingPlans(true);
    try {
      const userPlans = await getWorkoutPlans(currentUser.uid);
      setPlans(userPlans.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err: any) {
      setError('Failed to load plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    if (currentUser) loadPlans();
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <Box minH="100vh" p={{ base: 4, md: 12 }} bgGradient="linear(to-br, blue.900, gray.900, white)">
      <Box maxW="lg" mx="auto" bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" textAlign="center">
        <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="extrabold" mb={4} bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
          Generate Your Workout Plan
        </Heading>
        <Text color="gray.500" mb={6}>
          Tell us your goal, experience, and preferences. Get an AI-crafted plan instantly!
        </Text>
        {/* Motivational Banner */}
        <Box bgGradient="linear(to-r, blue.400, purple.400)" p={4} borderRadius="xl" mb={4} boxShadow="md" textAlign="center">
          <Heading size="md" color="white" mb={1}>Ready to crush your next goal?</Heading>
          <Text color="whiteAlpha.900">Let AI craft the perfect plan for your journey.</Text>
        </Box>
        <VStack spacing={4} align="stretch" mb={8}>
          <Select placeholder="Select event type" value={eventType} onChange={e => setEventType(e.target.value)} isRequired>
            <option value="Marathon">Marathon</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="10K">10K</option>
            <option value="5K">5K</option>
            <option value="Triathlon">Triathlon</option>
          </Select>
          <Input type="date" placeholder="Event date" value={eventDate} onChange={e => setEventDate(e.target.value)} isRequired />
          <Tooltip label="What type of sport or activity are you training for?" aria-label="Sport type info" placement="top-start">
            <Select placeholder="Select sport type" value={sportType} onChange={e => setSportType(e.target.value)} isRequired>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Swimming">Swimming</option>
              <option value="Triathlon">Triathlon</option>
              <option value="Obstacle Course">Obstacle Course</option>
              <option value="Walking">Walking</option>
              <option value="Other">Other</option>
            </Select>
          </Tooltip>
          <Tooltip label="What is your main fitness goal? This helps AI tailor your plan." aria-label="Goal info" placement="top-start">
            <Input placeholder="Your main fitness goal (e.g. lose weight, build muscle)" value={goal} onChange={e => setGoal(e.target.value)} aria-label="Fitness goal" />
          </Tooltip>
          <Tooltip label="Your current fitness level helps us set the right intensity." aria-label="Experience info" placement="top-start">
            <Select value={experience} onChange={e => setExperience(e.target.value as "beginner" | "intermediate" | "advanced" | "elite") } aria-label="Fitness level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </Select>
          </Tooltip>
          <Tooltip label="How many days per week do you want to train?" aria-label="Days per week info" placement="top-start">
            <Input type="number" min={1} max={7} value={days} onChange={e => setDays(Number(e.target.value))} placeholder="Days per week" aria-label="Days per week" />
          </Tooltip>
          <Tooltip label="Add any extra info: equipment, injuries, preferences, etc." aria-label="Notes info" placement="top-start">
            <Textarea placeholder="Anything else? (equipment, injuries, preferences)" value={notes} onChange={e => setNotes(e.target.value)} aria-label="Additional notes" />
          </Tooltip>
        </VStack> 
        <Tooltip label="AI-powered plans are tailored to your goal, experience, and preferences!" aria-label="AI plan info" placement="top">
          <Button colorScheme="blue" size="lg" fontWeight="bold" w="full" onClick={handleGenerate} isLoading={generating} loadingText="Generating..." aria-label="Generate AI workout plan">
            Generate Plan
          </Button>
        </Tooltip>
        {/* Placeholder when no plan is generated */}
        {!plan && !generating && !error && (
          <Box textAlign="center" mt={8}>
            <img src="https://undraw.co/api/illustrations/undraw_personal_trainer_re_cnua.svg" alt="No plan yet" style={{ width: 220, margin: '0 auto 24px' }} />
            <Text color="gray.500" fontSize="lg" mt={3}>No plan generated yet. Fill out the form and let AI build your next training journey!</Text>
          </Box>
        )}
        {plan && (
          <Box mt={8} bg={planBg} p={6} borderRadius="xl" boxShadow="md">
            <Heading size="md" mb={4}>Your AI Workout Plan</Heading>
            <ReactMarkdown>{plan}</ReactMarkdown>
          </Box>
        )}
        {planId && <Text fontSize="sm" color="gray.400">Plan ID: {planId}</Text>}
        {generating && (
          <Flex direction="column" justify="center" align="center" minH="180px" mt={6} gap={3}>
            <img src="https://undraw.co/api/illustrations/undraw_workout_gcgu.svg" alt="Generating plan" style={{ width: 140 }} />
            <Text color="blue.700" fontWeight="bold">Generating your personalized plan...</Text>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        )}
        {error && <Text color="red.500" mt={4}>{error}</Text>}
        <Box mt={12}>
          <Heading size="md" mb={4} letterSpacing="tight">Previous Plans</Heading>
          {loadingPlans ? (
            <Flex justify="center" align="center" minH="80px"><Spinner /></Flex>
          ) : plans.length === 0 ? (
            <Box textAlign="center" py={8}>
              <img src="https://undraw.co/api/illustrations/undraw_completed_tasks_vs6q.svg" alt="No previous plans" style={{ width: 180, margin: '0 auto 24px' }} />
              <Text fontWeight="semibold" color="gray.700" mb={2}>No previous plans yet</Text>
              <Text color="gray.500">Your saved AI plans will appear here. Start generating to build your fitness journey!</Text>
            </Box>
          ) : (
            plans.map(p => (
              <Box key={p.id} bg={planBg} p={4} borderRadius="lg" boxShadow="sm" mb={4}
                _hover={{ boxShadow: 'md', transform: 'scale(1.01)' }}
                transition="all 0.13s cubic-bezier(.4,0,.2,1)">
                <Text fontWeight="bold" color="blue.500">{p.goal || 'Workout Plan'}</Text>
                <Text fontSize="sm" color="gray.500">{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : ''}</Text>
                <ReactMarkdown>{p.plan}</ReactMarkdown>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WorkoutPlanGenerator;
