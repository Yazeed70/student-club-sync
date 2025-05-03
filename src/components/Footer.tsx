
import { ThemeToggle } from "./ThemeToggle";
import { Heart, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d003a95e-4257-41c4-8c51-52eff4acecff.png" 
            alt="IUBlaze Logo" 
            className="h-6 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IUBlaze. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <a
              href="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="/faq"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
