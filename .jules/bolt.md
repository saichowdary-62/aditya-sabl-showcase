## 2024-05-24 - Huge Bundle Size in StudentPerformance
**Learning:** `StudentPerformance.tsx` is 841kB because it imports `jsPDF` and `jspdf-autotable` statically. This is a massive part of the bundle.
**Action:** In future, refactor `StudentPerformance` to dynamically import `jsPDF` only when the user clicks the download button. For now, code splitting `App.tsx` isolates this cost to only that route.
