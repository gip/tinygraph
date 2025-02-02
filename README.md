# TinyGraph

Low-Complexity Agent Infrastructure

Large Language Models (LLMs) have emerged as powerful tools for translating high-level trading strategies into executable steps. However, there's currently no open specification for defining the basic building blocks these models can use when constructing complex (trading) agents.

TinyGraph is a weekend project that demonstrates how a simple, well-defined specification can enable LLMs to implement trading agents effectively. This proof-of-concept could contribute to the development of standardized agent infrastructure.

Our approach focuses on minimizing complexity while maintaining flexibility, showing that even a lightweight framework can support sophisticated trading logic when combined with LLMs' reasoning capabilities.

At the high level, declaring an agent takes a few lines of code:
```ts
abstract class Oracle extends Agent {
    private /* input */ assetName: string = ''
    private /* input */ every1Minute: boolean = false
    private /* output */ assetPrices: number[] = []
    description: string = 'This oracle returns an array of prices of a given asset.'

    initialize(runtime: Runtime) {
        runtime.agent(this, 'Oracle')
        runtime.in(this, 'assetName', { trigger: false })
        runtime.in(this, 'every1Minute', { trigger: true })
        runtime.out(this, 'assetPrices')
    }

    abstract step(runtime: Runtime): Promise<void>
}
```

Agent can be run locally, deployed to the cloud (Replit), or deployed to a custom server. TinyGraph will take care of the connection between agents. 

Finally, from a high-level goal, a LLM like Claude can create a graph of tiny blocks that implements an agent.

Deployed at https://tinygraph.vercel.app/
