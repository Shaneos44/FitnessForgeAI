import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  VStack, 
  Heading, 
  Text, 
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveUserProfile } from '../services/userService';
import { FitnessForgeUserProfile } from '../types/FitnessForgeUserProfile';

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' }
];

const fitnessGoals = [
  'Weight Loss',
  'Muscle Gain',
  'Strength',
  'Endurance',
  'General Fitness',
  'Sport Specific',
  'Rehabilitation'
];

const ProfileSetup: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    bio: '',
    fitnessLevel: 'beginner' as const,
    weight: '',
    height: '',
    sex: '' as 'male' | 'female' | 'other' | 'prefer-not-to-say' | '',
    goals: [] as string[],
    birthdate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name: string, valueAsString: string, valueAsNumber: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: valueAsString
    }));
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: 'Login required',
        description: 'You must be logged in to complete your FitnessForgeAI profile setup.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      
      // DEBUG: Print current user and UID
      console.log("Current user:", currentUser);
      if (currentUser) {
        console.log("Current UID:", currentUser.uid);
      }
      
      // Prepare profile data with proper typing
      const profileData: Partial<FitnessForgeUserProfile> = {
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        bio: formData.bio || undefined,
        fitnessLevel: formData.fitnessLevel,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        sex: formData.sex || undefined,
        goals: formData.goals,
        interests: interests.length > 0 ? interests : undefined,
        birthdate: formData.birthdate ? new Date(formData.birthdate) : undefined,
        completedSetup: true
      };

      // Remove undefined values
      const cleanProfileData = Object.fromEntries(
        Object.entries(profileData).filter(([_, v]) => v !== undefined)
      ) as Partial<FitnessForgeUserProfile>;

      await saveUserProfile(currentUser.uid, cleanProfileData);
      
      toast({
        title: 'Profile setup complete! 🎉',
        description: 'Welcome aboard! Your journey with FitnessForgeAI is off to a strong start.',
        status: 'success',
        duration: 3500,
        isClosable: true,
        position: 'top',
      });
      
      navigate('/');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Could not save profile',
        description: 'Something went wrong while saving your profile. Please try again or check your connection.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">Complete Your Profile</Heading>
      <Text mb={8} textAlign="center" color="gray.600">
        Help us personalize your experience by providing some information about yourself.
      </Text>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl id="displayName" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </FormControl>
          
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </FormControl>
          
          <FormControl id="sex" isRequired>
            <FormLabel>Sex</FormLabel>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              placeholder="Select sex"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </Select>
          </FormControl>
          
          <HStack width="100%" spacing={4}>
            <FormControl id="height">
              <FormLabel>Height (cm)</FormLabel>
              <NumberInput
                min={100}
                max={250}
                value={formData.height}
                onChange={(valueAsString, valueAsNumber) => 
                  handleNumberChange('height', valueAsString, valueAsNumber)
                }
              >
                <NumberInputField placeholder="e.g., 175" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl id="weight">
              <FormLabel>Weight (kg)</FormLabel>
              <NumberInput
                min={30}
                max={300}
                value={formData.weight}
                onChange={(valueAsString, valueAsNumber) => 
                  handleNumberChange('weight', valueAsString, valueAsNumber)
                }
              >
                <NumberInputField placeholder="e.g., 70" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </HStack>
          
          <FormControl id="birthdate">
            <FormLabel>Birthdate</FormLabel>
            <Input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl id="fitnessLevel" isRequired>
            <FormLabel>Fitness Level</FormLabel>
            <Select
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
            >
              {fitnessLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </FormControl>
          
          <FormControl id="goals">
            <FormLabel>Fitness Goals</FormLabel>
            <Select
              name="goals"
              value=""
              onChange={(e) => {
                const selectedGoal = e.target.value;
                if (selectedGoal && !formData.goals.includes(selectedGoal)) {
                  setFormData(prev => ({
                    ...prev,
                    goals: [...prev.goals, selectedGoal]
                  }));
                }
              }}
              placeholder="Select fitness goals"
            >
              {fitnessGoals
                .filter(goal => !formData.goals.includes(goal))
                .map(goal => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
            </Select>
            <Flex mt={2} flexWrap="wrap" gap={2}>
              {formData.goals.map(goal => (
                <Tag
                  key={goal}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="green"
                >
                  <TagLabel>{goal}</TagLabel>
                  <TagCloseButton 
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        goals: prev.goals.filter(g => g !== goal)
                      }));
                    }} 
                  />
                </Tag>
              ))}
            </Flex>
          </FormControl>
          
          <FormControl id="interests">
            <FormLabel>Interests (e.g., Running, Yoga, Weightlifting)</FormLabel>
            <HStack>
              <Input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                placeholder="Add an interest and press Enter"
              />
              <Button onClick={addInterest} type="button">Add</Button>
            </HStack>
            <Flex mt={2} flexWrap="wrap" gap={2}>
              {interests.map((interest, index) => (
                <Tag
                  key={index}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{interest}</TagLabel>
                  <TagCloseButton onClick={() => removeInterest(interest)} />
                </Tag>
              ))}
            </Flex>
          </FormControl>
          
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself and your fitness journey..."
              rows={4}
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="green"
            size="lg"
            width="100%"
            isLoading={loading}
            loadingText="Saving..."
          >
            Complete Setup
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProfileSetup;
