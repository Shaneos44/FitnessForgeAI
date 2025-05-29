import React from 'react';
import { Box, Heading, Text, Button, Flex, Image, SimpleGrid, VStack, Stack, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HERO_VIDEO = 'https://player.vimeo.com/external/414857888.sd.mp4?s=2c5a1d6c9b1e9b7d3a1b7a7f4b6f7a7a7b7a7a7a&profile_id=164&oauth2_token_id=57447761'; // Royalty-free fitness video
const HERO_IMAGE = 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80'; // Royalty-free fitness hero image

const featureVideos = [
  { title: 'How FitnessForgeAI Works', url: 'https://www.youtube.com/embed/1ZQnJ6y8h1s', thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=600&q=80' },
  { title: 'Training Plan Demo', url: 'https://www.youtube.com/embed/2tM1LFFxeKg', thumbnail: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=600&q=80' },
  { title: 'Meet Our Trainers', url: 'https://www.youtube.com/embed/3jWRrafhO7M', thumbnail: 'https://images.pexels.com/photos/2780768/pexels-photo-2780768.jpeg?auto=compress&w=600&q=80' },
];



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
    color: 'yellow.400',
    cta: 'Go Elite',
    highlight: false
  }
];


const testimonials = [
  {
    text: '"FitnessForgeAI helped me lose 20 pounds and finally stick to a routine! The AI plans are so motivating and easy to follow."',
    name: 'Samantha R.',
    year: '2024',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    color: 'blue.700',
  },
  {
    text: '"The community and trainers are amazing. I feel supported every step of the way!"',
    name: 'Carlos M.',
    year: '2023',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    color: 'purple.700',
  },
  {
    text: '"I love the progress tracking and the challenges. It keeps me coming back every week!"',
    name: 'Emily T.',
    year: '2025',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: 'pink.700',
  },
];

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  // Auto-advance every 7s
  useEffect(() => {
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % total), 7000);
    return () => clearTimeout(timer);
  }, [current, total]);
  return (
    <Box px={{ base: 2, md: 24 }} py={12}>
      <Heading as="h2" size="xl" textAlign="center" mb={8}>Success Stories</Heading>
      <Flex align="center" justify="center" position="relative" maxW="2xl" mx="auto">
        <Box as="button" onClick={() => setCurrent((c) => (c - 1 + total) % total)} position="absolute" left={-10} top="50%" transform="translateY(-50%)" bg="whiteAlpha.800" borderRadius="full" p={2} boxShadow="md" _hover={{ bg: 'blue.100' }} zIndex={2} aria-label="Previous testimonial">
          <FaChevronLeft />
        </Box>
        <Box
          bg={"whiteAlpha.900"}
          borderRadius="2xl"
          boxShadow="2xl"
          p={{ base: 6, md: 10 }}
          textAlign="center"
          minW={{ base: '90vw', md: '500px' }}
          maxW="lg"
          mx="auto"
          transition="all 0.4s cubic-bezier(.4,0,.2,1)"
          key={current}
        >
          <Text fontSize={{ base: 'lg', md: '2xl' }} fontStyle="italic" mb={5} color={testimonials[current].color}>{testimonials[current].text}</Text>
          <Flex align="center" justify="center" mt={2} gap={4}>
            <Image src={testimonials[current].img} alt={testimonials[current].name + ' photo'} boxSize="64px" borderRadius="full" />
            <Box textAlign="left">
              <Text fontWeight="bold">{testimonials[current].name}</Text>
              <Text fontSize="sm" color="gray.500">Member since {testimonials[current].year}</Text>
            </Box>
          </Flex>
        </Box>
        <Box as="button" onClick={() => setCurrent((c) => (c + 1) % total)} position="absolute" right={-10} top="50%" transform="translateY(-50%)" bg="whiteAlpha.800" borderRadius="full" p={2} boxShadow="md" _hover={{ bg: 'blue.100' }} zIndex={2} aria-label="Next testimonial">
          <FaChevronRight />
        </Box>
      </Flex>
      {/* Dots */}
      <Flex justify="center" mt={6} gap={2}>
        {testimonials.map((_, idx) => (
          <Box
            key={idx}
            w={idx === current ? 4 : 2}
            h={idx === current ? 4 : 2}
            borderRadius="full"
            bg={idx === current ? 'blue.400' : 'gray.300'}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => setCurrent(idx)}
          />
        ))}
      </Flex>
    </Box>
  );
};

// Feature highlight card
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <Box minW={{ base: '240px', md: '260px' }} bg="whiteAlpha.900" borderRadius="xl" boxShadow="lg" p={6} mx={1} display="inline-block" textAlign="center" _hover={{ boxShadow: '2xl', transform: 'scale(1.04)' }} transition="all 0.18s cubic-bezier(.4,0,.2,1)">
    <Box fontSize="3xl" mb={2}>{icon}</Box>
    <Text fontWeight="bold" fontSize="xl" mb={1}>{title}</Text>
    <Text color="gray.600" fontSize="md">{desc}</Text>
  </Box>
);

// Animated stat counter component
const StatCounter = ({ icon, label, end }: { icon: string; label: string; end: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.ceil(end / 60);
    const step = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(start);
        setTimeout(step, duration / (end / increment));
      }
    };
    step();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);
  return (
    <Box textAlign="center" py={4} px={2} borderRadius="xl" bg="whiteAlpha.800" boxShadow="md">
      <Text fontSize="4xl" mb={1} role="img" aria-label={label}>{icon}</Text>
      <Text fontSize="3xl" fontWeight="bold" color="blue.500">{count.toLocaleString()}</Text>
      <Text fontSize="md" color="gray.600">{label}</Text>
    </Box>
  );
};

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bg} position="relative" overflow="hidden">
      {/* Hero Section - Modern App Style */}
      <Box
        position="relative"
        bgGradient="linear(to-br, blue.500 60%, purple.400 100%)"
        borderRadius="3xl"
        boxShadow="2xl"
        mt={-4}
        mb={10}
        px={{ base: 4, md: 16 }}
        py={{ base: 16, md: 24 }}
        overflow="visible"
        minH={{ base: '60vh', md: '70vh' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Decorative Blobs */}
        <Box position="absolute" top="-60px" left="-60px" w="180px" h="180px" zIndex={1} filter="blur(40px)" bgGradient="radial(ellipse at top left, teal.300 0%, blue.400 80%, transparent 100%)" opacity={0.6} />
        <Box position="absolute" bottom="-60px" right="-60px" w="200px" h="200px" zIndex={1} filter="blur(50px)" bgGradient="radial(ellipse at bottom right, purple.300 0%, pink.400 80%, transparent 100%)" opacity={0.5} />
        <Flex direction="column" align="center" justify="center" w="full" zIndex={2}>
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            textAlign="center"
            lineHeight="1.1"
            bgGradient="linear(to-r, blue.200, blue.400, purple.400, pink.400)"
            bgClip="text"
            letterSpacing="tight"
            mb={4}
            _after={{ content: '""', display: 'block', w: '60px', h: '4px', bg: 'purple.400', mx: 'auto', mt: 2, borderRadius: 'xl' }}
          >
            Transform Your Fitness Journey
          </Heading>
          <Text fontSize={{ base: 'lg', md: '2xl' }} color="whiteAlpha.900" mb={8} textAlign="center" maxW="2xl">
            AI-powered plans. Real results. Join a thriving community and forge your best self with FitnessForgeAI.
          </Text>
          <Button
            size="xl"
            px={10}
            py={7}
            fontSize={{ base: 'lg', md: '2xl' }}
            borderRadius="2xl"
            bgGradient="linear(to-r, purple.400, blue.400, pink.400)"
            color="white"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.18)"
            _hover={{ filter: 'brightness(1.08)', transform: 'scale(1.04)', bgGradient: 'linear(to-r, blue.400, purple.400, pink.400)' }}
            _active={{ filter: 'brightness(0.97)', transform: 'scale(0.98)' }}
            transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            onClick={() => navigate(currentUser ? '/dashboard' : '/register')}
            position={{ base: 'fixed', md: 'static' }}
            bottom={{ base: 8, md: 'auto' }}
            left={{ base: '50%', md: 'auto' }}
            transform={{ base: 'translateX(-50%)', md: 'none' }}
            zIndex={10}
          >
            Get Started Free
          </Button>
        </Flex>
      </Box>
      {/* Social Proof Animated Counters */}
      <Box px={{ base: 6, md: 24 }} py={8} mb={4} borderRadius="2xl" boxShadow="lg" bgGradient="linear(to-r, whiteAlpha.900, blue.50, purple.50)" display="flex" justifyContent="center" alignItems="center">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full" maxW="5xl">
          <StatCounter icon="🔥" label="Workouts Completed" end={12800} />
          <StatCounter icon="💪" label="Active Members" end={3200} />
          <StatCounter icon="🤖" label="AI Plans Generated" end={5400} />
        </SimpleGrid>
      </Box>

      {/* Feature Highlights - Horizontal Scroll */}
      <Box px={{ base: 2, md: 24 }} py={8} mb={4} overflowX="auto" whiteSpace="nowrap" bgGradient="linear(to-r, blue.50, purple.50, pink.50)" borderRadius="2xl">
        <Flex gap={6} minW="max-content">
          <FeatureCard icon={<span role="img" aria-label="ai">🤖</span>} title="AI-Powered Plans" desc="Get workouts tailored to you, instantly." />
          <FeatureCard icon={<span role="img" aria-label="community">🌍</span>} title="Vibrant Community" desc="Join challenges and support each other." />
          <FeatureCard icon={<span role="img" aria-label="analytics">📈</span>} title="Progress Tracking" desc="Visualize your improvements over time." />
          <FeatureCard icon={<span role="img" aria-label="coach">🏋️‍♂️</span>} title="Expert Coaches" desc="Access real trainers for tips and feedback." />
          <FeatureCard icon={<span role="img" aria-label="device">⌚</span>} title="Device Sync" desc="Connect your smartwatch and track automatically." />
        </Flex>
      </Box>

      {/* Rest of the page content (features, videos, team, etc.) */}
      {/* Pricing/Plans Section - Modern SaaS Style */}
      <Box px={{ base: 2, md: 24 }} py={16} mb={10} bgGradient="linear(to-r, blue.50, purple.50, pink.50)" borderRadius="3xl" boxShadow="2xl">
        <Heading as="h2" size="xl" textAlign="center" mb={10} fontWeight="extrabold" letterSpacing="tight">
          Choose Your Plan
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="6xl" mx="auto">
          {/* Plan: Starter */}
          <Box
            bg="whiteAlpha.900"
            p={8}
            borderRadius="2xl"
            boxShadow="lg"
            textAlign="center"
            position="relative"
            transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            _hover={{ boxShadow: '2xl', transform: 'scale(1.03)' }}
          >
            <Box fontSize="4xl" mb={2} aria-label="Starter plan" as="span" role="img">🟢</Box>
            <Heading fontSize="2xl" mb={1}>Starter</Heading>
            <Text fontSize="4xl" fontWeight="bold" mb={2} color="gray.500">Free</Text>
            <VStack spacing={3} align="stretch" mb={8}>
              <Text color="gray.600">Basic workout library</Text>
              <Text color="gray.600">Track up to 5 workouts</Text>
              <Text color="gray.600">Community access</Text>
              <Text color="gray.600">Limited support</Text>
            </VStack>
            <Button colorScheme="blue" size="lg" w="full" fontWeight="bold" aria-label="Get Started for Free" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Box>
          {/* Plan: Pro (Most Popular) */}
          <Box
            bg="whiteAlpha.900"
            p={10}
            borderRadius="2xl"
            boxShadow="2xl"
            textAlign="center"
            position="relative"
            zIndex={1}
            transform={{ base: 'none', md: 'scale(1.08)' }}
            transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            _hover={{ boxShadow: '3xl', transform: { md: 'scale(1.12)', base: 'scale(1.04)' } }}
          >
            <Box position="absolute" top={6} left={6}>
              <Box bg="blue.400" color="white" px={3} py={1} borderRadius="lg" fontWeight="bold" fontSize="sm" letterSpacing="wide" boxShadow="md">
                Most Popular
              </Box>
            </Box>
            <Box fontSize="4xl" mb={2} aria-label="Pro plan" as="span" role="img">💎</Box>
            <Heading fontSize="2xl" mb={1}>Pro</Heading>
            <Text fontSize="4xl" fontWeight="bold" mb={2} color="blue.500">$9.99/mo</Text>
            <VStack spacing={3} align="stretch" mb={8}>
              <Text color="gray.600">Unlimited workouts</Text>
              <Text color="gray.600">Personalized plans</Text>
              <Text color="gray.600">Progress analytics</Text>
              <Text color="gray.600">Priority support</Text>
              <Text color="gray.600">Connect smart watch</Text>
            </VStack>
            <Button colorScheme="purple" size="lg" w="full" fontWeight="bold" aria-label="Upgrade to Pro" onClick={() => navigate('/subscription')}>
              Upgrade
            </Button>
          </Box>
          {/* Plan: Elite (Best Value) */}
          <Box
            bg="whiteAlpha.900"
            p={8}
            borderRadius="2xl"
            boxShadow="lg"
            textAlign="center"
            position="relative"
            transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            _hover={{ boxShadow: '2xl', transform: 'scale(1.03)' }}
          >
            <Box position="absolute" top={6} right={6}>
              <Box bg="yellow.400" color="gray.900" px={3} py={1} borderRadius="lg" fontWeight="bold" fontSize="sm" letterSpacing="wide" boxShadow="md">
                Best Value
              </Box>
            </Box>
            <Box fontSize="4xl" mb={2} aria-label="Elite plan" as="span" role="img">🏆</Box>
            <Heading fontSize="2xl" mb={1}>Elite</Heading>
            <Text fontSize="4xl" fontWeight="bold" mb={2} color="yellow.500">$19.99/mo</Text>
            <VStack spacing={3} align="stretch" mb={8}>
              <Text color="gray.600">Everything in Pro</Text>
              <Text color="gray.600">1-on-1 coaching</Text>
              <Text color="gray.600">Custom nutrition</Text>
              <Text color="gray.600">Exclusive video content</Text>
              <Text color="gray.600">Early feature access</Text>
            </VStack>
            <Button colorScheme="yellow" size="lg" w="full" fontWeight="bold" aria-label="Go Elite" onClick={() => navigate('/subscription')}>
              Go Elite
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Why Choose Section */}
      <Box px={{ base: 6, md: 24 }} py={12}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>Why Choose FitnessForgeAI?</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="md" mb={2}>Tailored Plans</Heading>
            <Text>Our AI crafts a unique schedule for your goals, experience, and event date. No more generic routines!</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="md" mb={2}>Progress Analytics</Heading>
            <Text>Visualize your improvements and stay motivated with detailed stats and charts.</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="md" mb={2}>Expert Support</Heading>
            <Text>Get help from real trainers and join a supportive community to keep you on track.</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Marketing Pricing Section: Only show if not logged in */}
      {!currentUser && (
        <Box px={{ base: 6, md: 24 }} py={12}>
          <Heading as="h2" size="xl" textAlign="center" mb={8}>Flexible Pricing for Every Athlete</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} maxW="6xl" mx="auto">
            {plans.map((plan, i) => (
              <Box
                key={plan.name}
                bg={plan.highlight ? 'blue.50' : cardBg}
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
                <Heading fontSize="2xl" mb={2}>{plan.name}</Heading>
                <Text fontSize="4xl" fontWeight="bold" mb={4} color={plan.color}>{plan.price}</Text>
                <VStack spacing={3} align="stretch" mb={8}>
                  {plan.features.map((feature, idx) => (
                    <Text key={idx} color="gray.600">• {feature}</Text>
                  ))}
                </VStack>
                <Button colorScheme={plan.highlight ? 'blue' : 'gray'} size="lg" w="full" fontWeight="bold" aria-label={plan.cta + ' plan'} boxShadow={plan.highlight ? '0 0 0 3px #3182ce' : undefined}>
                  {plan.cta}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      <Box px={{ base: 6, md: 24 }} py={12}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>See It In Action</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {featureVideos.map((video, i) => (
            <Box key={i} bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
              <Image src={video.thumbnail} alt={video.title + ' thumbnail'} width="100%" height="140px" objectFit="cover" borderRadius="md" mb={2} />
              <Text fontWeight="bold" mb={2}>{video.title}</Text>
              <Box as="iframe" width="100%" height="215" src={video.url} title={video.title} allowFullScreen borderRadius="md" />
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box px={{ base: 6, md: 24 }} py={12}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>Meet the Team</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Image src="https://images.pexels.com/photos/1139193/pexels-photo-1139193.jpeg?auto=compress&w=600&q=80" alt="Alex Rivera - Head Coach" borderRadius="full" boxSize="120px" mb={4} mx="auto" />
            <Heading as="h4" size="md" textAlign="center">Alex Rivera</Heading>
            <Text textAlign="center">Head Coach & Co-founder</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Image src="https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=600&q=80" alt="Jordan Kim - AI Specialist" borderRadius="full" boxSize="120px" mb={4} mx="auto" />
            <Heading as="h4" size="md" textAlign="center">Jordan Kim</Heading>
            <Text textAlign="center">AI Specialist & Co-founder</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Image src="https://images.pexels.com/photos/3768915/pexels-photo-3768915.jpeg?auto=compress&w=600&q=80" alt="Taylor Lee - Community Lead" borderRadius="full" boxSize="120px" mb={4} mx="auto" />
            <Heading as="h4" size="md" textAlign="center">Taylor Lee</Heading>
            <Text textAlign="center">Community Lead</Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Box px={{ base: 6, md: 24 }} py={12}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>Training Video Library</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h4" size="md" mb={2}>Beginner Workouts</Heading>
            <Text>Follow along with our trainers and start your journey!</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h4" size="md" mb={2}>Mobility & Recovery</Heading>
            <Text>Learn how to prevent injury and optimize performance.</Text>
          </Box>
          <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h4" size="md" mb={2}>Advanced Training</Heading>
            <Text>Push your limits with our toughest routines and expert advice.</Text>
          </Box>
        </SimpleGrid>
      </Box>
    {/* Testimonial Section - Carousel */}
    <TestimonialCarousel />
    </Box>
  );
};

export default Home;
