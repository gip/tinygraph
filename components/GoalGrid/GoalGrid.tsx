import { SimpleGrid, Text } from "@mantine/core";
import { GoalCard } from "@/components/GoalCard/GoalCard";
import { Goal } from "@/types/Goal";

interface GoalGridProps {
  goals: Goal[];
}

export function GoalGrid({ goals }: GoalGridProps) {
  if (goals.length === 0) {
    return (
      <Text ta="center" c="dimmed" mt="xl">
        No goals set!
      </Text>
    );
  }
  return (
    <SimpleGrid cols={1} spacing={{ base: 10, sm: 'lg' }}
      verticalSpacing={{ base: 'lg', sm: 'lg' }}>
      {goals.map((goal, index) => (
        <div key={index}>
          <GoalCard goal={goal} />
        </div>
      ))}
    </SimpleGrid>
  );
}
