import React from 'react';
import { Box } from '@chakra-ui/react';
import WorkoutTracker from '../components/WorkoutTracker';

const WorkoutTracking: React.FC = () => {
  return (
    <Box p={4}>
      <WorkoutTracker />
    </Box>
  );
};

export default WorkoutTracking;
