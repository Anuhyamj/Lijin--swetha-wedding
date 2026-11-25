# Lijin & Swetha — Wedding Invitation

Private source repository for the wedding invitation. Vite, React, TypeScript, Tailwind CSS and Motion.

## Local development

Run `npm ci`, then `npm run dev`. Use `npm run build` for the production build and TypeScript checks.

## Content

Edit `src/config/wedding.ts` for names, event details, photos, and invitation text.

## Vercel

Import this private repository, select the Vite preset, and deploy the main branch. Vercel automatically redeploys when main changes. Build command: `npm run build`; output: `dist`.

`VITE_RSVP_ENDPOINT` is the public RSVP web-app endpoint. The RSVP signing secret stays in Google Apps Script, never in this repository. Set `VITE_SITE_URL` to the final public address, or let builds use Vercel’s production URL. See `SETUP.md` for the RSVP setup.
