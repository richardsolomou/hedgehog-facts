import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getHedgehogFact } from "~/lib/ai";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const [fact, setFact] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchFact = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHedgehogFact();
      setFact(result.fact);
    } catch (err) {
      console.error("Failed to fetch fact:", err);
      setError("Failed to fetch fact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    fetchFact();
  }, [fetchFact]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#1d1f27] px-6">
      <main className="max-w-lg text-center">
        <div className="mb-8 text-6xl">🦔</div>

        <h1 className="mb-6 font-bold text-3xl text-white">Hedgehog Facts</h1>

        <div className="flex h-[6lh] items-center justify-center">
          {isLoading && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F9BD2B]/30 border-t-[#F9BD2B]" />
          )}
          {!isLoading && error && (
            <p className="text-lg text-red-400">{error}</p>
          )}
          {!(isLoading || error) && (
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

      <footer className="absolute bottom-6 inline-flex flex-wrap items-center justify-center gap-1 text-center text-sm text-zinc-400">
        Made with ❤️ by{" "}
        <a
          className="inline-flex items-center gap-1 font-medium underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-100 hover:decoration-zinc-400"
          href="https://solomou.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="Richard Solomou"
            className="size-5 rounded-full"
            height={20}
            src="https://github.com/richardsolomou.png"
            width={20}
          />
          @richardsolomou
        </a>
      </footer>
    </div>
  );
}
