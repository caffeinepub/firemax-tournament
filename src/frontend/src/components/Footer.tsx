import { Flame } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="border-t border-border/30 bg-secondary/20 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-foreground tracking-widest text-sm">
              FIRE BATTLEMAX
            </span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-6 text-muted-foreground text-xs font-heading uppercase tracking-wider">
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Terms
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
