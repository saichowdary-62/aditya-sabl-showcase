## 2024-05-23 - Artificial Delays and Route Splitting
**Learning:** The codebase contained an explicit artificial delay (`setTimeout` for 3s) in `App.tsx` to simulate loading. This severely impacted Time to Interactive.
**Action:** Always check `App.tsx` for artificial delays before optimizing other parts. Also, all routes were statically imported, bloating the initial bundle. Route-based code splitting using `React.lazy` is a high-impact optimization here.
