import { z } from "zod";

export const messageSchema = z.object({
  message: z.string().min(1, {
    message: "Message cannot be empty."
  })
});

export const chatroomFormSchema = z.object({
  chatroom: z
    .string()
    .min(1, {
      message: "Chatroom address cannot be empty."
    })
});
