import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="lg" py={12}>
      <Box p={8} bg={bgColor} rounded="lg" boxShadow="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={6} align="center">
          <Heading size="2xl">404</Heading>
          <Heading size="md">Page Not Found</Heading>
          <Text textAlign="center">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="green"
            size="lg"
          >
            Return to Dashboard
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default NotFound;
