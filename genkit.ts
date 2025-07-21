import { defineFlow, z } from '@genkit-ai/flow';
import { defineConfig } from '@genkit-ai/core';

defineConfig({
  ...
})
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.object({ name: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Hello ${input.name}!`;
  }
);
