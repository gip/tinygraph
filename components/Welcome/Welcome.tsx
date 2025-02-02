import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export const Welcome = () => {

    return (
        <>
            <Title className={classes.title} ta="center" mt={100}>
                Welcome to{' '}
                <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
                    TinyGraph
                </Text>
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
                An agent to build and explore different trading strategies using reusable tinyblocks.
            </Text>
        </>
    );
}