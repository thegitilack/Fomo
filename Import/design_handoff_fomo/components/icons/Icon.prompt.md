Render a Fomo line icon — the app's entire iconography is this thin-stroke geometric set.

```jsx
<Icon name="flag" size={14} stroke="var(--fomo-accent)" />
<Icon name="today" size={22} stroke="var(--fomo-text-primary)" />
```

Names: `today` (ring + dot, the Today tab), `chevron` (Upcoming tab / forward), `list` (All tab), `plus` (FAB), `back`, `check`, `flag`, `calendar`, `repeat`, `note`. Color is driven by `stroke`; `flag` and the `today` dot fill with the same color. Use `ICON_NAMES` to enumerate.
