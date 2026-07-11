Pill metadata button for the Add-Task sheet and Task Detail chip row.

```jsx
<Chip label="Due date" icon={<Icon name="calendar" size={13} stroke="var(--fomo-text-secondary)" />} />
<Chip label="Today · 6:00 PM" active icon={<Icon name="calendar" size={13} stroke="var(--fomo-accent-strong)" />} />
```

Inactive = hairline outline + `--fomo-text-secondary`. Active (a value is set) = accent border/fill + `--fomo-accent-strong`. The four canonical chips are Due date, Priority (flag), Repeat, Note.
