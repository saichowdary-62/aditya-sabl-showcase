## 2024-05-23 - Artificial Delay Anti-Pattern
**Learning:** I discovered a `setTimeout` loop that artificially delayed the initial page load by 3 seconds. This is a severe anti-pattern that degrades user experience for no technical reason.
**Action:** Always inspect the root component (`App.tsx` or similar) for global loading states that might be hiding such delays. Remove them immediately to improve Time to Interactive.
