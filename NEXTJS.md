# Next.js 15 app

The site has been ported to **Next.js 15** in the **`next-site/`** folder.

- Run locally: **`npm install`** once in **`next-site/`** (or `cd next-site && npm install`). Then either **`npm run dev`** from the **repo root** (uses the root `package.json` shim) or `cd next-site && npm run dev`.
- Details: see `next-site/README.md`

The **root-level `.html` files have been removed**; page markup for the Next app lives under **`next-site/content/html/`**. CSS, JS, and images still exist at the repo root **and** under **`next-site/public/`**—edit the copies in `next-site/public` (and `content/html`) when you change the live site, or re-copy from root if you keep maintaining assets there.

Canonical domain defaults to **`https://krugersdorppainting.co.za`**. For a preview URL, set **`NEXT_PUBLIC_SITE_URL`**. For Search Console HTML-tag verification, set **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`** in Vercel env.
