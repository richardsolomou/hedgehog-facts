import { GoogleGenAI } from "@posthog/ai";
import { createServerFn } from "@tanstack/react-start";
import { PostHog } from "posthog-node";
import { requireEnv } from "./env";

const MODEL = "gemini-2.5-flash-lite";
const POSTHOG_TEAM_ID = "280346";
const PROMPT_NAME = "hedgehog-facts";

async function getPromptFromPostHog(): Promise<string> {
  const apiKey = requireEnv("POSTHOG_PERSONAL_API_KEY");

  const response = await fetch(
    `https://app.posthog.com/api/environments/${POSTHOG_TEAM_ID}/llm_prompts/name/${PROMPT_NAME}/`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
    const apiKey = requireEnv("GOOGLE_API_KEY");

    const phClient = new PostHog("sTMFPsFhdP1Ssg", {
      host: "https://us.i.posthog.com",
    });

    const client = new GoogleGenAI({
      apiKey,
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
