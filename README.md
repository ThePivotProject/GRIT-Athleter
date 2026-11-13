# GRIT - Deploy

Upload ALL files in this folder to the root of your GitHub repo. No subfolders.

## Files
- index.html - the whole GRIT site
- background.jpg - collage background on every page (70% + vignette)
- manifest.webmanifest - installable app name/icon/theme
- icon-192.png / icon-512.png - install icons
- apple-touch-icon.png - iPhone home-screen icon
- favicon-32.png - browser tab icon
- sw.js - service worker (caches icons/background only, never the HTML)
- .nojekyll - serve files as-is on GitHub Pages

## GitHub Pages
Repo > Settings > Pages > Source: Deploy from a branch > Branch: main, Folder: / (root) > Save.
Open the Pages URL GitHub gives you.

## Link preview image
After you deploy, in index.html replace the og:image line with your real URL, e.g.
  <meta property="og:image" content="https://YOURUSERNAME.github.io/grit/icon-512.png">
Then re-upload index.html. iMessage caches previews - test with a fresh link if an old preview still shows.

## Updating later
Replace index.html in the repo with a new version from this same clean folder. Never mix files from older zips - the numbered copies (index_1.html, etc.) are duplicates, not deploys.
