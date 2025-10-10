# Apply AI Compass Branding (snippets)

## 1) Add brand constants
Place `src/branding.ts` in your project and use:
```ts
import { BRAND } from "@/branding";
```

## 2) Update `index.html`
```html
<title>AI Compass</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

## 3) Header (gradient + compass icon)
```tsx
import { Compass } from "lucide-react";
import { BRAND } from "@/branding";

<header className="sticky top-0 z-20 backdrop-blur border-b border-slate-200 dark:border-slate-800">
  <div className="w-full h-1" style={{ backgroundImage: BRAND.colors.gradient }} />
  <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
    <Compass className="w-6 h-6" style={{ color: BRAND.colors.primary }} />
    <div className="flex-1">
      <h1 className="text-xl font-semibold leading-tight" style={{ fontFamily: BRAND.fonts.body }}>
        {BRAND.name}
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{BRAND.tagline}</p>
    </div>
  </div>
</header>
```

## 4) Footer copy
```tsx
<footer className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
  <span>© {new Date().getFullYear()} Sanofi — {BRAND.name}</span>
</footer>
```

## 5) Use logo
```tsx
<img src="/logo.svg" alt="AI Compass" className="w-7 h-7" />
```
