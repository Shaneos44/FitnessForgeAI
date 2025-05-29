import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { FiPlay, FiPause, FiSquare } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const WorkoutTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const toast = useToast();

  useEffect(() => {
    let watchId: number | undefined;
    
    if (isTracking) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = {
            latitude,
            longitude,
            timestamp: Date.now(),
          };
          setCurrentPosition(newPosition);
          setPositions((prev) => [...prev, newPosition]);
        },
        (error) => {
          console.error('Error getting location', error);
          toast({
            title: 'Error',
            description: 'Error getting your location',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, toast]);

  if (!currentUser) {
    return <Text>Please sign in to track workouts</Text>;
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setPositions([]);
    setCurrentPosition(null);
    toast({
      title: 'Workout saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const calculateDistance = (): number => {
    if (positions.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const pos1 = positions[i - 1];
      const pos2 = positions[i];
      
      const R = 6371e3; // Earth's radius in meters
      const φ1 = pos1.latitude * Math.PI / 180;
      const φ2 = pos2.latitude * Math.PI / 180;
      const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
      const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;

      const a = 
        Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      totalDistance += R * c;
    }
    return totalDistance;
  };



  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Workout Tracker</Text>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontSize="xl" fontWeight="medium">
            {isTracking ? 'Tracking...' : 'Not tracking'}
          </Text>
          {currentPosition && (
            <>
              <Text>Latitude: {currentPosition.latitude.toFixed(6)}</Text>
              <Text>Longitude: {currentPosition.longitude.toFixed(6)}</Text>
              <Text>Points: {positions.length}</Text>
              <Text>Distance: {(calculateDistance() / 1000).toFixed(2)} km</Text>
            </>
          )}
        </Box>

        <Button
          leftIcon={<FiPlay />}
          colorScheme="green"
          onClick={startTracking}
          isDisabled={isTracking}
        >
          Start
        </Button>
        <Button
          leftIcon={<FiPause />}
          colorScheme="yellow"
          onClick={() => setIsTracking(false)}
          isDisabled={!isTracking}
        >
          Pause
        </Button>
        <Button
          leftIcon={<FiSquare />}
          colorScheme="red"
          onClick={stopTracking}
          isDisabled={!isTracking}
        >
          Stop & Save
        </Button>
      </VStack>
    </Box>
  );
};

export default WorkoutTracker;
