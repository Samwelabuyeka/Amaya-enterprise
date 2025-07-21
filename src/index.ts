import { configureGenkit } from '@genkit-ai/core';
import { defineFlow } from '@genkit-ai/flow';
import { localServer } from '@genkit-ai/flow/server';

configureGenkit({
  plugins: [],
  logLevel: 'debug',
  enableTracingAndMetrics: false,
});

const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: {
      name: 'string',
    },
    outputSchema: {
      greeting: 'string',
    },
  },
  async ({ name }) => {
    return { greeting: `Hello, ${name}!` };
  }
);

localServer();
