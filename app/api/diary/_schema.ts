import { z } from "zod";

export const DiaryCreate = z.object({
  diary_type: z.enum(["star", "worry"]),
  title: z.string().max(200).optional(),
  content: z.string().max(10_000).optional(),
  visibility: z.enum(["private", "unlisted", "public"]).default("private"),
});

export const DiaryUpdate = DiaryCreate.partial();

export type DiaryCreateInput = z.infer<typeof DiaryCreate>;
export type DiaryUpdateInput = z.infer<typeof DiaryUpdate>;
