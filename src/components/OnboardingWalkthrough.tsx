import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';

const steps = [
  {
    title: 'Welcome to FitnessForgeAI!',
    description: 'Get ready to unlock your full potential with personalized, AI-powered training plans and expert support.',
    illustration: 'https://undraw.co/api/illustrations/undraw_personal_trainer_re_cnua.svg'
  },
  {
    title: 'Set Your Goals',
    description: 'Define your fitness goals and experience level to get the most tailored plans.',
    illustration: 'https://undraw.co/api/illustrations/undraw_goals_re_lu76.svg'
  },
  {
    title: 'Track & Improve',
    description: 'Log your workouts, monitor progress, and stay motivated with analytics and reminders.',
    illustration: 'https://undraw.co/api/illustrations/undraw_progress_tracking_re_ulfg.svg'
  },
  {
    title: 'Connect Devices',
    description: 'Sync with your smartwatch and other fitness apps for seamless tracking (coming soon).',
    illustration: 'https://undraw.co/api/illustrations/undraw_devices_re_dxae.svg'
  },
  {
    title: 'Join the Community',
    description: 'Share your journey, join challenges, and get support from trainers and peers.',
    illustration: 'https://undraw.co/api/illustrations/undraw_team_spirit_re_yl1v.svg'
  }
];

const OnboardingWalkthrough: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" textAlign="center">
      <Progress value={((step + 1) / steps.length) * 100} mb={6} colorScheme="blue" borderRadius="md" />
      <VStack spacing={6}>
        {/* Step Illustration */}
        <img src={steps[step].illustration} alt={steps[step].title + ' illustration'} style={{ width: 120, margin: '0 auto' }} />
        <Heading fontSize="2xl" fontWeight="extrabold" bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
          {steps[step].title}
        </Heading>
        <Text color="gray.600">{steps[step].description}</Text>
        <Button colorScheme="blue" size="lg" fontWeight="bold" onClick={handleNext} aria-label={step < steps.length - 1 ? 'Next onboarding step' : 'Finish onboarding'}>
          {step < steps.length - 1 ? 'Next' : 'Finish'}
        </Button>
        {/* Skip Button */}
        <Button variant="ghost" colorScheme="gray" onClick={onFinish} aria-label="Skip onboarding" tabIndex={0}>
          Skip
        </Button>
      </VStack>
    </Box>
  );
};

export default OnboardingWalkthrough;
