import { Link } from "react-router-dom";
import { GraduationCap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header 
      className="bg-card border-b border-border shadow-elegant" 
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg p-2 -m-2"
            aria-label="EduEqui home page - Education for Everyone"
          >
            <GraduationCap className="w-12 h-12 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-3xl font-bold text-primary">
                EduEqui
              </h1>
              <p className="text-lg text-muted-foreground" lang="ta">
                கல்வி அனைவருக்கும் – Education for Everyone
              </p>
            </div>
          </Link>
          <Link to="/settings" tabIndex={0}>
            <Button
              variant="outline"
              size="icon"
              className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-full focus:ring-4 focus:ring-primary/50"
              aria-label="Open settings page. Keyboard shortcut: Alt + S"
            >
              <Settings className="w-6 h-6" aria-hidden="true" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
