import { z } from 'zod';

export const HomeSummarySchema = z.object({
  profile: z.object({
    nickname: z.string().min(1),
    email: z.string().min(1),
  }),
  starCount: z.number().min(0),
  diaryCount: z.number().min(0),
  isDiary: z.boolean(),
  diaryId: z.string().min(1).optional(),
  collectedCount: z.number().min(0),
});

export type HomeSummary = z.infer<typeof HomeSummarySchema>;
