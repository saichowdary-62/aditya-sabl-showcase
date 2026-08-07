## 2024-05-22 - [Code Splitting PDF Libs]
**Learning:** `jspdf` and `jspdf-autotable` are large dependencies (~450kB combined). Importing them statically in a component bloats the initial bundle even if the functionality (download) is rarely used.
**Action:** Always prefer dynamic imports (`await import(...)`) for large, interaction-driven dependencies. Use `Promise.all` to parallelize multiple dynamic imports.
