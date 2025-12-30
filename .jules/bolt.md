## 2024-05-23 - Artificial Delays
**Learning:** Artificial delays like `setTimeout` for loading screens are major performance anti-patterns that degrade perceived performance.
**Action:** Always replace artificial delays with real loading states (like `Suspense` or `isLoading` flags from data fetching libraries).
