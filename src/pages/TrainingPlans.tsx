import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  VStack,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Spinner,
  Flex,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTrainingPlans, addTrainingPlan, TrainingPlan, TrainingWeek, Workout } from '../services/trainingPlanService';
import { useNavigate, useSearchParams } from 'react-router-dom';

// OpenAI integration for generating training plans
const generateTrainingPlan = async (eventType: string, fitnessLevel: string, eventDate: Date, userId: string): Promise<TrainingPlan> => {
  // In a real app, this would call the OpenAI API
  // For now, we'll return a mock training plan
  const weeks: TrainingWeek[] = [];
  
  // Generate weeks based on event type
  const numWeeks = eventType === 'marathon' ? 16 : 
                  eventType === 'half marathon' ? 12 : 
                  eventType === 'hyrox' ? 10 :
                  eventType === 'ironman' ? 20 :
                  eventType === 'half ironman' ? 16 : 8;
  
  for (let i = 1; i <= numWeeks; i++) {
    const workouts: Workout[] = [];
    
    // Generate workouts for each week
    for (let j = 0; j < 4; j++) {
      const days = ['Monday', 'Wednesday', 'Friday', 'Sunday'];
      const types = ['run', 'strength', 'cross', 'endurance'];
      const intensities = ['low', 'medium', 'high', 'medium'] as ('low' | 'medium' | 'high')[];
      
      workouts.push({
        day: days[j],
        title: `${types[j].charAt(0).toUpperCase() + types[j].slice(1)} Training`,
        description: `${i % 2 === 0 ? 'Progressive' : 'Recovery'} ${types[j]} workout for ${fitnessLevel} level`,
        duration: 30 + (j * 10) + (Math.floor(i / 4) * 5),
        intensity: intensities[j],
        type: types[j]
      });
    }
    
    weeks.push({
      weekNumber: i,
      focus: i % 4 === 0 ? 'Recovery' : 
             i % 3 === 0 ? 'Strength' : 
             i % 2 === 0 ? 'Endurance' : 'Speed',
      workouts
    });
  }
  
  return {
    name: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Training Plan`,
    description: `A ${numWeeks}-week progressive training plan designed for ${fitnessLevel} athletes preparing for a ${eventType} event.`,
    eventType,
    eventDate,
    userId,
    weeks
  };
};

const TrainingPlans: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form state
  const [eventType, setEventType] = useState('marathon');
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      if (currentUser) {
        try {
          const plans = await getUserTrainingPlans(currentUser.uid);
          setTrainingPlans(plans);
          
          // Check if we need to show a specific plan
          const planId = searchParams.get('id');
          if (planId) {
            const plan = plans.find(p => p.id === planId);
            if (plan) {
              setSelectedPlan(plan);
              onOpen();
            }
          }
        } catch (error) {
          console.error('Error fetching training plans:', error);
          toast({
            title: 'Error',
            description: 'Failed to load training plans',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTrainingPlans();
  }, [currentUser, searchParams, toast, onOpen]);

  const handleGeneratePlan = async () => {
    if (!currentUser) return;
    
    if (!eventDate) {
      toast({
        title: 'Error',
        description: 'Please select an event date',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setGenerating(true);
    
    try {
      // Generate training plan
      const eventDateObj = new Date(eventDate);
      const plan = await generateTrainingPlan(
        eventType, 
        userProfile?.fitnessLevel || 'beginner', 
        eventDateObj,
        currentUser.uid
      );
      
      // Add custom event name if provided
      if (eventName) {
        plan.name = eventName;
      }
      
      // Save to Firestore
      const planId = await addTrainingPlan(currentUser.uid, plan);
      
      // Add the ID to the plan and update state
      const newPlan = { ...plan, id: planId };
      setTrainingPlans([...trainingPlans, newPlan]);
      
      // Show the new plan
      setSelectedPlan(newPlan);
      onOpen();
      
      toast({
        title: 'Success',
        description: 'Training plan generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating training plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate training plan',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  return (
    <Box>
      <Heading mb={6}>Training Plans</Heading>
      
      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="green.500" />
        </Flex>
      ) : (
        <>
          {/* Generate Plan Form */}
          <Card mb={8} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Generate New Training Plan</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Event Type</FormLabel>
                  <Select 
                    value={eventType} 
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="marathon">Marathon</option>
                    <option value="half marathon">Half Marathon</option>
                    <option value="10k">10K</option>
                    <option value="5k">5K</option>
                    <option value="hyrox">Hyrox</option>
                    <option value="ironman">Ironman</option>
                    <option value="half ironman">Half Ironman</option>
                    <option value="mini triathlon">Mini Triathlon</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Event Name (Optional)</FormLabel>
                  <Input 
                    placeholder="e.g., London Marathon 2025" 
                    value={eventName} 
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Event Date</FormLabel>
                  <Input 
                    type="date" 
                    value={eventDate} 
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </FormControl>
                
                <Button 
                  colorScheme="green" 
                  onClick={handleGeneratePlan}
                  isLoading={generating}
                  loadingText="Generating"
                >
                  Generate Training Plan
                </Button>
              </VStack>
            </CardBody>
          </Card>
          
          {/* Existing Plans */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Your Training Plans</Heading>
            </CardHeader>
            <CardBody>
              {trainingPlans.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {trainingPlans.map((plan) => (
                    <Box 
                      key={plan.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={borderColor}
                      _hover={{ 
                        shadow: 'md', 
                        borderColor: 'green.300',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedPlan(plan);
                        onOpen();
                      }}
                    >
                      <Heading size="sm" mb={2}>{plan.name}</Heading>
                      <Text fontSize="sm" mb={3} noOfLines={2}>{plan.description}</Text>
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme="green">{plan.eventType}</Badge>
                        <Text fontSize="xs">
                          Event Date: {formatDate(plan.eventDate)}
                        </Text>
                        <Text fontSize="xs">
                          {plan.weeks?.length || 0} weeks • {plan.weeks?.reduce((total, week) => total + week.workouts.length, 0) || 0} workouts
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Text textAlign="center" py={4}>
                  You don't have any training plans yet. Generate your first plan above!
                </Text>
              )}
            </CardBody>
          </Card>
          
          {/* Plan Detail Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedPlan?.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedPlan && (
                  <VStack spacing={4} align="stretch">
                    <Text>{selectedPlan.description}</Text>
                    
                    <Box>
                      <Text fontWeight="bold">Event Type:</Text>
                      <Text>{selectedPlan.eventType}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Event Date:</Text>
                      <Text>{formatDate(selectedPlan.eventDate)}</Text>
                    </Box>
                    
                    <Heading size="md" mt={4}>Training Schedule</Heading>
                    
                    <Accordion allowMultiple>
                      {selectedPlan.weeks?.map((week) => (
                        <AccordionItem key={week.weekNumber}>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                Week {week.weekNumber}: {week.focus}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <VStack spacing={3} align="stretch">
                              {week.workouts.map((workout, idx) => (
                                <Box 
                                  key={idx} 
                                  p={3} 
                                  borderWidth="1px" 
                                  borderRadius="md"
                                  borderColor={borderColor}
                                >
                                  <Flex justify="space-between" align="center" mb={1}>
                                    <Text fontWeight="bold">{workout.day}: {workout.title}</Text>
                                    <Badge 
                                      colorScheme={
                                        workout.intensity === 'high' ? 'red' : 
                                        workout.intensity === 'medium' ? 'orange' : 'green'
                                      }
                                    >
                                      {workout.intensity}
                                    </Badge>
                                  </Flex>
                                  <Text fontSize="sm">{workout.description}</Text>
                                  <Text fontSize="xs" mt={1}>
                                    {workout.duration} minutes • {workout.type}
                                  </Text>
                                </Box>
                              ))}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default TrainingPlans;
