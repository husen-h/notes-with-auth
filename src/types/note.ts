import { z } from "zod";

export const noteFormSchema = z.object({
  title: z.string().min(1, "Enter title"),
  content: z.string().min(1, "Enter content"),
});

export type NoteFormDataType = z.infer<typeof noteFormSchema>;
