## 2024-05-23 - Artificial Delay Anti-Pattern
**Learning:** The application contained an artificial 3-second delay in `App.tsx` using `setTimeout` to simulate loading. This significantly degraded Time to Interactive (TTI).
**Action:** Always check for and remove artificial delays. Replace with real loading states (like `Suspense` or `isLoading` flags).

## 2024-05-23 - Large Libraries in Component Imports
**Learning:** `jspdf` and `jspdf-autotable` were statically imported in `StudentPerformance.tsx`, bloating the bundle even for users who don't use the download feature.
**Action:** Use dynamic imports (`await import(...)`) for large, optional libraries inside the event handler that uses them.
