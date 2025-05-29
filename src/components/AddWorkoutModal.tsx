import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  NumberInput,
  NumberInputField,
  Box,
  Text,
  Tooltip
} from '@chakra-ui/react';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (workout: any) => Promise<void>;
}

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('medium');
  const [type, setType] = useState('strength');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!title || !description || !date || !duration) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields to add your workout and keep your streak alive! 💪',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setLoading(true);
    try {
      await onAdd({
        title,
        description,
        date: new Date(date),
        duration: Number(duration),
        intensity,
        type,
        completed: false
      });
      setTitle('');
      setDescription('');
      setDate('');
      setDuration(30);
      setIntensity('medium');
      setType('strength');
      onClose();
    } catch (e) {
      toast({
        title: 'Could not add workout',
        description: 'Something went wrong while saving your workout. Please try again or check your connection.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Workout</ModalHeader>
        {/* Motivational tip/banner */}
        <Box mb={3} textAlign="center">
          <img src="https://undraw.co/api/illustrations/undraw_workout_gcgu.svg" alt="Motivation" style={{ width: 80, margin: '0 auto 8px' }} />
          <Text fontSize="sm" color="blue.600" fontStyle="italic">"Every workout counts! Log your progress and stay motivated."</Text>
        </Box>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3} isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={e => setTitle(e.target.value)} aria-label="Workout title" />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} aria-label="Workout description" />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Workout date" />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Duration (minutes)</FormLabel>
            <NumberInput min={5} max={180} value={duration} onChange={(_, v) => setDuration(v)} aria-label="Workout duration">
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Intensity</FormLabel>
            <Tooltip label="How hard will this workout be?" aria-label="Intensity info" placement="top-start">
              <Select value={intensity} onChange={e => setIntensity(e.target.value)} aria-label="Workout intensity">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Tooltip>
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Type</FormLabel>
            <Tooltip label="What type of workout is this?" aria-label="Type info" placement="top-start">
              <Select value={type} onChange={e => setType(e.target.value)} aria-label="Workout type">
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="mobility">Mobility</option>
                <option value="other">Other</option>
              </Select>
            </Tooltip>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit} 
            isLoading={loading}
            aria-label="Add workout"
            _hover={{ bg: 'blue.600', transform: 'scale(1.04)' }}
            _active={{ bg: 'blue.700', transform: 'scale(0.98)' }}
            transition="all 0.13s cubic-bezier(.4,0,.2,1)"
          >
            Add Workout
          </Button>
          <Button 
            onClick={onClose}
            variant="ghost"
            aria-label="Cancel add workout"
            _hover={{ bg: 'gray.100', transform: 'scale(1.04)' }}
            _active={{ bg: 'gray.200', transform: 'scale(0.98)' }}
            transition="all 0.13s cubic-bezier(.4,0,.2,1)"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWorkoutModal;
