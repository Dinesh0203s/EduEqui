import { Link } from "react-router-dom";
import { GraduationCap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-elegant">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-12 h-12 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-3xl font-bold text-primary">
                EduEqui
              </h1>
              <p className="text-lg text-muted-foreground">
                கல்வி அனைவருக்கும் – Education for Everyone
              </p>
            </div>
          </Link>
          <Link to="/settings">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full"
              aria-label="Open settings"
            >
              <Settings className="w-6 h-6" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
