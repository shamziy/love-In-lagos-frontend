# Love in Lagos frontend

This folder contains the static website (`index.html`, `css/`, and `js/`). It is published with GitHub Pages.

The API base URL is configured in `js/config.js` and currently points to `https://love-in-lagos-api.onrender.com`. If your Render service URL changes, update `window.LIL_API` there.

To enable GitHub Pages: repository **Settings → Pages → Deploy from a branch → main → /(root)**. Keep the root-level redirect `index.html` in the repository.

## Existing deployment addresses

- Frontend: https://shamziy.github.io/love-In-lagos-frontend/
- Backend source/repository Pages: https://shamziy.github.io/love-In-lagos-backend/
- API base URL (Render): https://love-in-lagos-api.onrender.com

The `window.LIL_API` setting must point to the Render API, not the backend GitHub Pages address.
