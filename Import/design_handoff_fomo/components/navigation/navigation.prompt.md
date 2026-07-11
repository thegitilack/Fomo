The bottom chrome of every main view: `FAB`, `BottomNav`, `StatusBar`.

```jsx
<StatusBar time="22:01" battery={41} />
...
<FAB onClick={openAddSheet} />
<BottomNav active="today" onChange={setView} />
```

`BottomNav` has exactly three tabs — Today / Upcoming / All — with the icons `today` (ring), `chevron`, `list`. The active tab uses `--fomo-text-primary`, the rest `--fomo-text-faint`. The `FAB` is centered and floats above the bar. `StatusBar` and these are present on Today, Upcoming and Empty; the Task Detail sub-screen omits them.
