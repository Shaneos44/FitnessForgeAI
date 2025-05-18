import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Button, 
  useToast, 
  Flex, 
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Divider,
  Spinner
} from '@chakra-ui/react';
import { getUserProfile, saveUserProfile } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    fitnessLevel: 'beginner',
    goals: [],
    height: '',
    weight: '',
    birthdate: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userProfile = await getUserProfile(currentUser.uid);
        
        if (userProfile) {
          setProfile({
            displayName: userProfile.displayName || currentUser.displayName || '',
            email: userProfile.email || currentUser.email || '',
            fitnessLevel: userProfile.fitnessLevel || 'beginner',
            goals: userProfile.goals || [],
            height: userProfile.height ? String(userProfile.height) : '',
            weight: userProfile.weight ? String(userProfile.weight) : '',
            birthdate: userProfile.birthdate ? new Date(userProfile.birthdate.seconds * 1000).toISOString().split('T')[0] : ''
          });
        } else {
          // Initialize with Firebase auth data if no profile exists
          setProfile({
            ...profile,
            displayName: currentUser.displayName || '',
            email: currentUser.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setSaving(true);
      
      // Convert string values to appropriate types
      const profileData = {
        displayName: profile.displayName,
        email: profile.email,
        fitnessLevel: profile.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
        goals: profile.goals,
        height: profile.height ? Number(profile.height) : undefined,
        weight: profile.weight ? Number(profile.weight) : undefined,
        birthdate: profile.birthdate ? new Date(profile.birthdate) : undefined
      };
      
      await saveUserProfile(currentUser.uid, profileData);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
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
      <Heading size="lg" mb={6}>Your Profile</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box>
          <Center>
            <Avatar size="2xl" name={profile.displayName} mb={4}>
              <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
          </Center>
          
          <Text textAlign="center" fontSize="xl" fontWeight="bold" mb={1}>
            {profile.displayName}
          </Text>
          <Text textAlign="center" fontSize="md" color="gray.500" mb={4}>
            {profile.email}
          </Text>
          
          <Divider my={6} />
          
          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold">Fitness Level</Text>
              <Text>{profile.fitnessLevel.charAt(0).toUpperCase() + profile.fitnessLevel.slice(1)}</Text>
            </Box>
            
            {profile.height && (
              <Box>
                <Text fontWeight="bold">Height</Text>
                <Text>{profile.height} cm</Text>
              </Box>
            )}
            
            {profile.weight && (
              <Box>
                <Text fontWeight="bold">Weight</Text>
                <Text>{profile.weight} kg</Text>
              </Box>
            )}
          </Stack>
        </Box>
        
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="displayName">
              <FormLabel>Name</FormLabel>
              <Input 
                name="displayName" 
                value={profile.displayName} 
                onChange={handleChange} 
              />
            </FormControl>
            
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input 
                name="email" 
                value={profile.email} 
                onChange={handleChange} 
                isReadOnly
              />
            </FormControl>
            
            <FormControl id="fitnessLevel">
              <FormLabel>Fitness Level</FormLabel>
              <Select 
                name="fitnessLevel" 
                value={profile.fitnessLevel} 
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormControl>
            
            <FormControl id="height">
              <FormLabel>Height (cm)</FormLabel>
              <Input 
                name="height" 
                value={profile.height} 
                onChange={handleChange} 
                type="number"
              />
            </FormControl>
            
            <FormControl id="weight">
              <FormLabel>Weight (kg)</FormLabel>
              <Input 
                name="weight" 
                value={profile.weight} 
                onChange={handleChange} 
                type="number"
              />
            </FormControl>
            
            <FormControl id="birthdate">
              <FormLabel>Birth Date</FormLabel>
              <Input 
                name="birthdate" 
                value={profile.birthdate} 
                onChange={handleChange} 
                type="date"
              />
            </FormControl>
            
            <Button 
              mt={4} 
              colorScheme="blue" 
              type="submit" 
              isLoading={saving}
              loadingText="Saving"
            >
              Save Profile
            </Button>
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Profile;
