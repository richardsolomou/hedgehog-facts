import { GoogleGenAI } from "@posthog/ai";
import { createServerFn } from "@tanstack/react-start";
import { PostHog } from "posthog-node";

const MODEL = "gemini-2.5-flash-lite";
const POSTHOG_TEAM_ID = "280346";
const PROMPT_NAME = "hedgehog-facts";

async function getPromptFromPostHog(): Promise<string> {
  const response = await fetch(
    `https://app.posthog.com/api/environments/${POSTHOG_TEAM_ID}/llm_prompts/name/${PROMPT_NAME}/`,
    {
      headers: {
        Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch prompt: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prompt;
}

export const getHedgehogFact = createServerFn({ method: "GET" }).handler(
  async () => {
    const phClient = new PostHog(process.env.VITE_POSTHOG_KEY || "", {
      host: "https://us.i.posthog.com",
    });

    const client = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
      posthog: phClient,
    });

    try {
      const prompt = await getPromptFromPostHog();

      const response = await client.models.generateContent({
        model: MODEL,
        contents: prompt,
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
