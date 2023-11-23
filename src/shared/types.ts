import { z } from 'zod';

export const RequestMessage = z.object({
  id: z.string(),
  url: z.string(),
  tabId: z.number(),
  method: z.union([z.string(), z.enum(['POST', 'GET', 'PUT', 'PATCH', 'DELETE'])]),
  body: z.string(),
});

export const ResponseMessage = z.object({
  id: z.string(),
  error: z.optional(z.string()),
  code: z.number(),
  timestamp: z.string(),
  tabId: z.number(),
});

export type RequestMessage = z.infer<typeof RequestMessage>;

export type ResponseMessage = z.infer<typeof ResponseMessage>;
