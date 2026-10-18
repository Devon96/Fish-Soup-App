# Baja Fisherman's Soup — Kitchen Companion

A responsive, bilingual (Hungarian and English) recipe helper for traditional Baja-style fisherman’s soup. It includes an ingredient calculator, a step-by-step cooking guide, timed stages, optional browser notifications, and light/dark themes.

## Files

- `index.html` — page structure and content
- `styles.css` — responsive layout, styling, and light/dark themes
- `app.js` — ingredient calculations, translations, cooking state, timers, and notifications

## Getting started

1. Keep all three files in the same folder.
2. Open `index.html` in a modern browser.
3. Choose whether to calculate by total fish weight or number of servings.
4. When you begin cooking the onions, select **Start cooking** to start the first 15-minute timer.
5. When the soup begins to boil, select **It has started boiling**. The paprika stage and its 15-minute timer begin from that point.
6. Add the reserved catfish, roe, and milt during the later stage, then start the second 15-minute timer when prompted.
7. Follow the final instructions to taste and adjust the seasoning, strain the onion if desired, and serve with separately cooked soup pasta.

## Browser notifications

Notifications depend on browser support and permission. For reliable notification support, serve the page over HTTPS or `localhost` rather than opening it directly from the file system.

To start a simple local web server with Python, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> and select the **Notifications** control to request permission. Keep the page open while cooking. This project does not provide server-side push notifications after the page or browser is closed.

## Ingredient calculation assumptions

The calculator follows the ratios from the supplied recipe and uses these additional estimates where the original recipe did not specify quantities:

- Water: 700 ml per 500 g of fish (1.4 litres per kilogram).
- Onion: one large onion per kilogram of fish.
- Fish-stock cube: one cube per litre of water.
- Sweet ground paprika: one tablespoon per litre of water.
- Fish per serving: estimated at 400 g per person.
- Soup pasta: estimated at 80 g per person.

Fractional onion and stock-cube quantities are estimates. Adjust them to the size of the ingredients and to taste. Salt is intentionally listed as “to taste”; the guide recommends tasting before adding more salt at the end.

## Notes

- The cooking steps remain visible on one page. Instructions are hidden for steps marked complete to keep the guide focused on the current stage.
- The selected language, theme, and cooking progress are saved in the browser where supported.
- Timers run in the page. Background throttling and notification delivery can vary by browser and device.
