import React from 'react';
import { 
  Box, 
  Flex, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Text,
  useColorMode,
  useColorModeValue,
  HStack,
  Button,
  useBreakpointValue,
  Image,
  Tooltip
} from '@chakra-ui/react';
import { 
  FiMenu, 
  FiLogOut, 
  FiUser, 
  FiMoon, 
  FiSun, 
  FiBell,
  FiActivity,
  FiAward,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiSliders
} from 'react-icons/fi';
import { getNotifications, markNotificationRead, Notification } from '../services/notificationService';
import { FiCalendar } from 'react-icons/fi';
import { FaRegClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarProps {
  onSidebarToggle?: () => void;
}

const MotionBox = motion(Box);

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logoSize = useBreakpointValue({ base: '32px', md: '40px' });
  const logoTextSize = useBreakpointValue({ base: '2xl', md: '3xl' });
  const navbarBg = useColorModeValue('rgba(255,255,255,0.85)', 'rgba(24,29,58,0.90)');
  const borderColor = useColorModeValue('rgba(44,62,80,0.10)', 'rgba(255,255,255,0.08)');
  const shadow = '0 8px 32px 0 rgba(31, 38, 135, 0.18)';
  const menuHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const menuActiveBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const buttonHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  // Premium CTA logic (replace with real subscription check)
  const isPremium = false; // TODO: wire up to real subscription status

  // Notifications state
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      setNotifLoading(true);
      try {
        const notes = await getNotifications(currentUser.uid);
        setNotifications(notes);
      } catch (e) {
        // Optionally handle error
      } finally {
        setNotifLoading(false);
      }
    };
    if (notifOpen && currentUser) fetchNotifications();
  }, [notifOpen, currentUser]);

  const handleMarkRead = async (id: string) => {
    if (!currentUser) return;
    await markNotificationRead(currentUser.uid, id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleOpenNotif = () => setNotifOpen(true);
  const handleCloseNotif = () => setNotifOpen(false);

  const notifTypeIcon = (type: string) => {
    switch (type) {
      case 'award': return <FiAward color="#c7a008" />;
      case 'pb': return <FiActivity color="#2b6cb0" />;
      case 'reminder': return <FiBell color="#e53e3e" />;
      case 'motivation': return <FiSun color="#38a169" />;
      default: return <FiBell />;
    }
  };

  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiActivity />, label: 'Workouts', path: '/workouts' },
    { icon: <FiSliders />, label: 'Plan Generator', path: '/workout-plan-generator' },
    { icon: <FiCalendar />, label: 'Tracker', path: '/workout-tracker' },
    { icon: <FaRegClock />, label: 'Smartwatch', path: '/smartwatch-connection' },
    { icon: <FiAward />, label: 'Goals', path: '/training-goals' },
    { icon: <FiCreditCard />, label: 'Subscription', path: '/subscription' },
  ];

  // Fetch streak from userProfile (from AuthContext)
  const { userProfile } = useAuth();
  const streakCount = userProfile?.streak ?? 0; // TODO: Ensure backend provides streak value


  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <MotionBox
      as="nav"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      position="sticky"
      top={0}
      zIndex={100}
      w="100%"
      bg={navbarBg}
      boxShadow={shadow}
      backdropFilter="blur(18px)"
      borderBottom={`1.5px solid ${borderColor}`}
      backgroundImage="url('/bg-fitness-pattern.svg')"
      backgroundSize="cover"
      backgroundPosition="center"
      bgRepeat="repeat"
      bgBlendMode="multiply"
      opacity={1}
    >
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto" px={{ base: 2, md: 8 }} py={2}>
        <HStack spacing={{ base: 2, md: 6 }}>
          {isMobile && (
            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              variant="ghost"
              size="lg"
              onClick={onSidebarToggle}
            />
          )}
          {/* Logo + Tagline (stacked, no overlap) */}
          <Link to="/" style={{ textDecoration: 'none' }} aria-label="Go to home">
            <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
              {/* Add your custom logo image here if desired */}
              {/* <Image src="/assets/your-logo.png" alt="Your Logo" boxSize={logoSize} mb={1} /> */}
              <Text fontWeight="extrabold" fontSize={logoTextSize} letterSpacing="tight" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                FitnessForgeAI
              </Text>
              <Text fontSize="sm" color="gray.500" fontStyle="italic" mt={1} display={{ base: 'none', md: 'block' }}>
                Forge your best self
              </Text>
            </Box>
          </Link>
          {/* Nav Items */}
          <HStack as="nav" spacing={1} ml={6} display={{ base: 'none', md: 'flex' }}>
            {navItems.map(item => (
              <Tooltip label={item.label} key={item.path} placement="bottom" openDelay={300}>
                <Button
                  as={Link}
                  to={item.path}
                  leftIcon={item.icon}
                  variant="ghost"
                  px={4}
                  py={2}
                  fontWeight="bold"
                  fontSize="md"
                  borderRadius="lg"
                  aria-label={item.label + ' navigation'}
                  tabIndex={0}
                  _focus={{ boxShadow: 'outline' }}
                  _hover={{ bg: 'blue.50', color: 'blue.700', transform: 'scale(1.05)' }}
                  _active={{ bg: 'blue.100' }}
                  borderBottom={location.pathname.startsWith(item.path) ? '3px solid #3182ce' : '3px solid transparent'}
                  color={location.pathname.startsWith(item.path) ? 'blue.600' : undefined}
                  bg={location.pathname.startsWith(item.path) ? 'blue.50' : 'transparent'}
                  transition="all 0.15s cubic-bezier(.4,0,.2,1)"
                >
                  {item.label}
                </Button>
              </Tooltip>
            ))}
          </HStack>
        </HStack>
        {/* Streak Indicator */}
        <HStack spacing={3} align="center" mr={6}>
          <Tooltip label={`Current streak: ${streakCount} days`} placement="bottom">
            <Flex align="center" px={2} py={1} bg="orange.50" borderRadius="xl" border="1px solid #f6ad55">
              <span role="img" aria-label="flame" style={{ fontSize: 20, marginRight: 4 }}>🔥</span>
              <Text color="orange.700" fontWeight="bold" fontSize="md">{streakCount}</Text>
            </Flex>
          </Tooltip>
        </HStack>
        <HStack spacing={{ base: 1, md: 4 }}>
          <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              variant="ghost"
              onClick={toggleColorMode}
              size="md"
              borderRadius="full"
              _hover={{ bg: buttonHoverBg, transform: 'scale(1.08)' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            />
          </Tooltip>
          <Menu isOpen={notifOpen} onClose={handleCloseNotif} placement="bottom-end">
            <Tooltip label="Notifications">
              <MenuButton as={Box} position="relative" onClick={handleOpenNotif} cursor="pointer">
                <IconButton
                  aria-label="Notifications"
                  icon={<FiBell />}
                  variant="ghost"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: buttonHoverBg, transform: 'scale(1.08)' }}
                  transition="all 0.18s cubic-bezier(.4,0,.2,1)"
                />
                {unreadCount > 0 && (
                  <Box position="absolute" top={1} right={1} bg="red.500" color="white" borderRadius="full" px={1.5} fontSize="xs" fontWeight="bold" boxShadow="md">
                    {unreadCount}
                  </Box>
                )}
              </MenuButton>
            </Tooltip>
            <MenuList minW="340px" maxH="400px" overflowY="auto" zIndex={1500} p={0}>
              <Box px={4} py={2} borderBottom="1px solid" borderColor={borderColor} fontWeight="bold">
                Notifications
              </Box>
              {notifLoading ? (
                <Box px={4} py={6} textAlign="center">Loading...</Box>
              ) : notifications.length === 0 ? (
                <Box px={4} py={6} textAlign="center" color="gray.500">
                  <img src="https://undraw.co/api/illustrations/undraw_notify_re_65on.svg" alt="No notifications" style={{ width: 120, margin: '0 auto 16px' }} />
                  <Text fontWeight="semibold" color="gray.700" mb={2}>You're all caught up!</Text>
                  <Text fontSize="sm" color="gray.500">No notifications yet. Stay consistent and your achievements will show up here!</Text>
                </Box>
              ) : (
                notifications.map(n => (
                  <MenuItem
                    key={n.id}
                    bg={!n.read ? 'blue.50' : undefined}
                    onClick={() => handleMarkRead(n.id!)}
                    alignItems="flex-start"
                    py={3}
                    _hover={{ bg: 'blue.100', transform: 'scale(1.02)' }}
                    _active={{ bg: 'blue.200' }}
                    transition="all 0.15s cubic-bezier(.4,0,.2,1)"
                  >
                    <Flex align="center" gap={3}>
                      {notifTypeIcon(n.type)}
                      <Box>
                        <Text fontWeight={!n.read ? 'bold' : 'normal'}>{n.message}</Text>
                        <Text fontSize="xs" color="gray.500">{n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : ''}</Text>
                      </Box>
                    </Flex>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>
          {!isPremium && (
            <Button
              className="premium-btn"
              size="md"
              px={6}
              onClick={() => navigate('/subscription')}
              borderRadius="xl"
              fontWeight="extrabold"
              fontSize="md"
              boxShadow="card"
              _hover={{ filter: 'brightness(1.08)', transform: 'translateY(-2px) scale(1.04)' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            >
              Upgrade
            </Button>
          )}
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              size="md"
              p={0}
              borderRadius="full"
              _hover={{ bg: 'transparent', transform: 'scale(1.08)' }}
              _active={{ bg: 'transparent' }}
              transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            >
              <Avatar 
                size="md"
                name={currentUser?.displayName || 'User'} 
                src={currentUser?.photoURL || undefined}
                cursor="pointer"
                border="2px"
                borderColor="brand.400"
                _hover={{ transform: 'scale(1.08)' }}
                transition="all 0.18s cubic-bezier(.4,0,.2,1)"
              />
            </MenuButton>
            <MenuList 
              zIndex="popover"
              minW="220px"
              py={2}
              boxShadow="xl"
              borderColor={borderColor}
              bg={navbarBg}
              sx={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <MenuItem 
                icon={<FiUser size={18} />} 
                onClick={() => navigate('/profile')}
                _hover={{ bg: menuHoverBg }}
                _focus={{ bg: menuHoverBg }}
                fontWeight="medium"
              >
                Profile
              </MenuItem>
              <MenuItem 
                icon={<FiLogOut size={18} />} 
                onClick={handleLogout}
                _hover={{ bg: menuHoverBg }}
                _focus={{ bg: menuHoverBg }}
                color="red.500"
                fontWeight="medium"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </MotionBox>
  );
};

export default Navbar;
