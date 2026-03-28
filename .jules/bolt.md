## 2026-01-14 - Artificial Delays in App.tsx
**Learning:** Found an artificial 3000ms `setTimeout` in `App.tsx` intended to simulate loading, blocking the main thread and TTI.
**Action:** Always check `App.tsx` or main entry points for unnecessary `setTimeout` calls that degrade performance.
