import { GoogleGenAI, Prompts } from "@posthog/ai";
import { createServerFn } from "@tanstack/react-start";
import { PostHog } from "posthog-node";

const MODEL = "gemini-2.5-flash-lite";
const PROMPT_NAME = "creature-facts";

export const getHedgehogFact = createServerFn({ method: "GET" }).handler(
  async () => {
    const phClient = new PostHog(process.env.VITE_POSTHOG_KEY || "", {
      host: "https://us.i.posthog.com",
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY || "",
    });

    const prompts = new Prompts({
      posthog: phClient,
      host: "https://us.i.posthog.com",
    });

    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      posthog: phClient,
    });

    try {
      const template = await prompts.get(PROMPT_NAME, {
        fallback: "Error out.",
      });

      const prompt = prompts.compile(template, {
        creatures: "hedgehogs",
      });

      const response = await client.models.generateContent({
        model: MODEL,
        contents: prompt,
        posthogProperties: {
          $ai_prompt_name: PROMPT_NAME,
        },
      });

      if (!response.text) {
        throw new Error("No response from AI");
      }

      return { fact: response.text };
    } finally {
      await phClient.shutdown();
    }
  }
);
