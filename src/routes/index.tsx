import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getHedgehogFact } from "~/lib/ai";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const [fact, setFact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFact = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getHedgehogFact();
      setFact(result.fact);
    } catch (error) {
      console.error("Failed to fetch fact:", error);
      setFact("Hedgehogs can run up to 4 miles per hour!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFact();
  }, [fetchFact]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#1d1f27] px-6">
      <main className="max-w-lg text-center">
        <div className="mb-8 text-6xl">🦔</div>

        <h1 className="mb-6 font-bold text-3xl text-white">Hedgehog Facts</h1>

        <div className="flex h-[6lh] items-center justify-center">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F9BD2B]/30 border-t-[#F9BD2B]" />
          ) : (
            <p className="line-clamp-4 text-[#C4C4C4] text-lg leading-relaxed">
              {fact}
            </p>
          )}
        </div>

        <button
          className="mt-8 rounded-sm border-2 border-[#a78819] bg-[#F9BD2B] px-4 py-2 font-semibold text-[#1d1f27] text-sm shadow-[0_2px_0_0_#a78819] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#a78819] active:translate-y-0.5 active:shadow-none disabled:opacity-50"
          disabled={isLoading}
          onClick={fetchFact}
          type="button"
        >
          {isLoading ? "Loading..." : "Another fact"}
        </button>
      </main>
    </div>
  );
}
