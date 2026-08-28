# Glassmorphism & Accessibility Rule

Quando scrivi, modifichi o progetti componenti in PrismUI, **DEVI** aderire alle seguenti regole di design e accessibilità:

## 1. Glassmorphism Design (Effetto Vetro / Specchio)
Tutti i componenti devono sembrare fatti di vetro smerigliato. Usa le classi globali fornite in `tailwind.css` o componile usando le classi Tailwind:

- **Sfondo**: Semi-trasparente (es. `bg-white/20`, `bg-black/40`, `bg-blue-500/40`). Non usare mai colori solidi (es. `bg-blue-500`) a meno che non sia strettamente necessario per l'interazione.
- **Sfocatura**: Usa sempre `backdrop-blur-md` o `backdrop-blur-lg` per sfocare lo sfondo dietro il componente.
- **Bordo**: Aggiungi un bordo semi-trasparente per simulare il riflesso della luce sul bordo del vetro (es. `border border-white/20` in light mode, `border-white/10` in dark mode).
- **Ombra**: Usa `shadow-lg` o `shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]` per dare profondità.

Puoi anche usare le classi custom definite in `tailwind.css`:
- `.prism-glass` (Generale)
- `.prism-glass-panel` (Per card, modali e pannelli)

## 2. Regole di Accessibilità (Contrasto)
L'effetto vetro può ridurre la leggibilità se non bilanciato. È imperativo avere un **buon contrasto**.

- **Su sfondi scuri/intensi (Es. Button primary blu scuro o nero):** Il testo **DEVE** essere bianco o molto chiaro (`text-white`, `text-slate-50`). **NON** usare testi scuri (es. `text-slate-900`) su sfondi scuri. "Esempio: bottone nero non puoi mettere colore del testo nero non si vede, metti bianco che ha una percentuale di visibilità sul colore alta".
- **Su sfondi chiari/trasparenti (Light mode):** Il testo deve essere scuro (`text-slate-900`, `text-slate-800`).
- Se necessario, forza l'alta visibilità con la classe custom `.text-high-contrast` (colore `#ffffff` con `!important`).

## 3. Dark Mode
- Assicurati sempre che il componente supporti la modalità dark con le varianti Tailwind (es. `dark:bg-slate-900/50`, `dark:text-white`).
- Il contrasto deve funzionare in entrambe le modalità.
