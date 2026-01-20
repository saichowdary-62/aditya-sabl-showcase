## 2024-05-23 - State Discrepancy in App.tsx
**Learning:** The memory stated that `App.tsx` uses code splitting and that artificial delays were removed. However, the code reveals that `App.tsx` uses static imports for all routes (causing a large main bundle) and still contains a 3-second artificial delay.
**Action:** Trust the code over memory. Future optimizations should prioritize removing the delay and implementing code splitting in `App.tsx`.
