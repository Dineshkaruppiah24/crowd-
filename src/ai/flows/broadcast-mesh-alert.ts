'use server';

/**
 * @fileOverview An AI agent for simulating a Bluetooth mesh network alert.
 *
 * - broadcastMeshAlert - A function that simulates broadcasting an alert.
 * - BroadcastMeshAlertInput - The input type for the broadcastMeshAlert function.
 * - BroadcastMeshAlertOutput - The return type for the broadcastMeshAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BroadcastMeshAlertInputSchema = z.object({
  currentLocation: z
    .string()
    .describe(
      "The current GPS coordinates of the user broadcasting the alert, e.g., '34.0522,-118.2437'."
    ),
  alertMessage: z
    .string()
    .describe('A short message describing the reason for the alert.'),
});

export type BroadcastMeshAlertInput = z.infer<
  typeof BroadcastMeshAlertInputSchema
>;

const BroadcastMeshAlertOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe(
      'A confirmation message for the user who initiated the broadcast.'
    ),
  receivedAlert: z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
  }),
});

export type BroadcastMeshAlertOutput = z.infer<
  typeof BroadcastMeshAlertOutputSchema
>;

export async function broadcastMeshAlert(
  input: BroadcastMeshAlertInput
): Promise<BroadcastMeshAlertOutput> {
  return broadcastMeshAlertFlow(input);
}

const broadcastMeshAlertPrompt = ai.definePrompt({
  name: 'broadcastMeshAlertPrompt',
  input: { schema: BroadcastMeshAlertInputSchema },
  output: { schema: BroadcastMeshAlertOutputSchema },
  prompt: `You are an AI assistant simulating an emergency mesh network. A user has activated an offline mesh alert.

User's Location: {{{currentLocation}}}
User's Message: "{{{alertMessage}}}"

Your tasks:
1.  Generate a confirmation message for the broadcasting user, confirming their alert has been sent over the mesh network.
2.  Generate an alert notification as it would be received by another user nearby. The received alert should have a title, a descriptive message based on the user's input, and an approximate location (e.g., "Near City Park").

Example Confirmation: "Your mesh alert has been broadcast to nearby CrowdCompass users."
Example Received Alert Title: "High-Priority Mesh Alert"
Example Received Alert Description: "Emergency alert from a nearby user: '{{{alertMessage}}}'. Please be cautious."
Example Received Alert Location: "Near user's location"

Generate the full output object.
`,
});

const broadcastMeshAlertFlow = ai.defineFlow(
  {
    name: 'broadcastMeshAlertFlow',
    inputSchema: BroadcastMeshAlertInputSchema,
    outputSchema: BroadcastMeshAlertOutputSchema,
  },
  async (input) => {
    const { output } = await broadcastMeshAlertPrompt(input);
    return output!;
  }
);
