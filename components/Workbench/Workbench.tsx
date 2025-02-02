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
import { Oracle } from "@/types/Oracle";
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
  title: "Sime Predictor",
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
  const [currentOracle, setCurrentOracle] = useState<Oracle | null>(null);
  const [oracles, setOracles] = useState<Oracle[]>([o1, o2, o3, o4]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const iconStyle = { width: rem(12), height: rem(12) };

  const handleSaveOracle = (oracle: Oracle) => {
    if (oracle.id) {
      // Edit existing oracle
      setOracles(oracles.map(o => o.id === oracle.id ? oracle : o));
    } else {
      // Add new oracle with generated id
      const newOracle = {
        ...oracle,
        id: Math.random().toString(36).substr(2, 9)
      };
      setOracles([...oracles, newOracle]);
    }
    setModalOpened(false);
    setCurrentOracle(null);
  };

  const handleEditOracle = (oracle: Oracle) => {
    setCurrentOracle(oracle);
    setModalOpened(true);
  };

  const handleNewOracle = () => {
    setCurrentOracle({
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
    
    // Here you would typically make an API call to your LLM service
    // For now just echo back the message
    setTimeout(() => {
      setChatHistory([...newHistory, {
        role: 'assistant',
        content: `I received your message: ${chatInput}`
      }]);
    }, 500);
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
          setCurrentOracle(null);
        }}
        title={currentOracle?.id ? "Edit Oracle" : "New Oracle"}
        size="xl"
        styles={{
          body: {
            padding: '2rem'
          }
        }}
      >
        {currentOracle && (
          <Stack>
            <TextInput
              label="Title"
              value={currentOracle.title}
              onChange={(e) => setCurrentOracle({...currentOracle, title: e.target.value})}
            />
            <TextInput
              label="Description"
              value={currentOracle.description}
              onChange={(e) => setCurrentOracle({...currentOracle, description: e.target.value})}
            />
            <TextInput
              label="Image URL"
              value={currentOracle.imageUrl}
              onChange={(e) => setCurrentOracle({...currentOracle, imageUrl: e.target.value})}
            />
            <Switch
              label="Abstract"
              checked={currentOracle.isAbstract}
              onChange={(e) => setCurrentOracle({...currentOracle, isAbstract: e.currentTarget.checked})}
            />
            <Textarea
              label="Code"
              value={currentOracle.codeContent}
              onChange={(e) => setCurrentOracle({...currentOracle, codeContent: e.target.value})}
              minRows={10}
              autosize
              maxRows={20}
              style={{ flex: 1 }}
            />
            <Textarea
              label="Simulation"
              value={currentOracle.simulationContent}
              onChange={(e) => setCurrentOracle({...currentOracle, simulationContent: e.target.value})}
              minRows={10}
              autosize
              maxRows={20}
              style={{ flex: 1 }}
            />
            <Button onClick={() => handleSaveOracle(currentOracle)}>
              {currentOracle.id ? 'Save Changes' : 'Create Oracle'}
            </Button>
          </Stack>
        )}
      </Modal>

      <Group p="10">
        <Button
          size="sm"
          justify="left"
          leftSection={<IconCrystalBall style={iconStyle} />}
          onClick={handleNewOracle}
        >
          New Tiny Block
        </Button>
      </Group>
      <Container size="80rem" p="xs">
        <SimpleGrid cols={3} spacing="xs">
          {oracles.map((oracle) => (
            <Paper 
              key={oracle.id}
              shadow="sm" 
              p="md"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={500}>{oracle.title}</Text>
                <Group>
                  {oracle.isAbstract && (
                    <Badge color="blue" variant="light">Abstract</Badge>
                  )}
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => handleEditOracle(oracle)}
                  >
                    <IconEdit size={14} />
                  </Button>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">{oracle.description}</Text>
              {oracle.imageUrl && (
                <Image 
                  src={oracle.imageUrl} 
                  alt={oracle.title}
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