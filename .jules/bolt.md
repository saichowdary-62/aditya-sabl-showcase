## 2024-05-23 - [Code Splitting & Delay Removal]
**Learning:** Found an artificial 3-second delay in `App.tsx` blocking initial render. Also found monolithic bundle structure. Implemented `React.lazy` + `Suspense` and removed the delay.
**Action:** Always check `App.tsx` or root component for artificial delays or lack of code splitting in React apps.
