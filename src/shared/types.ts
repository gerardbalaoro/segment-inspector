import { z } from 'zod';

export const RequestSentMessage = z.object({
  id: z.string(),
  url: z.string(),
  tabId: z.number(),
  method: z.union([z.string(), z.enum(['POST', 'GET', 'PUT', 'PATCH', 'DELETE'])]),
  body: z.string(),
});

export const RequestDoneMessage = z.object({
  id: z.string(),
  error: z.optional(z.string()),
  code: z.number(),
  timestamp: z.string(),
  tabId: z.number(),
});

export type RequestSentMessage = z.infer<typeof RequestSentMessage>;

export type RequestDoneMessage = z.infer<typeof RequestDoneMessage>;
