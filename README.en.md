**English** | [简体中文](README.md)

# help-nflshc202401

The **help site** for the NFLSHC 202401 community project (official documentation and tutorials for NFLSHC Chat).

🌐 Online: `https://help.nflshcchat.cc.cd` (or the corresponding Pages / Workers domain)

---

## 📖 About the site

This repository is the companion documentation site for the [nflshcchat](https://github.com/user-henry/nflshcchat) project. Aimed at users of the NFLSHC 202401 class community (Nanjing Foreign Language School Huai'an Campus), it provides:

- Platform tutorials (sign-up, login, chat, friends, characters, AI assistant, etc.)
- Feature introductions and FAQs
- The HZYAI character (RAG) knowledge base and usage guide
- Local deployment / self-hosting instructions

The site itself is a **pure static frontend** hosted on Cloudflare Pages / Cloudflare Workers. Data persistence is handled by the main site's backend on **Cloudflare D1**; the help site stores no business data.

---

## 📁 Directory structure

```
help-nflshc202401/
├── index.html         # Home page (documentation navigation / tutorial entries)
├── rag.html           # HZYAI character (RAG) knowledge base and usage
├── ai-chat.html       # HZYAI chat demo page
├── build.html         # Local build / deployment guide
├── 404.html           # Custom not-found page
├── sitemap.xml        # Sitemap
├── wrangler.toml      # Cloudflare Workers / Pages configuration
├── _worker.js         # Worker entry: proxies /api/ai/* to ai.nflshcchat.cc.cd
└── .assetsignore      # Static asset ignore rules
```

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────┐
│            Browser (pure static frontend)    │
│   HTML / CSS / JavaScript (no framework)     │
└───────────────────┬─────────────────────────┘
                    │  HTTPS
                    ▼
┌─────────────────────────────────────────────┐
│        Cloudflare Pages / Workers hosting     │
│  _worker.js intercepts /api/ai/* requests     │
│         ↓ reverse proxy                       │
│  ai.nflshcchat.cc.cd (HZYAI AI gateway)       │
└─────────────────────────────────────────────┘
```

- **Hosting**: Cloudflare Pages (or Workers Assets) — free, with a global CDN.
- **AI proxy**: `_worker.js` forwards in-site `/api/ai/*` requests to `ai.nflshcchat.cc.cd`, avoiding CORS and hiding the real gateway address.
- **Data storage**: business data (conversations, characters, tasks, etc.) is managed by the main site's Cloudflare D1; the help site only presents and guides.

---

## 🚀 Local preview / deployment

### Local preview

```bash
# Enter the repository
cd help-nflshc202401

# Use any static server (one that can load _worker.js to test the /api/ai proxy)
npx wrangler pages dev .
# or
npx serve .
```

### Deploying to Cloudflare

1. Install and sign in to `wrangler`: `npx wrangler login`
2. Adjust `name` / account bindings in `wrangler.toml` (if you need a custom domain)
3. Deploy:
   ```bash
   npx wrangler pages deploy .
   # or deploy as a Worker (using _worker.js as the entry)
   npx wrangler deploy
   ```
4. Bind a custom domain in the Cloudflare dashboard (e.g. `help.nflshcchat.cc.cd`) and make `ai.nflshcchat.cc.cd` reachable as the AI gateway.

---

## 📄 License

MIT License — for learning and educational purposes only.
