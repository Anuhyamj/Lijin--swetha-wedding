# Connect your wedding RSVP

Your invitation is a private preview. Nothing is sent or saved until the RSVP is connected.

Your private sheet: https://docs.google.com/spreadsheets/d/1-e-sOEdc0_ygY8-ieLOpwLlG45iszFtJEL3B6RkLiVg/edit

1. Open the sheet. Click **Extensions → Apps Script**.
2. Click **Code.gs** on the left. Replace its contents with the supplied `backend/Code.gs`. Click **Save**.
3. Choose **setup** in the function menu at the top, then click **Run**. Approve Google's permissions for your own account. This creates a secret once and connects the existing `RSVPs` tab. Keep this sheet private; do not change its sharing.
4. Click **Deploy → New deployment**. Click the gear and choose **Web app**.
5. Set **Execute as: Me**. Set **Who has access: Anyone** (not “Anyone with Google account”). This allows guests to send replies; it does not share your sheet.
6. Click **Deploy**, approve permissions if prompted, and copy the **Web app URL** ending in `/exec`.
7. Send me that `/exec` link. I will put it in `VITE_RSVP_ENDPOINT` and rebuild the preview. The secret stays in Apps Script; never put it in the website.
8. Open the `/exec` link in a browser. The status should include `"ready":true` and `"secret":true`.

The website sends JSON as `text/plain`. Guests receive a private edit link after a successful reply. Anyone holding that link can read or change that reply, so guests should keep it private. No guest list is exposed.

A private preview may block calls to Google. After the approved website is deployed, we must test one real reply, edit it through its private link, and check the same row in the sheet. Local checks are not proof of a live connection.

## After changing the script
Click **Deploy → Manage deployments → pencil icon → Version → New version → Deploy**. Keep the same `/exec` address.

## Later, after you say “approved”
We will create a private GitHub repository, connect that repository to Vercel, choose **Vite**, and add the `/exec` address as `VITE_RSVP_ENDPOINT`. We will set `VITE_SITE_URL` to your chosen final address, turn `showPlaceholders` off, and remove the preview `noindex` tag if you want search visibility. Future commits will redeploy to the same address. No Vercel Drop or built-folder uploads.

All editable names, event details, texts, photos, section order and RSVP settings are in `src/config/wedding.ts`. Both celebrations use IST (UTC +05:30). The ceremony is 28 December 2026, 10:00–10:30 AM. The reception is 29 December 2026, 6:00–10:00 PM.

## Local developer commands
`npm install`, then `npm run dev`. Run `npm run check`, `npm test`, and `npm run build` before deployment. Vite's base is `./`. Keep `.env` for the private repository; keep secrets and local overrides in ignored `.env.local`. The RSVP signing secret belongs only in Script Properties.
