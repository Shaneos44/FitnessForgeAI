import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Divider,
  Icon,
  HStack,
  Tooltip,
  Image
} from '@chakra-ui/react';
import { FaCheckCircle, FaLock, FaChevronLeft } from 'react-icons/fa';

const perks = [
  'Unlimited workout tracking',
  'Personalized AI plans',
  'Connect your smartwatch',
  'Progress analytics',
  'Priority support',
  'Cancel anytime'
];

const Subscription: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.900');
  const accent = useColorModeValue('blue.700', 'blue.300');
  const navigate = (window as any).navigate || ((path: string) => window.location.assign(path));

  // Try using React Router's useNavigate if available
  let routerNavigate: ((path: string) => void) | null = null;
  try {
    // Dynamically require useNavigate if present
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    routerNavigate = require('react-router-dom').useNavigate?.();
  } catch {}
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (routerNavigate) {
      routerNavigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <Box minH="100vh" p={{ base: 4, md: 12 }} bgGradient="linear(to-br, blue.900, gray.900, white)">
      <Button
        leftIcon={<FaChevronLeft />}
        variant="ghost"
        colorScheme="blue"
        mb={6}
        size="md"
        fontWeight="bold"
        fontSize="lg"
        onClick={goBack}
        aria-label="Return to previous page"
        _hover={{ bg: 'blue.50' }}
      >
        Return
      </Button>
      <Box maxW="lg" mx="auto" bg={bg} p={10} borderRadius="2xl" boxShadow="2xl" textAlign="center">
        {/* Motivational quote */}
        <Text fontSize="md" color="gray.600" textAlign="center" fontStyle="italic" mb={3}>
          "Invest in yourself. Your fitness journey is worth it!"
        </Text>
        <Box textAlign="center" mb={7}>
          <img src="https://undraw.co/api/illustrations/undraw_subscriptions_re_k7jj.svg" alt="No subscription yet" style={{ width: 160, margin: '0 auto 20px' }} />
          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: 'lg', md: 'xl' }}>You're not subscribed yet</Text>
          <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>Unlock premium features and take your fitness journey to the next level!</Text>
        </Box>
        <Image src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=600&q=80" alt="Premium fitness subscription" borderRadius="xl" mb={6} width="100%" height="180px" objectFit="cover" />
        <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="extrabold" mb={4} bgGradient="linear(to-r, blue.400, gray.100, white)" bgClip="text">
          Unlock Pro Features
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          Upgrade to a Pro or Elite subscription for the ultimate fitness experience.
        </Text>
        <Divider mb={6} />
        <VStack spacing={4} align="stretch" mb={8}>
          {perks.map((perk, i) => (
            <HStack key={i} spacing={3}>
              <Icon as={FaCheckCircle} color={accent} />
              <Text color="gray.700">{perk}</Text>
            </HStack>
          ))}
        </VStack>
        <Tooltip label="Get unlimited tracking, analytics, and priority support!" aria-label="Pro plan info" placement="top">
          <Button colorScheme="blue" size="lg" fontWeight="bold" mb={3} w="full" aria-label="Upgrade to Pro" rightIcon={<FaLock />} boxShadow="md" _hover={{ bg: 'blue.600' }}>
            <Box as="span" fontWeight="extrabold" letterSpacing="tight">Go Pro</Box> – $9.99/mo
          </Button>
        </Tooltip>
        <Tooltip label="Unlock 1-on-1 coaching and exclusive content!" aria-label="Elite plan info" placement="top">
          <Button colorScheme="yellow" size="lg" fontWeight="bold" w="full" aria-label="Upgrade to Elite" rightIcon={<FaLock />} boxShadow="md" _hover={{ bg: 'yellow.400' }}>
            <Box as="span" fontWeight="extrabold" letterSpacing="tight">Go Elite</Box> – $19.99/mo
          </Button>
        </Tooltip>
        <Box mt={4} mb={2} display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Icon as={FaLock} color={accent} mr={1} />
          <Text fontSize="sm" color="gray.500">Secure payment powered by Stripe</Text>
        </Box>
        <Text fontSize="sm" color="gray.400" mt={1}>Cancel anytime. 30-day money-back guarantee.</Text>
        <Text fontSize="xs" color="gray.300" mt={2}>All images and content are for demonstration purposes and use royalty-free assets.</Text>
      </Box>
    </Box>
  );
};

export default Subscription;
