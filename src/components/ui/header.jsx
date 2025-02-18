import { Button } from "@/components/ui/button";
import logo from "@/assets/anya.png";

export default function Header({ onLogin, onLogout, isLoggedIn }) {
return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
    <div className="flex items-center gap-2">
        <img src={logo} alt="(logo)" className="h-8 w-auto" />
        <h1 className="text-2xl font-bold">MyAnimeTracker</h1>
    </div>
    <div>
        {isLoggedIn ? (
        <Button onClick={onLogout} variant="secondary" className="bg-white">
            Logout
        </Button>
        ) : (
        <Button onClick={onLogin} variant="secondary" className="bg-white">
            Login
        </Button>
        )}
    </div>
    </header>
)
}
  
