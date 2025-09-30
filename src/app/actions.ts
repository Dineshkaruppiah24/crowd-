// src/app/actions.ts
'use server';

import {
  suggestEvacuationRoutes,
  type SuggestEvacuationRoutesInput,
  type SuggestEvacuationRoutesOutput,
} from '@/ai/flows/suggest-evacuation-routes';

export async function getEvacuationRoutes(
  input: SuggestEvacuationRoutesInput
): Promise<SuggestEvacuationRoutesOutput> {
  try {
    const output = await suggestEvacuationRoutes(input);
    return output;
  } catch (error) {
    console.error('Error getting evacuation routes:', error);
    throw new Error('Failed to get evacuation routes from AI.');
  }
}
