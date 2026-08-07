## 2024-05-23 - Initial Performance Review
**Learning:** The application was artificially delayed by 3 seconds using `setTimeout` on the main entry point, and all routes were eagerly loaded. This created a massive initial bundle and a poor user experience.
**Action:** Removed the artificial delay and implemented `React.lazy` + `Suspense` for route-based code splitting. This ensures users only download the code they need and see the content as soon as it's ready.
