import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { addMessage, getMessages } from "../db";
import { invokeLLM } from "../_core/llm";
import { observable } from "@trpc/server/observable";

const JARVIS_SYSTEM_PROMPT = `You are Jarvis, an advanced AI assistant with a witty, helpful, and sophisticated personality. 
You are always ready to assist with any task, from answering questions to helping with complex problems.
Your responses are concise, intelligent, and delivered with a touch of dry humor.
You maintain a professional yet approachable tone, and you're always eager to help.
Remember: You are Jarvis, and you're here to make the user's life easier.`;

export const chatStreamRouter = router({
  streamMessage: protectedProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .subscription(async ({ ctx, input }) => {
      return observable<{ token: string; done: boolean }>((emit) => {
        (async () => {
          try {
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

            // Call LLM for response
            const response = await invokeLLM({
              messages: messagesWithSystem,
            });

            const assistantContent = typeof response.choices[0]?.message?.content === 'string' 
              ? response.choices[0].message.content 
              : "";

            // Split response into tokens and emit them
            const tokens = assistantContent.split(' ');
            let fullContent = '';
            
            for (const token of tokens) {
              fullContent += (fullContent ? ' ' : '') + token;
              emit.next({ token: token + ' ', done: false });
              // Small delay to simulate streaming effect
              await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Save the full assistant message
            await addMessage(input.conversationId, "assistant", fullContent);

            // Signal completion
            emit.next({ token: '', done: true });
            emit.complete();
          } catch (error) {
            console.error("Streaming error:", error);
            emit.error(error);
          }
        })();
      });
    }),
});
