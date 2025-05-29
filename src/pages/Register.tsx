import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { saveUserProfile } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Redirect if already logged in
  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Your passwords do not match. Please re-enter them to continue your fitness journey!',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(email, password, displayName);
      
      if ('code' in result) {
        // Handle error
        let errorMessage = 'Failed to create account';
      
        if (result.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Try logging in or use a different email.';
        } else if (result.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address to join FitnessForgeAI.';
        } else if (result.code === 'auth/weak-password') {
          errorMessage = 'Password should be at least 6 characters for your account security.';
        }
      
        toast({
          title: 'Registration error',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        // Success - create minimal user profile and redirect to profile setup
        await saveUserProfile(result.uid, {
          uid: result.uid,
          displayName: displayName,
          email: email,
          completedSetup: false // Mark that profile setup is not yet complete
        });
        
        toast({
          title: 'Welcome to FitnessForgeAI! 🎉',
          description: 'Your account is ready. Complete your profile to unlock personalized plans and community features!',
          status: 'success',
          duration: 3500,
          isClosable: true,
          position: 'top',
        });
        
        // Redirect to profile setup
        navigate('/profile-setup', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong during registration. Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }

    setLoading(false);
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg={bgColor} rounded="lg" boxShadow="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={4} align="flex-start" w="full">
          <Heading>Sign Up</Heading>
          <Text>Create your FitnessForge account</Text>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="flex-start" w="full">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={loading}
                loadingText="Creating Account"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          
          <Text alignSelf="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
