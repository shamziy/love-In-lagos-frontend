# Love in Lagos: update pack

## Upload these (replace the old files, same names)
**Frontend (your GitHub Pages repo):** the whole `FRONTEND-REPOSITORY` folder. Changed: `index.html`, `css/style.css`, `js/app.js`, `js/auth.js`, `js/connect.js`, `js/map.js`, `js/data.js`, `js/questions.js`. New: `js/scenes2.js`, `js/camera.js`, `js/tagwhy.js`.
**Backend (your Render repo):** `BACKEND-REPOSITORY/server.mjs` (replace). Nothing else changes; no new settings or environment variables. Render redeploys when you push it.

## What is new
1. **Camera:** the round 📷 circle itself is the camera button, at sign-up and on the profile page (there is no separate "Take photo" button). Tap it: the camera opens with a live preview, you tap the round button, then Retake or Use this photo. It goes through the same image check, resize and save as Choose photo. If the camera is blocked, missing, or the browser can't open it, it says why and offers "Use phone camera" or "Choose a photo".
2. **Faster start after sign-in / sign-up:** the app used to check the server, then load your profile, then your matches, one after another, before drawing anything, with a blank screen while a sleeping Render server woke up. Now the server is nudged awake the moment the page opens (while you type), the profile and matches load together, a splash shows instantly, and the fonts no longer block the first paint. In my test with a slow network (0.7 s per request) startup went from 2.4 s to 0.9 s. A sleeping free-plan Render server still needs its wake-up time on the very first request: nothing in the website can remove that. Opening the site wakes it; a paid Render plan or a free uptime pinger keeps it awake.
3. **Tags in chat are tappable:** the match tag, Talking stage and Photos visible now open a short explanation: your score, what you two have in common (from both profiles), and all four tags. It shows no message counts or day rules.
4. **Map and places:** every one of the 9 places is redrawn with lighting, depth and detail, and every one now has live activity (like the park): people walking, dancing, jogging, swimming and playing, plus things moving in the pictures (traffic, waves, a horse and a kite, steam, flames and smoke, a spinning disco ball, treadmills, swinging bags, a rolling bowling ball, a moving claw). A small caption under each place name changes every few seconds. The Map tab has a new illustrated base map with a lagoon, bridges, parks and beach, moving cars and boats, and a live marker on every pin.
5. **Backend (`server.mjs`):** outfits cost at least 1,000 XP (people keep what they already own); gifts allow 10, 25, 50, 100, 500, 1,000 and 10,000 XP a day; 3 gists a day; new route `POST /api/games/:id/swap` for the change-question button; question pool 700 (the 200 new questions).

## Good to know
- **Database upgrade is automatic and safe.** The old gist table allowed one post per person per day. On start the server rebuilds it once, keeping every row. If it ever fails it logs "amebo_posted migration failed" and keeps running.
- **`BACKEND-ADDON` is no longer needed.** Your live server has Amebo built into `server.mjs`, so those files were never used by it. I left them out.
- **Because a live address is set in `js/config.js`, the website now uses it directly.** Before, if the server didn't answer, the site silently switched to pretend-people demo mode. Now it shows the normal error messages / "can't reach the server" screen instead. Leaving `LIL_API` empty still gives demo mode.
- Old website + new server works. New website + old server also works: the new buttons just say they need the latest server update.
- The note "Only visible to others after you exchange 100 messages" is still on the sign-up and profile screens (not changed).
- Your GitHub Pages address for the backend (`shamziy.github.io/love-In-lagos-backend`) is not a server and returns an error; only the Render address is used.

## If the website does not work after you upload it
I loaded this exact pack the way GitHub Pages serves it (inside a repo sub-folder, from a different address than the server) against both your old and new backend, on every screen, and recorded every error: there were none from the website's code. So please check these, they are the usual causes:
1. **`index.html` must sit at the top of the repo**, next to the `css` and `js` folders. Upload the files and folders that are *inside* `FRONTEND-REPOSITORY`, not the `FRONTEND-REPOSITORY` folder itself, or the site ends up at a longer address and the root shows a 404.
2. **All 14 files in `js/` must be uploaded** (three are new: `scenes2.js`, `camera.js`, `tagwhy.js`). A missing one stops the page.
3. **Wait 1 to 2 minutes** after committing (GitHub Pages rebuilds), then do a hard refresh (Ctrl+Shift+R, or clear the site data on a phone).
4. **Render:** after pushing `server.mjs`, open your Render service and check the Deploy log says it is live. The first request after a sleep takes up to a minute.
5. Very old phones (iOS 13 or older) cannot run the original site either, because of code that was already in `scenes.js` and `auth.js`.
If it is still broken, tell me what you see (a blank page, a 404, or an error message) and, on a computer, press F12, open the Console tab, and send me the red lines.
