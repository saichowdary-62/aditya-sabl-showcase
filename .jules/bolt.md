## 2025-05-23 - Artificial Delays are Anti-Patterns
**Learning:** I found a `setTimeout` of 3000ms in `App.tsx` that forced a loading screen on every page load, regardless of actual network speed.
**Action:** Always prefer real loading states (like `Suspense` or `isLoading` flags from data fetching) over artificial delays. "Cinematic" loading screens hurt UX and perceived performance.
