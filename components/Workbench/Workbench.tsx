import {
  Flex,
  Container,
  Text,
  Button,
  Group,
  rem,
  RingProgress,
  ScrollArea,
  Textarea,
  Paper,
  SimpleGrid,
  Badge,
  Image,
  Modal,
  TextInput,
  Switch,
  Stack,
} from "@mantine/core";
import { IconCrystalBall, IconSend, IconEdit } from "@tabler/icons-react";
import { Block } from "@/types/Block";
import { useEffect, useState } from "react";




const code0 =
`abstract class State {}

abstract class Agent {
    abstract initialize(runtime: Runtime, params: any): void
    abstract step(runtime: Runtime): Promise<void>
    async reset(runtime: Runtime): Promise<void> {}
}

abstract class Runtime {
    abstract agent(agent: Agent, name: string): void
    abstract in(agent: Agent, key: string, opt?: { trigger: boolean }): any
    abstract out(agent: Agent, key: string): any
    abstract description(agent: Agent, description: string): void

    abstract getState(): State
    abstract setState(state: State): void
    abstract start(): void
    abstract get(key: string): Promise<any>
    abstract set(key: string, value: any): Promise<void>
}
`;

const o1 = {
  id: "predictor",
  title: "Simple Predictor",
  description: "This predictor is a simple linear regression model that predicts the next value in a sequence based on the previous values.",
  imageUrl:
    "https://s3.tradingview.com/x/xMg5r0h4_mid.png",
  isAbstract: false,
  codeContent:
`class Predictor extends Agent {
    private /* input */ assetPrices: number[] = []
    private /* output */ prediction: { prices: number[], prediction: number } = { prices: [], prediction: 0 }
    description: string = 'This predictor is a simple linear regression model that predicts the next value in a sequence based on the previous values.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'Predictor')
        runtime.in(this, 'assetPrices', { trigger: true })
        runtime.out(this, 'prediction')
    }

    async step(runtime: Runtime): Promise<void> {
        const assetPrices = await runtime.get('assetPrices')
        // Need at least 2 points for linear regression
        if (assetPrices.length < 2) {
            return assetPrices[assetPrices.length - 1] || 0
        }

        // Create x values (time indices) and y values (prices)
        const x = Array.from({ length: assetPrices.length }, (_, i) => i)
        const y = assetPrices

        // Calculate means
        const meanX = x.reduce((sum: number, val: number) => sum + val, 0) / x.length
        const meanY = y.reduce((sum: number, val: number) => sum + val, 0) / y.length

        // Calculate slope (m) and y-intercept (b)
        let numerator = 0
        let denominator = 0
        
        for (let i = 0; i < x.length; i++) {
            numerator += (x[i] - meanX) * (y[i] - meanY)
            denominator += Math.pow(x[i] - meanX, 2)
        }

        const slope = numerator / denominator
        const intercept = meanY - slope * meanX

        // Predict the next value
        const nextX = x.length
        const prediction = slope * nextX + intercept
        await runtime.set('prediction', prediction)
    }
}
  `,
  simulationContent:
`class Predictor extends Agent {
    private /* input */ assetPrices: number[] = []
    private /* output */ prediction: { prices: number[], prediction: number } = { prices: [], prediction: 0 }
    description: string = 'This predictor is a simple linear regression model that predicts the next value in a sequence based on the previous values.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'Predictor')
        runtime.in(this, 'assetPrices', { trigger: true })
        runtime.out(this, 'prediction')
    }

    async step(runtime: Runtime): Promise<void> {
        const assetPrices = await runtime.get('assetPrices')
        // Need at least 2 points for linear regression
        if (assetPrices.length < 2) {
            return assetPrices[assetPrices.length - 1] || 0
        }

        // Create x values (time indices) and y values (prices)
        const x = Array.from({ length: assetPrices.length }, (_, i) => i)
        const y = assetPrices

        // Calculate means
        const meanX = x.reduce((sum: number, val: number) => sum + val, 0) / x.length
        const meanY = y.reduce((sum: number, val: number) => sum + val, 0) / y.length

        // Calculate slope (m) and y-intercept (b)
        let numerator = 0
        let denominator = 0
        
        for (let i = 0; i < x.length; i++) {
            numerator += (x[i] - meanX) * (y[i] - meanY)
            denominator += Math.pow(x[i] - meanX, 2)
        }

        const slope = numerator / denominator
        const intercept = meanY - slope * meanX

        // Predict the next value
        const nextX = x.length
        const prediction = slope * nextX + intercept
        await runtime.set('prediction', prediction)
    }
}
  `
};

const o2 = {
  id: "oracle",
  title: "Oracle built on Coinbase API",
  description: "This oracle returns an array of prices of a given asset using the Coinbase API.",
  imageUrl:
    "https://i.ytimg.com/vi/IroCSXpWpfA/maxresdefault.jpg",
  isAbstract: true,
  codeContent:
`abstract class Oracle extends Agent {
    private /* input */ assetName: string = ''
    private /* input */ every1Minute: boolean = false
    private /* output */ assetPrices: number[] = []
    description: string = 'This oracle returns an array of prices of a given asset using the Coinbase API.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'Oracle')
        runtime.in(this, 'assetName', { trigger: false })
        runtime.in(this, 'every1Minute', { trigger: true })
        runtime.out(this, 'assetPrices')
    }

    abstract step(runtime: Runtime): Promise<void>
}
  `,
  simulationContent:
`    class OracleSim extends Oracle {
        async step(runtime: Runtime): Promise<void> {
            await runtime.set('assetPrices', [100, 101, 102, 103, 99, 98, 95, 95])
        }
    }
  `
};

const o3 = {
  id: "order",
  title: "Send order to Coinbase for execution",
  description: "Buy or sell an asset at market price. If order is negative, buy at market price, if positive, sell at market price, if 0, do nothing. So for instance if assetName is BTC and order is -0.2, then the agent will sell 0.2 BTC at the current market price.",
  imageUrl:
    "https://i.ytimg.com/vi/IroCSXpWpfA/maxresdefault.jpg",
  isAbstract: true,
  codeContent:
`abstract class BuySellMarket extends Agent {
    private /* input */ assetName: string = ''
    private /* input */ order: number = 0 // Can be -1, 0, 1
    description: string = 'Buy or sell an asset at market price. If order is negative, buy at market price, if positive, sell at market price, if 0, do nothing. So for instance if assetName is BTC and order is -0.2, then the agent will sell 0.2 BTC at the current market price.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'BuySellMarket')
        runtime.in(this, 'assetName')
        runtime.in(this, 'order')
    }

    abstract step(runtime: Runtime): Promise<void>
}
  `,
  simulationContent:
`    class BuySellMarketSim extends BuySellMarket {
        async step(runtime: Runtime): Promise<void> {
            const assetName = await runtime.get('assetName')
            const order = await runtime.get('order')
            console.log('BuySellMarket1 ' + assetName + ' ' + order)
        }
    }
  `
};

const o4 = {
  id: "strat",
  title: "Simplistic Strategy",
  description: "A simplistic strategy that looks at the prediction and decides to buy or sell at market price.",
  imageUrl:
    "https://fxmedia.s3.amazonaws.com/articles/best_trading_strategies-1.png",
  isAbstract: false,
  codeContent:
`class SimplisticStrategy extends Agent {
    private /* input */ prediction: { prices: number[], prediction: number } = { prices: [], prediction: 0 }
    private /* output */ order: number = 0
    description: string = 'A simplistic strategy that looks at the prediction and decides to buy or sell at market price.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'StupidStrategy')
        runtime.in(this, 'prediction')
        runtime.out(this, 'order')
    }

    async step(runtime: Runtime): Promise<void> {
        const prediction = await runtime.get('prediction')
        // If the prediction is below the last price, sell k * (last price - prediction)
        // If the prediction is above the last price, buy k * (prediction - last price)
        // If the prediction is equal to the last price, do nothing
        const lastPrice = prediction.prices[prediction.prices.length - 1]
        const order = prediction.prediction < lastPrice ? -1 : prediction.prediction > lastPrice ? 1 : 0
        await runtime.set('order', order)
    }
}
  `,
  simulationContent:
`class SimplisticStrategy extends Agent {
    private /* input */ prediction: { prices: number[], prediction: number } = { prices: [], prediction: 0 }
    private /* output */ order: number = 0
    description: string = 'A stupid strategy that looks at the prediction and decides to buy or sell at market price.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'StupidStrategy')
        runtime.in(this, 'prediction')
        runtime.out(this, 'order')
    }

    async step(runtime: Runtime): Promise<void> {
        const prediction = await runtime.get('prediction')
        // If the prediction is below the last price, sell k * (last price - prediction)
        // If the prediction is above the last price, buy k * (prediction - last price)
        // If the prediction is equal to the last price, do nothing
        const lastPrice = prediction.prices[prediction.prices.length - 1]
        const order = prediction.prediction < lastPrice ? -1 : prediction.prediction > lastPrice ? 1 : 0
        await runtime.set('order', order)
    }
}
  `
};


export const Workbench = ({
  connected = false,
  publicKey,
  session,
  setSession,
}: any) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([o1, o2, o3]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const iconStyle = { width: rem(12), height: rem(12) };

  const handleSaveBlock = (block: Block) => {
    if (block.id) {
      // Edit existing block
      setBlocks(blocks.map(o => o.id === block.id ? block : o));
    } else {
      // Add new block with generated id
      const newBlock = {
        ...block,
        id: Math.random().toString(36).substr(2, 9)
      };
      setBlocks([...blocks, newBlock]);
    }
    setModalOpened(false);
    setCurrentBlock(null);
  };

  const handleEditBlock = (block: Block) => {
    setCurrentBlock(block);
    setModalOpened(true);
  };

  const handleNewBlock = () => {
    setCurrentBlock({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      isAbstract: false,
      codeContent: '',
      simulationContent: ''
    });
    setModalOpened(true);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const newHistory = [...chatHistory, {role: 'user', content: chatInput}];
    setChatHistory(newHistory);
    setChatInput("");
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: chatInput,
          blocks: blocks
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setChatHistory([...newHistory, {
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory([...newHistory, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    }
  };

  if (!connected) {
    return (
      <Text ta="center" p="md">
        Disconnected
      </Text>
    );
  }

  return (
    <Container size="80rem" px={0}>
      <Paper shadow="sm" p="xs" mb="xs">
        <Group align="flex-start" style={{ height: '120px' }}>
          <ScrollArea h={120} style={{ flex: 1 }}>
            {chatHistory.map((msg, i) => (
              <Text key={i} size="sm" style={{ color: msg.role === 'assistant' ? 'blue' : 'black' }}>
                <b>{msg.role}:</b> {msg.content}
              </Text>
            ))}
          </ScrollArea>
          <Group align="flex-start" style={{ width: '300px' }}>
            <Textarea
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.currentTarget.value)}
              minRows={3}
              maxRows={3}
              style={{ flex: 1 }}
            />
            <Button onClick={handleChatSubmit} size="sm" style={{ marginTop: '4px' }}>
              <IconSend size={14} />
            </Button>
          </Group>
        </Group>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setCurrentBlock(null);
        }}
        title={currentBlock?.id ? "Edit Block" : "New Block"}
        size="xl"
        styles={{
          body: {
            padding: '2rem'
          }
        }}
      >
        {currentBlock && (
          <Stack>
            <TextInput
              label="Title"
              value={currentBlock.title}
              onChange={(e) => setCurrentBlock({...currentBlock, title: e.target.value})}
            />
            <TextInput
              label="Description"
              value={currentBlock.description}
              onChange={(e) => setCurrentBlock({...currentBlock, description: e.target.value})}
            />
            <TextInput
              label="Image URL"
              value={currentBlock.imageUrl}
              onChange={(e) => setCurrentBlock({...currentBlock, imageUrl: e.target.value})}
            />
            <Switch
              label="Abstract"
              checked={currentBlock.isAbstract}
              onChange={(e) => setCurrentBlock({...currentBlock, isAbstract: e.currentTarget.checked})}
            />
            <Textarea
              label="Code"
              value={currentBlock.codeContent}
              onChange={(e) => setCurrentBlock({...currentBlock, codeContent: e.target.value})}
              minRows={10}
              autosize
              maxRows={20}
              style={{ flex: 1 }}
            />
            <Textarea
              label="Simulation"
              value={currentBlock.simulationContent}
              onChange={(e) => setCurrentBlock({...currentBlock, simulationContent: e.target.value})}
              minRows={10}
              autosize
              maxRows={20}
              style={{ flex: 1 }}
            />
            <Button onClick={() => handleSaveBlock(currentBlock)}>
              {currentBlock.id ? 'Save Changes' : 'Create Block'}
            </Button>
          </Stack>
        )}
      </Modal>

      <Group p="10">
        <Button
          size="sm"
          justify="left"
          leftSection={<IconCrystalBall style={iconStyle} />}
          onClick={handleNewBlock}
        >
          New Tiny Block
        </Button>
      </Group>
      <Container size="80rem" p="xs">
        <SimpleGrid cols={3} spacing="xs">
          {blocks.map((block) => (
            <Paper 
              key={block.id}
              shadow="sm" 
              p="md"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={500}>{block.title}</Text>
                <Group>
                  {block.isAbstract && (
                    <Badge color="blue" variant="light">Abstract</Badge>
                  )}
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => handleEditBlock(block)}
                  >
                    <IconEdit size={14} />
                  </Button>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">{block.description}</Text>
              {block.imageUrl && (
                <Image 
                  src={block.imageUrl} 
                  alt={block.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginTop: 'auto',
                    borderRadius: '4px'
                  }}
                />
              )}
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};