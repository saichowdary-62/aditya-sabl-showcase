# Bolt's Journal

## 2025-05-20 - Artificial Delay Anti-Pattern
**Learning:** Found an intentional 3-second delay (`setTimeout`) in `App.tsx` masquerading as a loading state. This is a severe anti-pattern that directly degrades user experience by blocking interaction for no reason.
**Action:** Always check root components for `setTimeout` or artificial blocking logic. Real loading states (like `Suspense`) should be used instead of hardcoded timers.
