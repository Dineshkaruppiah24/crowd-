'use server';

/**
 * @fileOverview An AI agent for handling SOS alerts.
 *
 * - sendSosAlert - A function that handles the SOS alert process.
 * - SendSosAlertInput - The input type for the sendSosAlert function.
 * - SendSosAlertOutput - The return type for the sendSosAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EmergencyContactSchema = z.object({
  name: z.string(),
  relation: z.string(),
  phone: z.string(),
});

const SendSosAlertInputSchema = z.object({
  currentLocation: z
    .string()
    .describe(
      "The current GPS coordinates of the user, e.g., '34.0522,-118.2437'."
    ),
  emergencyContacts: z
    .array(EmergencyContactSchema)
    .describe('A list of emergency contacts to notify.'),
});

export type SendSosAlertInput = z.infer<typeof SendSosAlertInputSchema>;

const SendSosAlertOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe(
      'A confirmation message to be shown to the user, including actions taken.'
    ),
});

export type SendSosAlertOutput = z.infer<typeof SendSosAlertOutputSchema>;

export async function sendSosAlert(
  input: SendSosAlertInput
): Promise<SendSosAlertOutput> {
  return sendSosAlertFlow(input);
}

const sendSosAlertPrompt = ai.definePrompt({
  name: 'sendSosAlertPrompt',
  input: { schema: SendSosAlertInputSchema },
  output: { schema: SendSosAlertOutputSchema },
  prompt: `You are an AI emergency dispatcher. An SOS alert has been triggered.

User's Current Location: {{{currentLocation}}}
User's Emergency Contacts:
{{#each emergencyContacts}}
- Name: {{this.name}}, Relation: {{this.relation}}, Phone: {{this.phone}}
{{/each}}

Your tasks are:
1.  Formulate a message to send to the nearest police station, providing the user's location and requesting immediate assistance.
2.  Formulate a message to send to each of the user's emergency contacts, informing them of the situation and the user's location.
3.  Generate a confirmation message for the user that summarizes the actions you have taken. The message should be reassuring and clear.

Example Confirmation Message: "SOS alert sent. Emergency services at the nearest police station have been notified of your location. Your emergency contacts [Contact Name 1], [Contact Name 2] have also been alerted."

Generate the user-facing confirmation message.
`,
});

const sendSosAlertFlow = ai.defineFlow(
  {
    name: 'sendSosAlertFlow',
    inputSchema: SendSosAlertInputSchema,
    outputSchema: SendSosAlertOutputSchema,
  },
  async (input) => {
    // In a real-world application, this is where you would add logic
    // to find the nearest police station and send SMS/calls to contacts.
    // For this simulation, we will rely on the AI to generate the confirmation.
    const { output } = await sendSosAlertPrompt(input);
    return output!;
  }
);
