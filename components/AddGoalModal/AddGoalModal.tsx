import { useState } from 'react';
import { Modal, Textarea, MultiSelect, Button, Group, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Goal } from '@/types/Goal';

interface AddGoalModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (goal: Goal) => void;

}

const defaultTags = [
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'career', label: 'Career' },
  { value: 'personal', label: 'Personal' },
  { value: 'education', label: 'Education' },
];

export function AddGoalModal({ opened, onClose, onSubmit }:AddGoalModalProps) {
  const [goalDescription, setGoalDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [achieveDate, setAchieveDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    onSubmit({
      description: goalDescription,
      tags: selectedTags,
      achieveBy: achieveDate || new Date(),
      id: 0,
      title: "",
      status: "running",
      imageUrl: null,
    });
    
    setGoalDescription('');
    setSelectedTags([]);
    setAchieveDate(null);
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Add New Goal"
      size="lg"
      padding="lg"
      radius="md"
    >
      <Stack>
        <Textarea
          placeholder="Describe your goal..."
          label="Goal Description"
          description="What do you want to achieve?"
          value={goalDescription}
          onChange={(event) => setGoalDescription(event.currentTarget.value)}
          minRows={4}
          required
          styles={{
            input: {
              minHeight: '100px'
            }
          }}
        />

        <MultiSelect
          data={defaultTags}
          label="Tags"
          placeholder="Select tags"
          value={selectedTags}
          onChange={setSelectedTags}
          searchable
          clearable
        />

        <DatePickerInput
          label="Achieve By"
          placeholder="Select a date"
          value={achieveDate}
          onChange={setAchieveDate}
          minDate={new Date()}
          clearable
          styles={{
            input: {
              '&:focus': {
                borderColor: 'var(--mantine-color-blue-filled)'
              }
            }
          }}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose} color="gray">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Goal
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}