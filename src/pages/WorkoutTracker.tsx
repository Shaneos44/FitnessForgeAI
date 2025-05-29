import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  SimpleGrid,
  useToast,
  Divider,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { FiCalendar, FiCheckCircle, FiTrash } from 'react-icons/fi';

const mockHistory = [
  { date: '2025-05-20', name: 'Full Body Strength', status: 'completed' },
  { date: '2025-05-21', name: 'Cardio & Core', status: 'missed' },
  { date: '2025-05-22', name: 'Mobility', status: 'completed' },
];

const WorkoutTracker: React.FC = () => {
  const [history, setHistory] = useState(mockHistory);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleComplete = (idx: number) => {
    setHistory(h => h.map((w, i) => i === idx ? { ...w, status: 'completed' } : w));
    toast({
      title: 'Workout complete! 🎉',
      description: 'Great job finishing your workout. Keep up the momentum and build your streak!',
      status: 'success',
      duration: 2500,
      isClosable: true,
      position: 'top',
    });
  };

  const handleDelete = (idx: number) => {
    setHistory(h => h.filter((_, i) => i !== idx));
    toast({
      title: 'Workout deleted',
      description: 'Your workout was removed. Remember, consistency is key to progress!',
      status: 'info',
      duration: 1800,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box minH="100vh" p={{ base: 4, md: 12 }} bgGradient="linear(to-br, blue.900, gray.900, white)">
      <Box maxW="2xl" mx="auto" bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" textAlign="center">
        <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="extrabold" mb={4} bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
          Workout Tracker
        </Heading>
        <Text color="gray.500" mb={6}>
          View your workout history and track your progress!
        </Text>
        <Divider mb={6} />
        <VStack spacing={4} align="stretch">
          {history.length === 0 && <Text color="gray.400">No workouts tracked yet.</Text>}
          {history.map((item, idx) => (
            <Flex key={item.date + idx} align="center" justify="space-between" bg={item.status === 'completed' ? 'green.50' : 'gray.50'} p={4} borderRadius="lg" boxShadow="sm">
              <HStack>
                <FiCalendar size={20} color="blue" />
                <Text fontWeight="bold">{item.date}</Text>
                <Text>{item.name}</Text>
              </HStack>
              <HStack>
                {item.status !== 'completed' && (
                  <Tooltip label="Mark workout as complete" aria-label="Mark as complete">
                    <IconButton aria-label="Mark as complete" icon={<FiCheckCircle />} colorScheme="green" variant="ghost" size="sm" onClick={() => handleComplete(idx)} />
                  </Tooltip>
                )}
                <Tooltip label="Delete this workout from history" aria-label="Delete workout">
                  <IconButton aria-label="Delete workout" icon={<FiTrash />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleDelete(idx)} />
                </Tooltip>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default WorkoutTracker;
