import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { addMessage, getMessages, createConversation, getConversations } from "../db";
import { invokeLLM } from "../_core/llm";

const JARVIS_SYSTEM_PROMPT = `You are Jarvis, an advanced AI assistant with a witty, helpful, and sophisticated personality. 
You are always ready to assist with any task, from answering questions to helping with complex problems.
Your responses are concise, intelligent, and delivered with a touch of dry humor.
You maintain a professional yet approachable tone, and you're always eager to help.
Remember: You are Jarvis, and you're here to make the user's life easier.`;

export const chatRouter = router({
  createConversation: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const title = input.title || "New Conversation";
      const result = await createConversation(ctx.user.id, title);
      return result;
    }),

  getConversations: protectedProcedure
    .query(async ({ ctx }) => {
      return await getConversations(ctx.user.id);
    }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      return await getMessages(input.conversationId);
    }),

  sendMessage: protectedProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Save user message
      await addMessage(input.conversationId, "user", input.content);

      // Get conversation history for context
      const messages = await getMessages(input.conversationId);
      
      // Prepare messages for LLM
      const llmMessages = messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content as string,
      }));

      // Add system prompt
      const messagesWithSystem = [
        { role: "system" as const, content: JARVIS_SYSTEM_PROMPT },
        ...llmMessages,
      ];

      try {
        // Call LLM for response
        const response = await invokeLLM({
          messages: messagesWithSystem,
        });

        const assistantContent = typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : "";

        // Save assistant message
        await addMessage(input.conversationId, "assistant", assistantContent);

        return {
          success: true,
          content: assistantContent,
        };
      } catch (error) {
        console.error("LLM Error:", error);
        throw new Error("Failed to generate response from Jarvis");
      }
    }),
});
