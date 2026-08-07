## 2025-05-18 - Artificial Delay Anti-Pattern
**Learning:** Found a 3000ms `setTimeout` in `App.tsx` forcing a loading screen. This destroys TTI/FCP metrics.
**Action:** Always scan root components for artificial delays. Replace with `Suspense` or real data loading states.

## 2025-05-18 - Route Splitting
**Learning:** Heavy libraries like `recharts` and `jspdf` were bundled in the main chunk because pages using them (`StudentPerformance`) were statically imported in `App.tsx`.
**Action:** Use `React.lazy` for all page routes to isolate heavy dependencies to their specific chunks.
