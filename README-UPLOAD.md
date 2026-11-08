# Love in Lagos — FRONTEND repository

This folder is prepared to be uploaded directly into the ROOT of your existing frontend GitHub repository.

## Upload
1. Open this folder.
2. Select everything inside it (`index.html`, `.nojekyll`, `css/`, `js/`, `.gitignore`, this README).
3. Drag the selected contents into the root of your existing frontend repository on GitHub.
4. Commit the changes.

Do not upload the parent `FRONTEND-REPOSITORY` folder itself. `index.html` must be at the repository root.

## GitHub Pages
Repository → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

## Backend connection
`js/config.js` is already set to the existing Render API:
`https://love-in-lagos-api.onrender.com`

If your Render service has a different URL, update `window.LIL_API` in `js/config.js`.

The frontend is configured to use the updated backend features in this package. Keep all files in `js/`; do not omit or rename individual scripts.
