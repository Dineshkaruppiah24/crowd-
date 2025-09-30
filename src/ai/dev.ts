import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-evacuation-routes.ts';
import '@/ai/flows/send-sos-alert.ts';
import '@/ai/flows/broadcast-mesh-alert.ts';
