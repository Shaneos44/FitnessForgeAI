import React from 'react';
import { Box, Flex, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FiMenu, FiLogOut, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Box 
      as="nav" 
      position="sticky" 
      top="0" 
      zIndex="sticky"
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor}
      px={4}
      py={2}
    >
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<FiMenu />}
            variant="ghost"
            onClick={onSidebarToggle}
            mr={3}
          />
          <Text fontSize="xl" fontWeight="bold">FitnessForge</Text>
        </Flex>
        
        <Flex align="center">
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            variant="ghost"
            onClick={toggleColorMode}
            mr={3}
          />
          
          <Menu>
            <MenuButton>
              <Avatar 
                size="sm" 
                name={currentUser?.displayName || 'User'} 
                src={currentUser?.photoURL || undefined} 
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                Profile
              </MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
