# Studio Journal (demo site)

A throwaway static site that stands in for a **Presence v3** customer site, so
the Content Studio GitHub publisher can be demonstrated end to end. It is not a
customer site and nothing here is a template customers get.

## What it is

Plain files, no build step, no framework:

- `index.html` + `site.js` list the posts by reading `posts/index.json`.
- `style.css` styles the listing and every published post page.
- `posts/index.json` starts as `[]`; `posts/.gitkeep` keeps the folder in git.

Push it to a GitHub repo and turn on GitHub Pages (Settings > Pages > deploy
from branch `main`, folder `/`), or import it into Vercel as a static project.

## How Content Studio publishes into it

On the Website screen, connect a **GitHub** site with:

- **Public site URL**: where the site is served, e.g. `https://owner.github.io/studio-journal`
- **Repository**: `owner/studio-journal`
- **Branch**: `main`
- **Posts folder**: `posts`
- **Token**: a fine-grained personal access token limited to this repo with
  *Contents: read and write*.

Test the connection, approve a post, and publish (the server needs
`PUBLISH_ENABLED=true`). The worker then makes up to three commits through the
GitHub Contents API:

1. `posts/<slug>/hero.jpg`: the post's hero image
2. `posts/<slug>/index.html`: a complete standalone page (title, meta
   description, canonical and Open Graph tags; links `../../style.css`)
3. `posts/index.json`: the entry `{ slug, title, excerpt, date, path, hero }`,
   upserted by slug, newest first

Pages or Vercel redeploys on push, and the listing picks the post up. A
re-publish of the same post updates those files in place.

See `docs/publishing.md` in the Content Studio repo for the full contract.
