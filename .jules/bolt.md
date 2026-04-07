# Bolt's Journal

## 2025-05-18 - First Optimization
**Learning:** This codebase contained a deliberate 3-second artificial delay (`setTimeout`) in `App.tsx` solely to show a loading screen. This is a severe anti-pattern that destroys TTI.
**Action:** Always check `App.tsx` or main entry points for artificial delays before diving into complex profiling. "Speed is a feature."

## 2025-05-18 - Test Failures
**Learning:** Pre-existing test failures exist in `src/lib/data-service.test.ts`. Specifically, `year` is expected to be a string but is received as a number in some tests. Also some mocking issues. These are unrelated to my planned changes, but important to note so I don't get blamed for them.
**Action:** Proceed with `App.tsx` changes but document that these failures were pre-existing.
