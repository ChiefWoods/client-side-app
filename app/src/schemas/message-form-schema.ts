import { z } from "zod";

export const messageFormSchema = z.object({
  message: z
    .string()
    .min(1, {
      message: "Message cannot be empty."
    })
    .max(256, {
      message: "Message cannot exceed 256 characters."
    })
});