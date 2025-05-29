import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Tooltip
} from '@chakra-ui/react';
import { FaRegClock, FaSyncAlt } from 'react-icons/fa';

const SmartwatchConnection: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleConnect = () => {
    setConnecting(true);
    setStatus('idle');
    setTimeout(() => {
      // Simulate success/failure
      if (Math.random() > 0.2) {
        setStatus('success');
      } else {
        setStatus('error');
      }
      setConnecting(false);
    }, 1800);
  };

  return (
    <Box minH="100vh" p={{ base: 4, md: 12 }} bgGradient="linear(to-br, blue.900, gray.900, white)">
      <Box maxW="lg" mx="auto" bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" textAlign="center">
        <VStack spacing={6}>
          <Image src="https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&w=600&q=80" alt="Smartwatch fitness tracking" borderRadius="xl" width="100%" height="150px" objectFit="cover" />
          <Icon as={FaRegClock} w={16} h={16} color="blue.400" />
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="extrabold" bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
            Connect Your Smartwatch
          </Heading>
          <Text color="gray.500">
            Sync your workouts and activity automatically from your favorite wearable device. (Coming soon: Apple Watch, Garmin, Fitbit, and more!)
          </Text>
          <Tooltip label="Sync your workouts and activity from your wearable device!" aria-label="Smartwatch sync info" placement="top">
            <Button
              colorScheme="blue"
              size="lg"
              fontWeight="bold"
              leftIcon={<FaSyncAlt />}
              onClick={handleConnect}
              isLoading={connecting}
              loadingText="Connecting..."
              w="full"
              aria-label="Connect Smartwatch"
            >
              Connect Device
            </Button>
          </Tooltip>
          {status === 'success' && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />Device connected! Data will sync automatically.
            </Alert>
          )}
          {status === 'error' && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />Could not connect. Please try again.
            </Alert>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default SmartwatchConnection;
