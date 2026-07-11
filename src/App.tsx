import { Button, Input } from './components'

function App() {
  return (
    <div className="p-800 flex flex-col gap-600 max-w-sm">
      <div className="flex gap-300 flex-wrap items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="md" disabled>Disabled</Button>
        <Button size="md" loading>Loading</Button>
      </div>
      <Input label="Email" placeholder="you@example.com" helpText="We'll never share your email." />
      <Input label="Password" type="password" errorMessage="Password must be at least 8 characters." />
      <Input label="Disabled" placeholder="Can't touch this" disabled />
    </div>
  )
}

export default App
