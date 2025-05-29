import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import OnboardingWalkthrough from '../components/OnboardingWalkthrough';

const Onboarding: React.FC = () => {
  const [finished, setFinished] = useState(false);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bgGradient="linear(to-br, blue.900, gray.900, white)">
      {!finished ? (
        <OnboardingWalkthrough onFinish={() => setFinished(true)} />
      ) : (
        <Box textAlign="center">
          <Button colorScheme="blue" size="lg" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Onboarding;
