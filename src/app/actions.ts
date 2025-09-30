// src/app/actions.ts
'use server';

import {
  suggestEvacuationRoutes,
  type SuggestEvacuationRoutesInput,
  type SuggestEvacuationRoutesOutput,
} from '@/ai/flows/suggest-evacuation-routes';
import {
  sendSosAlert,
  type SendSosAlertInput,
  type SendSosAlertOutput,
} from '@/ai/flows/send-sos-alert';
import {
  broadcastMeshAlert,
  type BroadcastMeshAlertInput,
  type BroadcastMeshAlertOutput,
} from '@/ai/flows/broadcast-mesh-alert';

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

export async function triggerSosAlert(
  input: SendSosAlertInput
): Promise<SendSosAlertOutput> {
  try {
    const output = await sendSosAlert(input);
    return output;
  } catch (error) {
    console.error('Error triggering SOS alert:', error);
    throw new Error('Failed to trigger SOS alert.');
  }
}

export async function triggerMeshAlert(
  input: BroadcastMeshAlertInput
): Promise<BroadcastMeshAlertOutput> {
  try {
    const output = await broadcastMeshAlert(input);
    return output;
  } catch (error) {
    console.error('Error triggering mesh alert:', error);
    throw new Error('Failed to trigger mesh alert.');
  }
}
