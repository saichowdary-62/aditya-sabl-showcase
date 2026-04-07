## 2024-05-22 - [Artificial Delays are Performance Killers]
**Learning:** Found an artificial 3000ms `setTimeout` in `src/App.tsx` intended to simulate loading. This directly blocked Time to Interactive (TTI) and is a major anti-pattern. Real loading states (Suspense) are superior.
**Action:** Always grep for `setTimeout` in root components during initial profiling to catch these easy wins.
