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
          title: 'Reset link sent! 📧',
          description: 'Check your inbox for password reset instructions and get back on track!',
          status: 'success',
          duration: 3500,
          isClosable: true,
          position: 'top',
        });
      } else if (result && 'code' in result) {
        // Handle error
        let errorMessage = 'Failed to send password reset email';
        
        if (result.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        }
        
        toast({
          title: 'Reset failed',
          description: errorMessage,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected error',
        description: 'Something went wrong. Please try again or contact support if the issue persists.',
        status: 'error',
        duration: 4000,
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
