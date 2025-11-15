import { Mail, Github, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">
              EduEqui
            </h3>
            <p className="text-lg text-muted-foreground">
              Inclusive learning for all
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
            <div className="flex flex-col gap-2">
              <a 
                href="mailto:support@eduequi.com" 
                className="flex items-center gap-2 text-lg hover:text-primary transition-colors justify-center md:justify-start"
                aria-label="Email us at support@eduequi.com"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                support@eduequi.com
              </a>
              <a 
                href="https://github.com/eduequi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-lg hover:text-primary transition-colors justify-center md:justify-start"
                aria-label="Visit our GitHub repository"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-end">
            <p className="flex items-center gap-2 text-lg">
              Made with <Heart className="w-5 h-5 text-destructive fill-destructive" aria-hidden="true" /> for accessibility
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center text-lg text-muted-foreground">
          © 2025 EduEqui. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
