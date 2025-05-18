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
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result === true) {
        setEmailSent(true);
        toast({
          title: 'Email Sent',
          description: 'Check your inbox for password reset instructions',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Handle error
        let errorMessage = 'Failed to send password reset email';
        
        if (result.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
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
          <Heading>Reset Password</Heading>
          <Text>Enter your email to receive a password reset link</Text>
          
          {emailSent ? (
            <VStack spacing={4} align="flex-start" w="full">
              <Text>
                A password reset link has been sent to your email address. Please check your inbox and follow the instructions.
              </Text>
              <Link as={RouterLink} to="/login" color="blue.500" alignSelf="center">
                Return to Login
              </Link>
            </VStack>
          ) : (
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
                
                <Button
                  type="submit"
                  colorScheme="green"
                  width="full"
                  isLoading={loading}
                  loadingText="Sending"
                >
                  Send Reset Link
                </Button>
                
                <Link as={RouterLink} to="/login" color="blue.500" alignSelf="center">
                  Back to Login
                </Link>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
