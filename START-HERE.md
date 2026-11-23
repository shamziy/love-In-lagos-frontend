# Reply to a specific message (frontend + backend)
**What it does:** in any chat, a person can answer one particular text, so everyone can see which message the reply is for.
- **Phone:** swipe a message sideways (either direction) and let go, OR press and hold it and tap "Reply" in the little menu (the menu also has "Copy").
- **Computer:** hover a message and click the small ↩ beside it, OR right-click it, OR drag it sideways with the mouse.
- A "Replying to ..." bar appears above the typing box with a ✕ to cancel. Send as normal.
- The reply bubble shows the quoted message at the top (who said it and the text). Tapping the quote jumps back to the original message and highlights it.
- Replies are saved on the server, so both people see them, after refreshes and on any device. Normal messages are unchanged, and the 20 Questions tab is untouched.
- The chat no longer jumps to the bottom while you are reading older messages (it only follows new messages when you are already near the bottom, or right after you send).

**Upload (order matters):**
1. `BACKEND-REPOSITORY/server.mjs` first (replace, then Render redeploys). It adds one empty column to the messages table automatically on start-up (`reply_to`). No existing messages are changed or removed. No new settings.
2. Then the whole `FRONTEND-REPOSITORY` (changed: `index.html`, `js/app.js`, `js/connect.js`, `css/style.css`).
If the website goes live before the server, the reply bar still shows but the quote will not appear in the bubble until the server is updated.
`BACKEND-REPOSITORY/staging-check.mjs` has 5 new checks for replies (run it on a test database as before: `npm run check`).
`index.html` now ends every file name with `?v=reply1` so phones fetch the new files instead of old cached copies.

# Profile-picture unlock, notifications and a pinned chat header
**What was wrong when you tested locally:** the unlock itself worked (after the 100th message the app marked the pair as unlocked), but the pretend people in local demo mode had no profile pictures, so there was nothing to see, and nothing told you it had happened. Also the photo loader gave up for good if its first attempt failed.
**Now:**
- The pretend people have portrait photos, so you can see the unlock at home (`demo` / `demo1234`, chat with amara).
- When the 100th message is sent, BOTH people get a notification (📸 "You and Name can now see each other's profile pictures!"). It appears in the bell list, as a pop-up, and tapping it opens that chat.
- Inside the chat, a notice appears right after the 100th message: "📸 You can now see each other's profile pictures!" It is the same place for both people and stays in the history. It replaces the old banner that used to say "100 messages".
- The picture shows straight away: the person who sends the 100th message sees it at once, and the other person within a few seconds (it does not wait for the next refresh any more). A half-typed message is kept when the picture arrives.
- If a picture can't be fetched, the app tries again later instead of giving up.
- **Pinned chat header:** the back arrow, picture, name, tags and the Messages / 20 Questions tabs stay at the top while you scroll, so you can go back from the bottom of a long chat. The tags now flow in a row so the pinned header stays short.
**Upload:** the whole `FRONTEND-REPOSITORY`, and the new `BACKEND-REPOSITORY/server.mjs` (the notification is created by the server; the page also works with the old server, it just won't show the notification).

# PostgreSQL migration (backend)
`BACKEND-REPOSITORY/server.mjs` now uses PostgreSQL. **Read `BACKEND-REPOSITORY/POSTGRES-SETUP.md` first**; it has the exact Render steps. In short: run the included `staging-check.mjs` on a throwaway free Render database, then create your $6 database, set `DATABASE_URL` and `DEMO=false` on your web service, set the Build Command to `npm install`, and push.
Order matters: put the new website files live first, then switch the backend.
What I verified here, and what I could not: see the summary in chat. The one thing I could not run is a real PostgreSQL, which is exactly what `staging-check.mjs` is for.

# Launch-readiness update: fewer requests (frontend only)
Only `js/app.js` changed (plus `js/connect.js` earlier). Re-upload the website files; the backend is untouched by this step.
The page used to ask the server for updates on a fixed 3-second loop: the home screen reloaded the people list **every 3 seconds**, matches and notifications every 6, a hidden tab kept polling, and an open chat polled every 3 seconds forever. It now uses a scheduler:
- Home screen people list: every 15 s (was 3 s). Matches: every 25 s, or 10 s in Chat (was 6 s). Notifications: every 20 s. XP and presence: every 60 s.
- An open chat is checked every 3 s for a minute after anything happens in it or after you send something, otherwise every 7 s. The game state is checked every 15 s when no game is running.
- Everything slows down after 45 s without touching the screen (4x after 2 minutes), and a tab in the background only checks notifications once a minute.
- Opening a tab, or coming back to the page, refreshes at once.
Measured against your server code, API requests per user per minute: home screen 47 to 10, busy chat 67 to 35, quiet chat 68 to 20, background tab 48 to 0. Messages to a quiet chat still appear within about 3 to 7 seconds; a game invitation within 15 s.

# Running it on your own computer (no backend needed)
Just double-click `FRONTEND-REPOSITORY/index.html` (or serve the folder from localhost). When the page is opened on your computer it no longer waits for the internet or your Render server:
- It first checks for a backend running on your computer (`node server.mjs`, port 3000). If one answers, it uses that.
- Otherwise it switches to **demo mode** (small chip at the bottom left: "Demo mode · pretend people"): pretend people, and everything is saved only in your browser, so nothing touches your real data.
- A ready-made test account is built in: username **demo**, password **demo1234** (15,000 XP, a match with amara, and a live 20 Questions game with the change-question button).
- Add `?demo` to any address to force demo mode, or `?live` to use your real Render server from your computer (for example `index.html?live`).
- Your real website on GitHub Pages is not affected: it still talks to Render directly.
- To start a demo fresh, clear the site's data in your browser (or use a private window).

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
