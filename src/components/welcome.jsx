import { Button } from "@/components/ui/button"

export function Welcome({ onLogin }) {
  return (
    <div className="text-center mt-32">
      <h2 className="text-4xl font-semibold mb-6">Welcome to MyAnimeTracker</h2>
      <p className="text-lg mb-6">Please log in to view and manage your watched animes.</p>
      <Button onClick={onLogin} size="lg">Login</Button>
    </div>
  )
}