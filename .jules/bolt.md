## 2025-05-17 - App.tsx Optimization
**Learning:** `setTimeout` was used to simulate a 3-second loading delay in `App.tsx`. This is an anti-pattern that degrades user experience.
**Action:** Removed the artificial delay and replaced it with real `Suspense`-based loading.

## 2025-05-17 - Code Splitting
**Learning:** Routes were imported statically, causing a large initial bundle.
**Action:** Implemented `React.lazy` for route components to split code and improve load time.

## 2025-05-17 - Package Lock Noise
**Learning:** `npm install` in this environment can cause massive diffs in `package-lock.json` due to version/structure resolution differences.
**Action:** Always verify `package-lock.json` before committing. If huge changes appear without `package.json` modifications, revert `package-lock.json` using `git checkout`.
