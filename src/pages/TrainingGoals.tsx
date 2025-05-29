import React from 'react';
import { Image, Tooltip } from '@chakra-ui/react';
import { Box, Button } from '@chakra-ui/react';
import TrainingGoals from '../components/TrainingGoals';

const TrainingGoalsPage: React.FC = () => {
  return (
    <Box minH="100vh" p={{ base: 4, md: 12 }}>
      <Image src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=600&q=80" alt="Achieve your fitness goals" borderRadius="xl" width="100%" maxH="240px" objectFit="cover" mb={8} />
      <TrainingGoals />
      {/* Example: Add tooltip to a main action button if present */}
      {/*
      <Tooltip label="Set a new goal and track your progress!" aria-label="Set goal info" placement="top">
        <Button colorScheme="blue">Set New Goal</Button>
      </Tooltip>
      */}
    </Box>
  );
};

export default TrainingGoalsPage;
