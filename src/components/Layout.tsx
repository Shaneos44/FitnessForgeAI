import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Flex, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MotionBox = motion(Box);

const Layout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!useBreakpointValue({ base: true, md: false }));
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => {
    setIsSidebarOpen((open) => !open);
  };

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const bgGradient = useColorModeValue(
    'linear(to-r, gray.50 0%, white 50%, gray.50 100%)',
    'linear(to-r, gray.900 0%, gray.800 50%, gray.900 100%)'
  );

  return (
    <Flex 
      h="100vh" 
      direction="column"
      bgGradient={bgGradient}
      bgSize="200% 200%"
      animation="gradient 15s ease infinite"
      sx={{
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Navbar onSidebarToggle={toggleSidebar} />
      <Flex 
        flex="1" 
        overflow="hidden"
        position="relative"
      >
        {/* Sidebar overlay for mobile - offset below navbar */}
        {isMobile && isSidebarOpen && (
          <Box
            position="fixed"
            left={0}
            top="64px" // assuming navbar is 64px tall
            w="100vw"
            h="calc(100vh - 64px)"
            bg="blackAlpha.400"
            zIndex={20}
            onClick={toggleSidebar}
            aria-label="Close sidebar overlay"
            tabIndex={0}
            role="button"
          />
        )}
        {/* Sidebar - offset below navbar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar}
          aria-controls="main-content"
          aria-expanded={isSidebarOpen}
          offsetTop="64px"
        />
        {/* Main content */}
        <Box 
          id="main-content"
          flex="1" 
          pl={0}
          pt={{ base: '60px', md: 0 }}
          transition="all 0.3s ease"
          overflowY="auto"
          position="relative"
          zIndex={1}
          backgroundImage="linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url('/fitness-bg-2.jpg')"
          backgroundSize="cover"
          backgroundPosition="center"
          bgRepeat="no-repeat"
        >
          <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 6, lg: 8 }}>
            <AnimatePresence mode="wait" initial={false}>
              <MotionBox
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                h="100%"
              >
                <Outlet />
              </MotionBox>
            </AnimatePresence>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
