import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Flex, 
  useColorModeValue, 
  Divider, 
  Collapse,
  Tooltip,
  useDisclosure,
  IconButton,
  Button,
  Avatar,
  Image
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCalendar, 
  FiActivity, 
  FiUser, 
  FiAward, 
  FiBarChart2, 
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiClock,
  FiHeart,
  FiTarget,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiCreditCard,
} from 'react-icons/fi';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useBreakpointValue } from '@chakra-ui/react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const mainMenuItems = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'Calendar', path: '/calendar', icon: FiCalendar },
  { name: 'Activity', path: '/activity', icon: FiActivity },
  { name: 'Goals', path: '/goals', icon: FiTarget },
  { name: 'Progress', path: '/progress', icon: FiBarChart2 },
];

const socialMenuItems = [
  { name: 'Community', path: '/community', icon: FiUsers },
  { name: 'Awards', path: '/awards', icon: FiAward },
  { name: 'Challenges', path: '/challenges', icon: FiSliders },
];


interface MenuItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  to, 
  icon, 
  children, 
  isCollapsed = false, 
  isActive = false,
  onClick,
}) => {
  const bgHoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
const bgActiveColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
const textColor = useColorModeValue('gray.700', 'gray.200');
const activeTextColor = 'brand.500';

const content = (
    <HStack
      px={isCollapsed ? 3 : 4}
      py={3}
      spacing={isCollapsed ? 0 : 4}
      borderRadius="lg"
      bg={isActive ? 'brand.50' : 'transparent'}
      _hover={!isActive ? { bg: bgHoverColor } : {}}
      _active={{ bg: bgActiveColor }}
      position="relative"
      transition="all 0.2s"
      justifyContent={isCollapsed ? 'center' : 'flex-start'}
      overflow="hidden"
      _after={isActive ? {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '60%',
        bg: 'brand.500',
        borderRadius: 'full',
      } : {}}
    >
      <Icon 
        as={icon} 
        boxSize={5} 
        color={isActive ? activeTextColor : 'currentColor'}
        flexShrink={0}
      />
      {!isCollapsed && (
        <Text 
          fontWeight={isActive ? 'semibold' : 'normal'}
          color={isActive ? activeTextColor : textColor}
          fontSize="sm"
        >
          {children}
        </Text>
      )}
    </HStack>
  );

  if (onClick) {
    return (
      <Box onClick={onClick} cursor="pointer">
        {content}
      </Box>
    );
  }

  return (
    <RouterLink to={to} style={{ textDecoration: 'none' }}>
      {content}
    </RouterLink>
  );
};

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, isCollapsed, children }) => {
  const sectionTitleColor = useColorModeValue('gray.500', 'gray.400');
if (isCollapsed) return <>{children}</>;

return (
    <Box>
      <Text 
        fontSize="xs" 
        fontWeight="bold" 
        color={sectionTitleColor}
        px={4}
        py={2}
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {title}
      </Text>
      {children}
    </Box>
  );
};


interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  offsetTop?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, 'aria-controls': ariaControls, 'aria-expanded': ariaExpanded, offsetTop }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const topOffset = offsetTop || '0';
  const sidebarBg = useColorModeValue('rgba(255,255,255,0.75)', 'rgba(24,29,58,0.92)');
  const borderColor = useColorModeValue('rgba(44,62,80,0.10)', 'rgba(255,255,255,0.08)');
  const shadow = '0 8px 32px 0 rgba(31, 38, 135, 0.18)';
  const hoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const activeBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const userBoxBg = useColorModeValue('glass.100', 'glass.dark');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeTextColor = 'brand.500';
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handler for create new button
  const handleCreateNew = () => {
    navigate('/workouts');
  };

  // Menu items
  const mainMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Workouts', path: '/workouts', icon: FiActivity },
    { name: 'Plan Generator', path: '/workout-plan-generator', icon: FiSliders },
    { name: 'Tracker', path: '/workout-tracker', icon: FiCalendar },
    { name: 'Smartwatch', path: '/smartwatch-connection', icon: FiClock },
    { name: 'Goals', path: '/training-goals', icon: FiAward },
    { name: 'Subscription', path: '/subscription', icon: FiCreditCard },
  ];
  const socialMenuItems = [
    { name: 'Community', path: '/social', icon: FiUsers },
    { name: 'Progress', path: '/workout-history', icon: FiBarChart2 },
  ];

  // All logic above return
  return (
    <MotionBox
      as="aside"
      h="100vh"
      bg={sidebarBg}
      bgGradient="linear(to-br, whiteAlpha.900 70%, blue.50 100%)"
      bgBlendMode="multiply"
      opacity={0.98}
      borderRight={`1.5px solid ${borderColor}`}
      backdropFilter="blur(18px)"
      aria-label="Sidebar navigation"
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      position={isMobile ? 'fixed' : 'relative'}
      left={isMobile ? (isOpen ? 0 : '-70vw') : 0}
      top={isMobile ? topOffset : undefined}
      zIndex={isMobile ? 30 : 10}
      boxShadow={isMobile && isOpen ? '2xl' : 'md'}
      transition="left 0.3s cubic-bezier(.4,0,.2,1), width 0.25s cubic-bezier(.4,0,.2,1)"
    >
      <VStack h="full" spacing={6} align="stretch" pt={4}>
        {/* Collapse button */}
        <Flex justify="flex-end" mb={2} px={isOpen ? 2 : 0}>
          <Tooltip label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'} placement="right">
            <IconButton
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              icon={isOpen ? <FiChevronLeft /> : <FiChevronRight />}
              size="sm"
              variant="ghost"
              borderRadius="full"
              onClick={onToggle}
              _hover={{ bg: hoverBg }}
            />
          </Tooltip>
        </Flex>
        {/* Main menu */}
        <SidebarSection title="Main Menu" isCollapsed={!isOpen}>
          <VStack spacing={1} align="stretch">
            {mainMenuItems.map((item) => (
              <MenuItem
                key={item.name}
                to={item.path}
                icon={item.icon}
                isCollapsed={!isOpen}
                isActive={location.pathname === item.path}
              >
                {item.name}
              </MenuItem>
            ))}
          </VStack>
        </SidebarSection>
        {/* Social menu */}
        <SidebarSection title="Community" isCollapsed={!isOpen}>
          <VStack spacing={1} align="stretch">
            {socialMenuItems.map((item) => (
              <MenuItem
                key={item.name}
                to={item.path}
                icon={item.icon}
                isCollapsed={!isOpen}
                isActive={location.pathname === item.path}
              >
                {item.name}
              </MenuItem>
            ))}
          </VStack>
        </SidebarSection>
        {/* Create new button */}
        {isOpen && (
          <Box px={2} mt={4} mb={2}>
            <Button
              leftIcon={<FiPlus />}
              bgGradient="linear(to-r, purple.400, orange.300)"
              color="white"
              size="md"
              width="100%"
              borderRadius="lg"
              fontWeight="bold"
              fontSize="md"
              onClick={handleCreateNew}
              boxShadow="lg"
              _hover={{ filter: 'brightness(1.08)', transform: 'translateY(-2px) scale(1.04)', boxShadow: 'xl' }}
              _active={{ filter: 'brightness(0.98)', transform: 'none' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            >
              + New Workout
            </Button>
          </Box>
        )}
        <Box flex={1} />
        
        {/* Profile section */}
        <Box 
          mt="auto" 
          pt={4}
          borderTop="1px"
          borderColor={borderColor}
        >
          <MenuItem
            to="/profile"
            icon={FiUser}
            isCollapsed={!isOpen}
            isActive={location.pathname.startsWith('/profile')}
            onClick={!isOpen ? () => navigate('/profile') : undefined}
          >
            Profile
          </MenuItem>
          
          <MenuItem
            to="/settings"
            icon={FiSettings}
            isCollapsed={!isOpen}
            isActive={location.pathname === '/settings'}
            onClick={!isOpen ? () => navigate('/settings') : undefined}
          >
            Settings
          </MenuItem>

          {isOpen && currentUser && (
            <Box mt={4} px={2}>
              <HStack 
                bg={userBoxBg} p={2} borderRadius="lg">
                <Avatar size="sm" name={currentUser.displayName || ''} src={currentUser.photoURL || ''} />
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight="semibold" isTruncated color={textColor}>
                    {currentUser.displayName || 'User'}
                  </Text>
                  <Text 
                    fontSize="xs" 
                    color="gray.500"
                  >
                    {currentUser.email}
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default Sidebar;
