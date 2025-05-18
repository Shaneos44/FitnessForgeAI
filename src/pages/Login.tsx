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
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      
      if ('code' in result) {
        // Handle error
        let errorMessage = 'Failed to log in';
        
        if (result.code === 'auth/user-not-found' || result.code === 'auth/wrong-password') {
          errorMessage = 'Invalid email or password';
        } else if (result.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed login attempts. Please try again later';
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Success
        toast({
          title: 'Success',
          description: 'You have successfully logged in',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg={bgColor} rounded="lg" boxShadow="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={4} align="flex-start" w="full">
          <Heading>Log In</Heading>
          <Text>Welcome back to FitnessForge!</Text>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="flex-start" w="full">
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
              
              <Link as={RouterLink} to="/forgot-password" color="blue.500" alignSelf="flex-end">
                Forgot Password?
              </Link>
              
              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={loading}
                loadingText="Logging in"
              >
                Log In
              </Button>
            </VStack>
          </form>
          
          <Text alignSelf="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              Sign Up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
