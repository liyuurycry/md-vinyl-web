# MD Vinyl Web

Next.js music player application combining vinyl record visuals with YouTube streaming. Integrates Groq AI for dynamic UI theming and playlist recommendations.

## Features

*   **Visual Modes**: Switchable Vinyl mode with physical animations and 3D Coverflow mode.
*   **AI Integration**: Uses Groq API (Llama 3 model) to analyze song metadata for real-time UI color palette generation and similar song recommendations.
*   **Audio Engine**: Powered by YouTube IFrame API (via react-youtube). Supports background playback and lock screen controls using the Media Session API.
*   **Security**: API keys are transmitted via a Next.js backend proxy to prevent client-side exposure. Keys are stored in local storage.
*   **Interface**: Responsive "Floating Island" design with Tailwind CSS.

## Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v3, Framer Motion
*   **State Management**: Zustand (with persistence)
*   **Audio**: react-youtube
*   **AI**: Groq API

## Installation & Setup

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Start development server**
    ```bash
    npm run dev
    ```
    Access the application at http://localhost:3000

3.  **Configure AI**
    *   Obtain an API Key from the Groq Console.
    *   Click the Settings icon in the application header.
    *   Enter and save the API Key (stored locally in the browser).

## Project Structure

*   `src/app/api/groq/`: Backend proxy for API requests.
*   `src/components/`: UI components (VinylView, CoverflowView, HiddenPlayer).
*   `src/store/`: State management (Zustand).
*   `src/app/page.tsx`: Main application logic.

## Deployment

This project is optimized for deployment on Vercel.
*   Ensure the deployment uses HTTPS (required for Media Session API and background playback features).
*   No server-side environment variables are required for the AI features as the key is provided by the user client-side.

## License

MIT License