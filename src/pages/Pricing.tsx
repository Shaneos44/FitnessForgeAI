import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaCrown, FaStar, FaUser } from 'react-icons/fa';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    features: [
      'Basic workout library',
      'Track up to 5 workouts',
      'Community access',
      'Limited support'
    ],
    icon: FaUser,
    color: 'gray.400',
    cta: 'Get Started',
    highlight: false
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: [
      'Unlimited workouts',
      'Personalized plans',
      'Progress analytics',
      'Priority support',
      'Connect smart watch'
    ],
    icon: FaStar,
    color: 'blue.500',
    cta: 'Upgrade',
    highlight: true
  },
  {
    name: 'Elite',
    price: '$19.99/mo',
    features: [
      'Everything in Pro',
      '1-on-1 coaching',
      'Custom nutrition',
      'Exclusive video content',
      'Early feature access'
    ],
    icon: FaCrown,
    color: 'yellow.400',
    cta: 'Go Elite',
    highlight: false
  }
];

const Pricing: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box p={{ base: 4, md: 12 }} minH="100vh" bgGradient="linear(to-br, blue.900, gray.900, white)" >
      <Heading textAlign="center" mb={10} fontWeight="extrabold" fontSize={{ base: '3xl', md: '5xl' }} bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
        Flexible Pricing for Every Athlete
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} maxW="6xl" mx="auto">
        {plans.map((plan, i) => (
          <Box
            key={plan.name}
            bg={plan.highlight ? highlightBg : cardBg}
            borderWidth={plan.highlight ? 3 : 1}
            borderColor={plan.highlight ? 'blue.400' : 'gray.200'}
            borderRadius="2xl"
            boxShadow={plan.highlight ? '2xl' : 'md'}
            p={8}
            textAlign="center"
            position="relative"
            zIndex={plan.highlight ? 1 : 0}
            transform={plan.highlight ? 'scale(1.05)' : 'none'}
            transition="all 0.2s"
          >
            <HStack justify="center" mb={4}>
              <Icon as={plan.icon} w={10} h={10} color={plan.color} />
            </HStack>
            <Heading fontSize="2xl" mb={2}>{plan.name}</Heading>
            <Text fontSize="4xl" fontWeight="bold" mb={4} color={plan.color}>{plan.price}</Text>
            <VStack spacing={3} align="stretch" mb={8}>
              {plan.features.map((feature, idx) => (
                <Text key={idx} color="gray.600">• {feature}</Text>
              ))}
            </VStack>
            <Button colorScheme={plan.highlight ? 'blue' : 'gray'} size="lg" w="full" fontWeight="bold">
              {plan.cta}
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Pricing;
