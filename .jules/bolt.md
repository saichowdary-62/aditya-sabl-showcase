## 2024-05-23 - Performance Optimization: Route Splitting & Dynamic Imports
**Learning:** `React.lazy` and `Suspense` are powerful tools for reducing initial bundle size, but they must be implemented carefully with a proper fallback (like `PageLoader`).
**Learning:** Dynamic imports for large libraries like `jspdf` can significantly reduce the weight of components that only use them for specific actions (like "Download PDF"). Destructuring `default` is required when importing these modules dynamically (e.g., `const { default: jsPDF } = await import('jspdf')`).
**Action:** Always check for opportunities to lazy load heavy libraries that are not needed for the initial render.
**Learning:** Artificial delays (e.g., `setTimeout` for loading screens) are detrimental to perceived performance and should be removed in favor of real loading states (like `Suspense`).
