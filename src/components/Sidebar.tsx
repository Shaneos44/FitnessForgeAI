import React from 'react';
import { Box, VStack, HStack, Text, Icon, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiCalendar, FiActivity, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Training Plans', icon: FiCalendar, path: '/training-plans' },
    { name: 'Workouts', icon: FiActivity, path: '/workouts' },
    { name: 'Profile', icon: FiUser, path: '/profile' }
  ];

  return (
    <Box
      as="aside"
      w="250px"
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
    >
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            style={({ isActive }) => ({
              backgroundColor: isActive ? useColorModeValue('gray.100', 'gray.700') : '',
              borderRadius: '8px'
            })}
          >
            {({ isActive }) => (
              <HStack
                px={3}
                py={2}
                spacing={3}
                borderRadius="md"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                <Icon as={item.icon} boxSize={5} color={isActive ? 'green.500' : 'gray.500'} />
                <Text fontWeight={isActive ? 'bold' : 'normal'}>{item.name}</Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
