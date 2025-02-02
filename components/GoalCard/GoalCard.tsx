// src/components/goals/GoalCard.jsx
import { Card, Image, Text, Badge, Button, Group, Stack } from '@mantine/core';
import { IconCalendar, IconTag, IconPlayerPlay } from '@tabler/icons-react';
import classes from './GoalCard.module.css';
import { Goal } from '@/types/Goal';

export function GoalCard({ goal }: { goal: Goal }) {
  const { description, tags, achieveBy, status = 'running' } = goal;
  
  const formattedDate = achieveBy ? new Date(achieveBy).toLocaleDateString() : 'No date set';
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <div style={{ position: 'relative' }}>
          <Image
            src={goal.imageUrl || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
            height={100}
            alt="Goal visualization"
          />
          {status === 'running' && (
            <Group 
              gap="xs"
              className={classes.runningIndicator}
            >
              <IconPlayerPlay 
                size={14} 
                style={{ color: '#4CAF50' }}
              />
              <Text size="xs" c="white" fw={500}>
                Running
              </Text>
            </Group>
          )}
        </div>
      </Card.Section>

      <Stack  mt="md">
        <Text lineClamp={2} size="lg" fw={500}>
          {description}
        </Text>

        {tags && tags.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="light" 
                color="violet"
                leftSection={<IconTag size={12} />}
              >
                {tag}
              </Badge>
            ))}
          </Group>
        )}

        <Group justify="space-between" mt="xs">
          <Group gap="xs">
            <IconCalendar size={16} />
            <Text size="sm" c="dimmed">
              {formattedDate}
            </Text>
          </Group>

          <Button 
            variant="light" 
            color="violet" 
            size="xs"
          >
            View Details
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}