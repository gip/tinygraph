import { SimpleGrid, Text } from "@mantine/core";
import { GoalCard } from "@/components/GoalCard/GoalCard";
import { Oracle } from "@/types/Oracle";
import { Goal } from "@/types/Goal";

interface OracleGridProps {
  oracles: Oracle[];
}

const toGoal = (oracle: Oracle): Goal => ({
  id: 123,
  title: oracle.title,
  description: oracle.description,
  tags: [],
  achieveBy: new Date('1/1/2025'),
  status: "running",
  imageUrl: oracle.imageUrl
});

export function OracleGrid({ oracles }: OracleGridProps) {
  if (oracles.length === 0) {
    return (
      <Text ta="center" c="dimmed" mt="xl">
        No oracle set!
      </Text>
    );
  }
  return (
    <SimpleGrid cols={1} spacing={{ base: 10, sm: 'lg' }}
      verticalSpacing={{ base: 'lg', sm: 'lg' }}>
      {oracles.map((goal, index) => (
        <div key={index}>
          <GoalCard goal={toGoal(goal)} />
        </div>
      ))}
    </SimpleGrid>
  );
}
