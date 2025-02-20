import { Button } from "@/components/ui/button"

export function Welcome({ onLogin, onAnonymousLogin }) {
  return (
    <div className="text-center mt-32">
      <h2 className="text-4xl font-semibold mb-4">Welcome to MyAnimeTracker</h2>
      <p className="text-lg mb-10 italic">A tool to keep track of your anime, anytime, anywhere...</p>
      <div className="flex justify-center gap-4">
        <Button onClick={onLogin} size="lg">Login with Google</Button>
        <Button onClick={onAnonymousLogin} size="lg">Continue as Guest</Button>
      </div>
    </div>
  )
}