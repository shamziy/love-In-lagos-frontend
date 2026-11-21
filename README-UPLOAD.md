# Love in Lagos — Frontend update (compact Play Zone)

This folder contains the updated frontend only. The Render backend is not modified and does not need to be redeployed for this UI change.

## What changed
- Added a compact Play Zone card directly **above the Visitors / Recent Visitors heading** on the Corner page.
- Reduced the card height and artwork size so it is a small feature, not a large promotional panel.
- Kept the bottom navigation unchanged: Corner, Daily, Chat and Map.
- The Play Now button opens the existing Tower Stack game in an in-app full-screen overlay.
- Kept `js/config.js` pointed at the existing Render API: `https://love-in-lagos-api.onrender.com`.
- `connect.js` now waits up to about a minute for a sleeping Render server (with a "Waking up the server" notice) instead of hanging, then says why if it gives up.
- Map: the nine place pictures are redrawn with shading and detail (danfo, palm beach, café, disco ball, market stall, gym, suya, arcade cabinet, park with a car).
- NEW Stack Game: built into the website (`js/stack.js`), so it needs no outside page and works on phones, tablets and computers. Tap, click or Space to drop; perfect drops build combos and rebuild width; the sky goes from sunset to night over a Lagos skyline; sound, vibration, best score saved on the device. Players earn XP (1 per floor, up to 30 per run and 60 per day) when the backend has the new `/api/play` route; without it the game still works. To use your old outside game instead, add `window.LIL_GAME_URL = "https://shamziy.github.io/stackgame/";` to `js/config.js`.
- Old iframe launcher (kept only for LIL_GAME_URL): the Stack Game overlay loads with a spinner, sizes itself to the real screen height on phones (iPhone and Android address bars), locks the page behind it, gives the game keyboard focus, and after 10 seconds offers "Open the game in a new tab" and "Try again". There is also an ↗ button in the game header.
- Fixed: the Stack Game overlay header was dark-on-dark with no padding; the Corner illustration had an invalid `preserveAspectRatio` (console errors); the header overflowed on 320px phones; long names were clipped on the shop sign.

## Upload
1. Open your existing `love-In-lagos-frontend` GitHub repository.
2. Upload the **contents** of this folder into the repository root, replacing the matching frontend files.
3. Commit the changes and wait for GitHub Pages to publish.
4. Do not upload a `BACKEND-REPOSITORY` folder or change your Render service for this frontend-only update.

`index.html` must remain at the repository root. Keep the `css/` and `js/` folders and their contents.

## Render connection
`js/config.js` retains the current Render API URL. `js/connect.js` checks the configured Render `/health` endpoint before using the real API. If Render is unavailable, the existing frontend fallback may show demo mode; this update does not alter that behaviour.

## Game integration details
The existing game is loaded from `https://shamziy.github.io/stackgame/` inside an iframe overlay. The game remains hosted separately; its own Best score remains local to that browser/device. Account-linked scores and a shared leaderboard are not included in this change.
