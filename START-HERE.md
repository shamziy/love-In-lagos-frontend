# LATEST: 200 more 20 Questions questions

The bank grows from 500 to **700** questions: 40 new in each category (Romantic, Cheeky, Curiosity, Teaser, Fun), all get-to-know-you or just fun. The full list is in `NEW-QUESTIONS.md`.

**Safe by design:** the new ones are added at the very end (ids 500 to 699). Questions 0 to 499 keep exactly the same numbers and wording, so games in progress and answers already saved keep showing the right question. I checked this by comparing the old and new bank.

| | What to do |
|---|---|
| Frontend (GitHub Pages) | Upload `js/questions.js` (and `js/connect.js`, demo mode only). Nothing breaks if you upload only this. |
| Render backend | **One small change in your main server** (it was not in the zip, so I could not make it): wherever it picks a game's 20 questions it uses the number **500** as the size of the pool. Change that to **700**. Look in the games code for `500`, for example `Array(500)`, `Math.random()*500`, or `500 - used`. Also change any check that rejects a question id of 500 or more. Keep the order and numbering untouched. |

Until that server number is changed, your live site keeps working exactly as before and simply never picks the new ones, because the server chooses which question number each game uses and the website only turns the number into text. Once the server says 700, they start appearing on their own, with no further website change. Send me your main server file and I will make that edit for you.

---

# Love in Lagos: autosave, bigger economy, 3 gists a day, change-question (update)

## What changed
1. **Profile autosave.** The "Save profile" button is gone. Username, About me, Area and Favourite spot save by themselves a moment after you stop typing (a small "Saving… / ✓ Saved" note sits beside "About you"). Rapid typing sends one request with the latest text, an older save can never overwrite a newer edit, edits are saved when you leave the page or log out, and a failed save shows a message (with Retry when it is a connection problem). Interests, photo and bitmoji already saved instantly and still do.
2. **Outfit shop:** every outfit now costs at least 1,000 XP (Ankara shirt 1,000 · Fila cap 1,000 · Hoodie 1,200 · Suit & tie 1,500 · Gold chain 1,800 · Gele 2,000 · Agbada 2,500 · Crown 5,000).
3. **Gifts:** daily limit raised from 100 to 10,000 XP. Gift buttons are now 10, 25, 50, 100, 500, 1000 so the limit can actually be reached.
4. **Gists:** your own gists now show inside the Amebo card, under the Next gist / Drop buttons and under "Your gist is live", each with its Delete button right beside it.
5. **3 gists a day** instead of 1 (deleting a gist does not give the slot back).
6. **20 Questions:** a small round pink button (↻) sits just beside "Ask it 👉" and swaps the current question for a fresh one before you ask it.

## What to upload, and what is NOT in this zip
| Change | Frontend (GitHub Pages) | Backend (Render) |
|---|---|---|
| 1 Autosave | `js/app.js`, `css/style.css` | nothing |
| 4 Gists under Next gist | `js/amebo.js`, `css/style.css` | nothing |
| 5 Three gists a day | `js/amebo-core.js` (demo) | **redeploy `BACKEND-ADDON/amebo-core.cjs`** (replace the old file, same name). Until then the live site still allows 1 a day |
| 2 Outfit prices | `js/data.js` (demo only) | **your main server's shop price list must change too** |
| 3 Gift limit | `js/app.js`, `js/connect.js` (demo) | **your main server's gift limit (100 per day) and allowed amounts must change too** |
| 6 Change question | `js/app.js`, `css/style.css`, `js/connect.js` (demo) | **your main server needs a new route `POST /api/games/:id/swap`** (rules below). Until then the button shows "needs the latest server update" and nothing breaks |

The main server file (the one with the shop, gifts and games) was not in the zip, so those three server edits are not done. Send me that file and I will make them.

### Rules for the server edits
- Prices: every item at least 1000.
- Gift: allow amounts 10, 25, 50, 100, 500, 1000 and a daily total of 10000 (error text: "You can gift up to 10,000 XP a day").
- `POST /api/games/:id/swap` (demo version is in `js/connect.js`, search for `"swap"`): only the player whose turn it is to ask, only while that question has not been asked yet; replace `qs[i]` with a question not already in this game's 20 and, where possible, not used before by either player; return `{ok:true}`. Question number and turn do not change.

Files changed: `js/app.js`, `js/amebo.js`, `js/amebo-core.js`, `js/connect.js`, `js/data.js`, `css/style.css`, `BACKEND-ADDON/amebo-core.cjs`, `BACKEND-ADDON/test.mjs`. Everything else is unchanged.
