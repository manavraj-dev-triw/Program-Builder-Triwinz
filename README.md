# Training Program Factory

A browser-only training program planning app aligned to the product requirements in the PRD. It is designed as a static app for Vercel deployment and can be hosted publicly without a backend.

## Local development

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
```

## Deploy to Vercel

### Option 1: GitHub + Vercel UI
1. Push this repo to GitHub.
2. Import the repository in Vercel.
3. Keep the default framework preset for Vite.
4. Click Deploy.

### Option 2: Vercel CLI
```bash
npm run deploy
```

If you are not logged in yet, Vercel will prompt you to authenticate in the browser.

## Notes

- This is a static frontend, so deployment is simple and public-friendly.
- The app stores project data in-browser unless exported.
- Sensitive cohort exports can be encrypted and redacted as designed in the PRD.
