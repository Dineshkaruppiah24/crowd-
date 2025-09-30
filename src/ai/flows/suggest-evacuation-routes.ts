// src/ai/flows/suggest-evacuation-routes.ts
'use server';

/**
 * @fileOverview An AI agent for suggesting safe evacuation routes based on real-time crowd density.
 *
 * - suggestEvacuationRoutes - A function that suggests the safest evacuation routes.
 * - SuggestEvacuationRoutesInput - The input type for the suggestEvacuationRoutes function.
 * - SuggestEvacuationRoutesOutput - The return type for the suggestEvacuationRoutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEvacuationRoutesInputSchema = z.object({
  currentLocation: z
    .string()
    .describe(
      'The current GPS coordinates of the user, e.g., \'34.0522,-118.2437\'.'
    ),
  destination: z
    .string()
    .optional()
    .describe(
      'The desired destination GPS coordinates of the user, e.g., \'34.0522,-118.2437\'. If not provided, suggest routes away from danger.'
    ),
  crowdDensityData: z
    .string()
    .describe(
      'Real-time data about crowd density in the surrounding area.  A JSON array of objects, each containing a \'location\' (GPS coordinates) and a \'density\' (number of people) field.'
    ),
  incidentDescription: z
    .string()
    .describe('A description of the incident that is causing the evacuation.'),
});

export type SuggestEvacuationRoutesInput = z.infer<
  typeof SuggestEvacuationRoutesInputSchema
>;

const SuggestEvacuationRoutesOutputSchema = z.object({
  safeRoutes: z
    .array(z.string())
    .describe(
      'A list of suggested evacuation routes, described in natural language, ordered from safest to least safe. Each route should include estimated time and distance.'
    ),
  crowdDensityMapImageUrl: z
    .string()
    .optional()
    .describe(
      'A data URI of an image visualizing the crowd density in the area, highlighting safer routes.'
    ),
});

export type SuggestEvacuationRoutesOutput = z.infer<
  typeof SuggestEvacuationRoutesOutputSchema
>;

export async function suggestEvacuationRoutes(
  input: SuggestEvacuationRoutesInput
): Promise<SuggestEvacuationRoutesOutput> {
  return suggestEvacuationRoutesFlow(input);
}

const suggestEvacuationRoutesPrompt = ai.definePrompt({
  name: 'suggestEvacuationRoutesPrompt',
  input: {schema: SuggestEvacuationRoutesInputSchema},
  output: {schema: SuggestEvacuationRoutesOutputSchema},
  prompt: `You are an AI assistant designed to provide safe evacuation routes to users during emergencies.

You will be given the user's current location, incident description, and real-time crowd density data. Your goal is to suggest the safest evacuation routes to the user.

Current Location: {{{currentLocation}}}
Destination (if provided): {{{destination}}}
Incident Description: {{{incidentDescription}}}
Crowd Density Data: {{{crowdDensityData}}}

Consider the following factors when suggesting routes:

- Crowd density: Suggest routes that avoid areas with high crowd density.
- Distance: Suggest routes that are as short as possible.
- Safety: Suggest routes that are generally considered safe (e.g., well-lit areas, main roads).

Output the routes in natural language, ordered from safest to least safe. Each route should include estimated time and distance. Do not include routes that would lead the user into greater danger.

If possible, generate a crowd density map image highlighting safer routes. Otherwise, return null for the crowdDensityMapImageUrl field.
`,
});

const suggestEvacuationRoutesFlow = ai.defineFlow(
  {
    name: 'suggestEvacuationRoutesFlow',
    inputSchema: SuggestEvacuationRoutesInputSchema,
    outputSchema: SuggestEvacuationRoutesOutputSchema,
  },
  async input => {
    const {output} = await suggestEvacuationRoutesPrompt(input);
    return output!;
  }
);
