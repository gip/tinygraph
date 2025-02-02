import { Modal, Text, Stack, Group, UnstyledButton, Avatar } from "@mantine/core";
import { Oracle } from "@/types/Oracle";
import { IconChevronRight } from "@tabler/icons-react";

export const AVAILABLE_ORACLES: Oracle[] = [
  {
    id: "price-feed",
    title: "Price Feed Oracle",
    description: "Provides real-time price data for various digital assets",
    imageUrl: "/api/placeholder/400/200",
  },
  {
    id: "weather",
    title: "Climate Oracle",
    description: "Weather and climate data from different locations",
    imageUrl: "/api/placeholder/400/200",
  },
  {
    id: "sports",
    title: "Sports Oracle",
    description: "Sports event results and statistics",
    imageUrl: "/api/placeholder/400/200",
  },
  {
    id: "random",
    title: "Random Number Oracle",
    description: "Verifiable random number generator",
    imageUrl: "/api/placeholder/400/200",
  },
];

interface AddOracleModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (oracle: Oracle) => void;
}

export function AddOracleModal({
  opened,
  onClose,
  onSubmit,
}: AddOracleModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Oracle"
      size="md"
      padding="md"
    >
      <Stack gap="xs">
        <Text size="sm" c="dimmed" mb="md">
          Select an oracle from the available list:
        </Text>

        {AVAILABLE_ORACLES.map((oracle) => (
          <UnstyledButton
            key={oracle.id}
            onClick={() => onSubmit(oracle)}
            p="md"
            style={(theme) => ({
              width: '100%',
              borderRadius: theme.radius.sm,
              '&:hover': {
                backgroundColor: theme.colors.gray[0]
              }
            })}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="md" wrap="nowrap">
                <Avatar 
                  src={oracle.imageUrl} 
                  size="md" 
                  radius="sm"
                />
                <div>
                  <Text size="sm" fw={500}>
                    {oracle.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {oracle.description}
                  </Text>
                </div>
              </Group>
              <IconChevronRight size={18} style={{ color: 'var(--mantine-color-gray-5)' }} />
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Modal>
  );
}