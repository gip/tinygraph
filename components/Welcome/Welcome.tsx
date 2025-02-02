import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export const Welcome = () => {

    return (
        <>
            <Title className={classes.title} ta="center" mt={100}>
                Welcome to{' '}
                <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }} fs="italic">
                    tinygraph
                </Text>
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
            Low-Complexity Agent Infrastructure
            </Text>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
Large Language Models (LLMs) have emerged as powerful tools for translating high-level trading strategies into executable steps.
            </Text>
        </>
    );
}