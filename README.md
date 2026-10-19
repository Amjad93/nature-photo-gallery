# Nature: Pick your pics 🌿

A photo gallery that fills itself from email, built **serverless**: no server to
set up, rent or maintain. Anyone emails a photo to the project's Gmail address, an
auto-reply confirms it, and the photo appears on the page.

**Live demo:** https://amjad93.github.io/nature-photo-gallery/

## Serverless architecture

```
 Email with photo ──► Gmail inbox
                          │
                          ▼  (time-driven trigger, every minute)
              Google Apps Script function: processEmails()
                 • saves the image to Google Drive
                 • sends the reply "Thanks for your submission! 📸"
                          │
                          ▼
              Google Apps Script web app: doGet()
                 • API endpoint that returns the photos as JSON
                          │
                          ▼  fetch()
              index.html (Vue 2 + vue-silentbox) on GitHub Pages
```

| Piece | What it does | Serverless service used |
|---|---|---|
| Backend functions | Process emails, reply, expose the API | Google Apps Script (function-as-a-service) |
| Trigger | Runs the email function every minute | Apps Script time-driven trigger |
| API | Returns the gallery as JSON | Apps Script web app (`doGet`) |
| File storage | Stores submitted photos | Google Drive |
| Frontend hosting | Serves the static page | GitHub Pages |

There are no servers to provision, patch or scale. The code runs only when triggered
(a timer or a page request), and everything used is on free tiers.

## Files

- `index.html`: the Vue 2 frontend that fetches the gallery from the API
- `apps-script/Code.gs`: the serverless backend (email handling + JSON API)

## What I learned

- Building and calling a web API (`fetch`, JSON, HTTP redirects)
- Serverless functions, triggers and web app deployments
- Handling email attachments and Google Drive sharing programmatically
- Deploying a static site with GitHub Pages

## Built with

Vue 2, vue-silentbox, Google Apps Script, Gmail, Google Drive, GitHub Pages
