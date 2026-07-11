Circular task checkbox — the only selection control in Fomo.

```jsx
<Checkbox checked={task.done} onChange={() => toggle(task.id)} />
```

Default is a 20px unfilled ring (`--fomo-ring`); when `checked`, it fills with `--fomo-accent` and shows a check. Always pair completion with `line-through` + `--fomo-text-done` on the task label. Use `size={24}` on the Task Detail screen.
