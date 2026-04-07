import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, Menu } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/80">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-transparent border border-border flex items-center justify-center">
            <Hexagon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">Gems</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link to="/live/maya" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Live
          </Link>
          <Link to="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Competitions
          </Link>
          <Link to="/creator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Creator
          </Link>
          <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </Link>
          <Link to="/safety" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Safety
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          <Button asChild size="sm" className="rounded-xl">
            <Link to="/creator">Go live</Link>
          </Button>
        </div>

        <button type="button" className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Discover
            </Link>
            <Link to="/live/maya" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Live
            </Link>
            <Link to="/competitions" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Competitions
            </Link>
            <Link to="/creator" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Creator
            </Link>
            <Link to="/profile" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Profile
            </Link>
            <Link to="/safety" className="text-sm text-foreground py-2" onClick={() => setMobileOpen(false)}>
              Safety
            </Link>
            <div className="flex flex-wrap gap-2">
              <ConnectButton showBalance={false} />
            </div>
            <Button asChild className="w-full rounded-xl">
              <Link to="/creator" onClick={() => setMobileOpen(false)}>
                Go live
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
