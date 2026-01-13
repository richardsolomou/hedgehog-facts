# Hedgehog Facts

AI-powered hedgehog facts app built with TanStack Start and Google Gemini, with PostHog analytics and prompt management.

## Setup

1. Copy `.env.example` to `.env` and configure the required environment variables:
   ```
   VITE_POSTHOG_KEY=your_posthog_project_api_key
   GOOGLE_API_KEY=your_google_api_key
   POSTHOG_PERSONAL_API_KEY=your_posthog_personal_api_key
   ```

2. Install dependencies and run:
   ```bash
   pnpm install
   pnpm dev
   ```

3. Open http://localhost:3000

## Tech Stack

- TanStack Start (React 19)
- Google Gemini 2.5 Flash Lite via @posthog/ai
- PostHog for analytics and LLM prompt management
- Tailwind CSS
