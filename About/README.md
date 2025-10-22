# AI-Compass About (Drop-in Package)

A ready-to-drop-in About section with two tabs:
- **For Users & Consumers**
- **For Stakeholders & Investors**

Uses Tailwind utility classes, `framer-motion` for subtle animations, and `lucide-react` for icons.

## Install
In your workspace root:
```bash
npm i framer-motion lucide-react
```

Ensure Tailwind is enabled in your project. If you're using Next.js with the App Router or React Router, see examples below.

## Files
- `src/components/AboutAICompass.tsx` — The component
- `app/about/page.tsx` — (Optional) Next.js App Router example
- `examples/react-router/src/routes/About.tsx` — (Optional) React Router example

## Next.js (App Router) wiring
1. Copy `src/components/AboutAICompass.tsx` into your repo.
2. Copy `app/about/page.tsx` into your Next.js `app/` directory.
3. Add a nav link to `/about`.

## React Router wiring
1. Copy `src/components/AboutAICompass.tsx` into your repo.
2. Copy `examples/react-router/src/routes/About.tsx` into your routes folder (adjust import alias if needed).
3. Add a route: `<Route path="/about" element={<About />} />`

## Theming
The theme uses Sanofi-blue (#004b93) and neutral slate backgrounds. If you use shadcn/ui, you can easily replace the simple tab buttons with `<Tabs>`.

## Contact
Update the email in the component or inject via env (e.g., `NEXT_PUBLIC_CONTACT_EMAIL`) if you prefer.
