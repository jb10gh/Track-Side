# 🏗️# Architecture: Sideline Stats V3

- **State Management:** Zustand with `persist` middleware.
- **Timer Engine:** Timestamp-based relative clock (`startTime` + `accumulatedTime`) to prevent drift during backgrounding.
- **Data Model:** Mutable event list supporting inline editing via `id` lookup.
- **Storage:** Local-first via `localStorage` (active) and planned `IndexedDB` (history).
- **PWA:** `vite-plugin-pwa` for offline assets and manifest.
- Frontend: React + Vite
- State Management: (TBD)
- Styling: Tailwind CSS (Pending confirmation)
