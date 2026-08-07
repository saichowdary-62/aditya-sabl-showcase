## 2025-02-18 - Artificial Delays and Bundle Size
**Learning:** The application contained a deliberate 3-second `setTimeout` delay in `App.tsx` simulating a loading state, which is a major anti-pattern. Also, `StudentPerformance` component is extremely large (~841kB), likely due to `recharts` and `html2canvas` being bundled eagerly.
**Action:** Always check `App.tsx` for artificial delays. Use route-based code splitting (`React.lazy`) to isolate heavy components like `StudentPerformance` from the main bundle.
