## 2025-02-18 - Artificial Delays and Code Splitting
**Learning:** Found an artificial 3-second delay masking the initial load. Code splitting with `React.lazy` is a better solution for bundle size than masking the load time with a loader.
**Action:** Always check `App.tsx` for artificial delays and eager imports.
