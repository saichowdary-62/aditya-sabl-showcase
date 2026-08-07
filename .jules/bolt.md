## 2025-05-21 - Artificial Delays in Loading State
**Learning:** Found an artificial 3-second delay (`setTimeout`) in `App.tsx` intended to show a loading screen. This directly degrades User Experience and Time to Interactive (TTI).
**Action:** Always check for artificial delays in loading states (`setTimeout`) when optimizing initial load. Real loading states should be driven by actual data fetching or resource loading (like `Suspense`), not arbitrary timers.
