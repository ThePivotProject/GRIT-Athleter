# GRIT Training Page — GitHub Deploy

## What to upload to GitHub
Upload this whole folder, keeping the files together:
- `index.html` — the whole app
- `background.jpg` — background image, shown at 85% transparency (opacity 0.15)
- `supabase.sql` — run once in Supabase (see below)
- `manifest.webmanifest` + `icon-192.png` + `icon-512.png` — makes it saveable like an app on iPhone/Android

Do NOT rename `background.jpg` — `index.html` loads it with `url('background.jpg')`.
If you put the files in a subfolder, keep them in the SAME folder together.

## Deploy on GitHub Pages
1. GitHub -> New repo (e.g. `grit-training`) -> Upload files -> upload these 3 files -> Commit
2. Repo -> Settings -> Pages
3. Source: Deploy from a branch -> Branch: `main` -> Folder: `/ (root)` -> Save
4. Open the Pages URL GitHub gives you (e.g. `https://YOUR-USERNAME.github.io/grit-training/`)

## Supabase — what to enter
1. Supabase Dashboard -> SQL Editor -> New query
2. Paste the ENTIRE contents of `supabase.sql` -> Run
   - Creates `grit_training` (athlete_id, sections)
   - Creates `grit_athletes` (id, name, session, pin)
   - Turns on RLS with an allow-all policy for `anon`
   - Turns on Realtime for both tables
3. Supabase Dashboard -> Settings -> API -> copy:
   - Project URL — e.g. `https://xyz.supabase.co`
   - `anon public` key — NOT the service_role key
4. Open the deployed page -> header -> **Coach** button (top right)
   -> paste Project URL + anon key -> they save on that device.

## Notes
- Background: 85% transparent = `opacity: 0.15` on the `.grit-bg` layer in `index.html`.
  To make it stronger/weaker, change `opacity:0.15` (0 = invisible, 1 = full).
- Athlete names + sessions in the dropdown come from the Google Calendar snapshot
  baked into `index.html`. To refresh after calendar changes, ask for a calendar resync.
- PINs: athlete sets their 4-digit PIN on first sign-in. Coach can clear a PIN
  from the Coach panel. Do not use a PIN used anywhere else.

## Mobile / iPhone + Android
- The site is formatted phone-first: full-width inputs, 44px tap targets, no zoom when tapping a field, safe-area padding.
- On the Athletes page, under the sign-in box, there are two small, non-invasive buttons:
  - **Share** — opens the phone's system share sheet, or copies the link if share isn't available.
  - **Save to Phone** — shows the exact steps: iPhone: Share -> Add to Home Screen. Android: browser menu -> Add to Home Screen / Install app.
- After saving to the home screen, GRIT opens full-screen like an app (standalone display, orange G icon).

## Live updates
- The page checks for a newer version when it opens, when it comes back to the foreground, and every 60 seconds.
- If a newer version is on GitHub, it reloads automatically — athletes always get the latest version when they tap the app.
- To ship an update: upload the new `index.html`, then bump the `grit-version` meta in `<head>` (e.g. `2026-11-11-v6`). That version change is what triggers everyone’s app to refresh.
- Note: link-preview images (the icon in Messages / share sheets) are cached by iMessage / WhatsApp for a while — the icon itself won’t change, so that’s fine.

## Share = icon only
- Share sends only `{title:"GRIT", url}` — no text blob.
- Link preview in Messages / WhatsApp / etc. is just the orange G icon (`og:image` = `icon-512.png`), title "GRIT", no description.
- Note: iMessage/WhatsApp cache link previews for a while. If you tested an old share before this fix, the old preview may stick on that thread until their cache clears — a fresh thread / new link will show the icon-only preview.

## Live updates
- Page checks for a newer `grit-version` on open, on foreground/focus, and every 60 seconds. If newer, it reloads automatically.
- To ship an update: upload new `index.html`, bump `grit-version` in `<head>` (now `2026-11-11-v6` -> next `v6`, etc.).
