# Basma Sagher — Premium Interactive Portfolio (v2.0)

Two-mode web app: a cinematic bilingual (AR/EN) 3D portfolio, and — after owner sign-in — the **same page** with every text node, image, and collection editable in place. No admin dashboard.

## Run

```bash
npm install
cp .env.example .env
npm run hash-password -- "your-strong-password"   # paste output into .env as ADMIN_PASSWORD_HASH
npm run dev                                        # http://localhost:3000
```

Owner entry: press **⌘/Ctrl + K** anywhere, or click the small glyph at the far end of the footer.

## Architecture

| Layer | Where |
|---|---|
| Content schema (all strings `{en, ar}`) | `lib/schema.ts` · seed in `lib/seed.ts` |
| Persistence (SQLite: live / draft / revisions / login throttle) | `lib/db.ts` |
| Auth (bcrypt, HMAC httpOnly session, CSRF double-submit, rate limit) | `lib/auth.ts` |
| Public read + owner mutation APIs | `app/api/**` |
| Client store: optimistic draft, debounced autosave, path-based mutations, atomic reorder | `lib/store.tsx`, `lib/paths.ts` |
| Editable primitives | `components/editable/` — `EditableText`, `EditableImage`, `EditableCollection`, `EditableHref`, `Confirm` |
| Scroll orchestration (one hook drives 3D, nav, reveals, idle) | `lib/useScroll.ts` |
| 3D identity + state machine + tiers/fallbacks | `components/three/` |
| UI ↔ 3D pub/sub | `lib/sceneBus.ts` |
| Design tokens | `tailwind.config.ts`, `app/globals.css` |

### Editing model
- **Double-click** any text → inline `contentEditable` with the exact rendered typography. Enter commits, Shift+Enter = newline, Esc cancels.
- Every array is an `EditableCollection`: per-item toolbar (drag · duplicate · up/down · delete), branded delete confirmation, in-context **+ Add** at every nesting depth, editable empty state.
- Images: click / drag-drop to replace. Server re-encodes to WebP, crops to the slot ratio, generates a blur placeholder. Alt text is editable.
- Links: inline href field with automatic `http→https` correction and validation hints; the API also rejects non-https URLs.
- Missing translations are flagged (`AR?` / `EN?`) rather than leaving blanks.

### Draft → Publish
Edits autosave to a **draft** 1.5 s after the last change. **Publish** copies draft → live and stores the previous live version in **History** (last 20). **Discard** resets the draft to live. **Preview** renders the visitor view of the draft.

### 3D
One `<Canvas>`, one identity object. `sceneStates.ts` defines 10 named targets (one per section); the fractional scroll index interpolates between them. Scroll velocity tightens easing; idle triggers ambient drift; RTL mirrors rotation and anchoring; reduced-motion disables parallax/idle; low-end devices or WebGL loss fall back to a CSS `LiteIdentity` that echoes the same states.

## Security notes
- `ADMIN_PASSWORD_HASH` is stored base64-encoded (`b64:`) so the `$` in bcrypt hashes survives env loaders.
- All mutating routes require session + CSRF header; reads are public. Inputs are Zod-validated and HTML-stripped; content is rendered as text only.
- Login: 5 failures / 15 min per IP → 429. Failure responses never reveal which field was wrong.

## Demo credentials (this sandbox only — rotate before deploying)
- Email: `basma@example.com`
- Password: `portfolio-demo-2026`
