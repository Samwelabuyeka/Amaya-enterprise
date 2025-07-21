import { defineFunction, ai } from '@genkit-ai/core';
import { generate } from '@genkit-ai/googleai';

export const maya = defineFunction({
  name: 'maya',
  inputSchema: 'string',
  outputSchema: 'string',
  handler: async (input: string): Promise<string> => {
    const result = await generate({
      model: ai.Google('gemini-pro'),
      prompt: input,
    });
    return result.text();
  },
});
