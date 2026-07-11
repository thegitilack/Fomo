The core list primitive — one task per row.

```jsx
<TaskRow name="Call the pharmacy before it closes" meta="Today · 6:00 PM"
         priority flagged onToggle={...} onOpen={...} />
<TaskRow name="Morning walk" done />
```

Composes `Checkbox` + name + an optional metadata line (with optional priority dot) + an optional `flag`. Flagged rows should be sorted to the top of the list by the parent. Completed rows render dimmed (`--fomo-text-done`) with a strike-through. Rows are separated by `--fomo-divider`; pass `divider={false}` on the last row.
