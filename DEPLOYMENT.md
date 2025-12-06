# Deployment Guide

Your project is now fully configured for automatic deployment to **GitHub Pages**.

## How to Deploy Changes
Whenever you make changes to your code (e.g., updating UI, adding projects), simply run this single command in your terminal:

```bash
npm run deploy
```

## What this command does
1.  **Builds** your Next.js project into a static site (using `next build`).
    -   It respects `basePath: '/portfolio'` and `trailingSlash: true`.
2.  **Deploys** the `out` folder to the `gh-pages` branch on GitHub.
    -   It uses the `-t` flag to ensure the `.nojekyll` file is included, preventing "Broken UI" issues.

## Local Development
To test locally before deploying:
```bash
npm run dev
```
-   Open [http://localhost:3000/portfolio](http://localhost:3000/portfolio)
-   Note: We have configured the app to use `/portfolio` as the base path even locally, so it matches the live site's behavior.

## Troubleshooting
If you see a 404 or broken styles on the live site:
1.  Wait 1-2 minutes (GitHub Pages caches updates).
2.  Perform a **Hard Refresh** (Ctrl+F5).
3.  Ensure you didn't accidentally remove `trailingSlash: true` from `next.config.ts`.
