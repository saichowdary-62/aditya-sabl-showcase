## 2025-05-23 - Artificial Delay and Code Splitting
**Learning:** The application had a hardcoded 3-second delay on startup using `setTimeout` in `App.tsx`, which was a major performance bottleneck destroying TTI. Also, lack of code splitting meant the entire app bundle (including large pages like StudentPerformance) was loaded upfront.
**Action:** Always inspect entry points (`App.tsx`) for artificial delays. Use `React.lazy` and `Suspense` for all route components to ensure optimal initial load time.
