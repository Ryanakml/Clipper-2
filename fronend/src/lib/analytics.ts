import { z } from "zod";

export const analyticsEventTypes = ["page_view", "click", "scroll_depth"] as const;

export const analyticsEventSchema = z.object({
  occurredAt: z.string().datetime(),
  eventType: z.enum(analyticsEventTypes),
  pagePath: z.string().min(1).max(2048),
  pageTitle: z.string().max(512).optional(),
  sessionId: z.string().min(1).max(128),
  visitorId: z.string().min(1).max(128),
  elementLabel: z.string().max(512).optional(),
  elementTarget: z.string().max(2048).optional(),
  elementType: z.string().max(128).optional(),
  scrollPercent: z.number().int().min(0).max(100).optional(),
  deviceType: z.string().max(64).optional(),
  browserName: z.string().max(128).optional(),
  osName: z.string().max(128).optional(),
  viewportWidth: z.number().int().min(0).max(10000).optional(),
  viewportHeight: z.number().int().min(0).max(10000).optional(),
  language: z.string().max(64).optional(),
  referrer: z.string().max(2048).optional(),
  userAgent: z.string().max(1024).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
