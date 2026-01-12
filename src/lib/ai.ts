import { GoogleGenAI } from "@posthog/ai";
import { createServerFn } from "@tanstack/react-start";
import { PostHog } from "posthog-node";

const MODEL = "gemini-2.5-flash-lite";

export const getHedgehogFact = createServerFn({ method: "GET" }).handler(
  async () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    const phClient = new PostHog("sTMFPsFhdP1Ssg", {
      host: "https://us.i.posthog.com",
    });

    const client = new GoogleGenAI({
      apiKey,
      posthog: phClient,
    });

    try {
      const response = await client.models.generateContent({
        model: MODEL,
        contents:
          "Tell me a fun fact about hedgehogs. Keep your response concise and engaging - just one fun fact, no more than 2-3 sentences.",
      });

      const fact =
        response.text ||
        "Hedgehogs have between 5,000 and 7,000 quills on their backs!";

      return { fact };
    } catch (error) {
      console.error("Error fetching hedgehog fact:", error);
      return {
        fact: "Hedgehogs are lactose intolerant, so you should never feed them milk!",
      };
    } finally {
      await phClient.shutdown();
    }
  }
);
