import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Spinner,
  Textarea,
  Tag,
  SimpleGrid,
  useDisclosure,
  Heading,
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react';
import { FiEdit2, FiSave } from 'react-icons/fi';
import { getUserProfile, saveUserProfile } from '../services/userService';
import { FitnessForgeUserProfile } from '../types/FitnessForgeUserProfile';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormData {
  displayName: string;
  email: string;
  bio: string;
  fitnessLevel: FitnessForgeUserProfile['fitnessLevel'];
  goals: string[];
  height: string;
  weight: string;
  birthdate: string;
  sex: FitnessForgeUserProfile['sex'];
}

const Profile: React.FC = () => {
  const { currentUser, refreshUserProfile } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [profile, setProfile] = useState<ProfileFormData>({
    displayName: '',
    email: '',
    bio: '',
    fitnessLevel: 'beginner',
    goals: [],
    height: '',
    weight: '',
    birthdate: '',
    sex: undefined
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGoal, setSelectedGoal] = useState('');
  
  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'elite', label: 'Elite' }
  ] as const;
  
  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Strength',
    'Endurance',
    'General Fitness',
    'Sport Specific',
    'Rehabilitation'
  ] as const;
  
  const availableGoals = fitnessGoals.filter(goal => !profile.goals.includes(goal));

  const fetchProfile = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserProfile(currentUser.uid);
      
      if (userProfile) {
        setProfile({
          displayName: userProfile.displayName || currentUser.displayName || '',
          email: userProfile.email || currentUser.email || '',
          bio: userProfile.bio || '',
          fitnessLevel: userProfile.fitnessLevel || 'beginner',
          goals: userProfile.goals || [],
          height: userProfile.height ? String(userProfile.height) : '',
          weight: userProfile.weight ? String(userProfile.weight) : '',
          birthdate: userProfile.birthdate ? 
            new Date(
              userProfile.birthdate instanceof Date 
                ? userProfile.birthdate.getTime() 
                : (userProfile.birthdate.seconds * 1000)
            ).toISOString().split('T')[0] 
            : '',
          sex: userProfile.sex
        });
        
        if (userProfile.interests) {
          setInterests(userProfile.interests);
        }
      } else {
        // Initialize with Firebase auth data if no profile exists
        setProfile(prev => ({
          ...prev,
          displayName: currentUser.displayName || '',
          email: currentUser.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Could not load profile',
        description: 'We couldn\'t load your profile data. Please refresh or try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setSaving(true);
      
      const profileData: Partial<FitnessForgeUserProfile> = {
        displayName: profile.displayName,
        email: profile.email,
        bio: profile.bio || undefined,
        fitnessLevel: profile.fitnessLevel,
        goals: profile.goals,
        height: profile.height ? parseFloat(profile.height) : undefined,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        birthdate: profile.birthdate ? new Date(profile.birthdate) : undefined,
        sex: profile.sex,
        interests: interests.length > 0 ? interests : undefined,
        completedSetup: true
      };
      
      await saveUserProfile(currentUser.uid, profileData);
      await refreshUserProfile();
      
      toast({
        title: 'Profile saved! 🎉',
        description: 'Way to go! Your fitness profile is updated and you are one step closer to your goals.',
        status: 'success',
        duration: 3500,
        isClosable: true,
        position: 'top',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Profile update failed',
        description: 'Something went wrong while saving your changes. Please try again or check your connection.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests(prev => [...prev, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(interest => interest !== interestToRemove));
  };

  const addGoal = (goal: string) => {
    if (goal && !profile.goals.includes(goal)) {
      setProfile(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));
      setSelectedGoal('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal !== goalToRemove)
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchProfile(); // Reset form with current data
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={4}>
      {/* Motivational Banner */}
      <Box bgGradient="linear(to-r, blue.400, purple.400)" p={4} borderRadius="xl" mb={6} boxShadow="md" textAlign="center">
        <Heading size="md" color="white" mb={1}>Your Fitness Journey Starts Here</Heading>
        <Text color="whiteAlpha.900">Keep your profile up to date and let your progress inspire you!</Text>
      </Box>
      <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={8} gap={6}>
        <Box boxSize={28} borderRadius="full" overflow="hidden" bgGradient="linear(to-br, blue.200, purple.200)" display="flex" alignItems="center" justifyContent="center" aria-label="User avatar">
          <Text fontSize="5xl" fontWeight="bold" color="white">
            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : '?'}
          </Text>
        </Box>
        <Box flex="1">
          <Heading as="h1" size="xl" mb={1}>{profile.displayName || 'No name set'}</Heading>
          <Text color="gray.500" mb={1}>{profile.email || 'No email set'}</Text>
          <HStack spacing={4} mt={2}>
            <Text color="gray.500">{profile.sex ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) : 'Sex not set'}</Text>
            <Text color="gray.500">{profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : 'Birthdate not set'}</Text>
          </HStack>
        </Box>
        {!isEditing && (
          <Button
            leftIcon={<FiEdit2 />}
            colorScheme="blue"
            variant="ghost"
            size="md"
            onClick={handleEditClick}
            aria-label="Edit profile"
            _hover={{ bg: 'blue.50', color: 'blue.700' }}
            _focus={{ boxShadow: 'outline' }}
          >
            Edit Profile
          </Button>
        )}
      </Flex>

      <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 4, md: 8 }}>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={8} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* User Details Section */}
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Sex</FormLabel>
                  <Select
                    name="sex"
                    value={profile.sex || ''}
                    onChange={handleChange}
                    placeholder="Select sex"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Fitness Level</FormLabel>
                  <Select
                    name="fitnessLevel"
                    value={profile.fitnessLevel}
                    onChange={handleChange}
                    required
                  >
                    {fitnessLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Height (cm)</FormLabel>
                  <Input
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleChange}
                    placeholder="Enter your height"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Weight (kg)</FormLabel>
                  <Input
                    type="number"
                    name="weight"
                    value={profile.weight}
                    onChange={handleChange}
                    placeholder="Enter your weight"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Birthdate</FormLabel>
                  <Input
                    type="date"
                    name="birthdate"
                    value={profile.birthdate}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Interests</FormLabel>
                <HStack spacing={2} mb={2}>
                  <Input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Add an interest"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  />
                  <Button onClick={addInterest}>Add</Button>
                </HStack>
                <HStack spacing={2} flexWrap="wrap">
                  {interests.map((interest) => (
                    <Tag key={interest} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton onClick={() => removeInterest(interest)} />
                    </Tag>
                  ))}
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Fitness Goals</FormLabel>
                <HStack spacing={2} mb={2}>
                  <Select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    placeholder="Select a goal"
                  >
                    {availableGoals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </Select>
                  <Button 
                    onClick={() => selectedGoal && addGoal(selectedGoal)}
                    isDisabled={!selectedGoal}
                  >
                    Add Goal
                  </Button>
                </HStack>
                <HStack spacing={2} flexWrap="wrap">
                  {profile.goals.map((goal) => (
                    <Tag key={goal} size="md" borderRadius="full" variant="subtle" colorScheme="green">
                      <TagLabel>{goal}</TagLabel>
                      <TagCloseButton onClick={() => removeGoal(goal)} />
                    </Tag>
                  ))}
                </HStack>
              </FormControl>

              <HStack spacing={4} justify="flex-end" mt={6}>
                <Button onClick={handleCancelEdit} variant="outline">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  leftIcon={<FiSave />}
                  isLoading={saving}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </form>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <VStack align="start" spacing={6}>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Bio</Text>
                <Box p={4} bgGradient="linear(to-br, gray.50, white)" borderRadius="md" minH="100px" borderWidth="1px" borderColor="gray.200">
                  <Text>{profile.bio || 'No bio provided'}</Text>
                </Box>
              </Box>
              <Box w="full">
                <Text fontSize="sm" color="gray.500" mb={2}>Interests</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {interests.length > 0 ? (
                    interests.map((interest) => (
                      <Tag key={interest} size="md" borderRadius="full" variant="solid" colorScheme="blue" _hover={{ transform: 'scale(1.05)', boxShadow: 'sm' }} tabIndex={0} aria-label={interest}>
                        {interest}
                      </Tag>
                    ))
                  ) : (
                    <Box textAlign="center" w="full" py={4}>
                      <img src="https://undraw.co/api/illustrations/undraw_fitness_tracker_3033.svg" alt="No interests yet" style={{ width: 100, margin: '0 auto 10px' }} />
                      <Text color="gray.500">No interests added yet</Text>
                      <Text fontSize="xs" color="gray.400">Add interests to personalize your experience!</Text>
                    </Box>
                  )}
                </HStack>
              </Box>
              <Box w="full">
                <Text fontSize="sm" color="gray.500" mb={2}>Fitness Goals</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {profile.goals.length > 0 ? (
                    profile.goals.map((goal) => (
                      <Tag key={goal} size="md" borderRadius="full" variant="subtle" colorScheme="green" _hover={{ transform: 'scale(1.05)', boxShadow: 'sm' }} tabIndex={0} aria-label={goal}>
                        {goal}
                      </Tag>
                    ))
                  ) : (
                    <Box textAlign="center" w="full" py={4}>
                      <img src="https://undraw.co/api/illustrations/undraw_goal_0v5v.svg" alt="No goals yet" style={{ width: 100, margin: '0 auto 10px' }} />
                      <Text color="gray.500">No goals set yet</Text>
                      <Text fontSize="xs" color="gray.400">Set a fitness goal to stay motivated and track your progress!</Text>
                    </Box>
                  )}
                </HStack>
              </Box>
            </VStack>
            <VStack align="start" spacing={6} divider={<Box w="100%" h="1px" bg="gray.100" />}> 
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Fitness Level</Text>
                <Text fontSize="lg">{fitnessLevels.find(l => l.value === profile.fitnessLevel)?.label || 'Not set'}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Height & Weight</Text>
                <Text fontSize="lg">{profile.height && profile.weight ? `${profile.height} cm • ${profile.weight} kg` : 'Not set'}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Birthdate</Text>
                <Text fontSize="lg">{profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : 'Not set'}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Sex</Text>
                <Text fontSize="lg">{profile.sex ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) : 'Not set'}</Text>
              </Box>
            </VStack>
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
