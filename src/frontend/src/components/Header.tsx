import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Flame,
  LogOut,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import type { Page } from "../App";
import type { UserProfile } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  onLoginSuccess: () => void;
  profile: UserProfile | null;
}

const navLinks: { label: string; page: Page }[] = [
  { label: "Lobby", page: "lobby" },
  { label: "Wallet", page: "wallet" },
  { label: "Referral", page: "referral" },
];

export default function Header({
  currentPage,
  navigate,
  onLoginSuccess,
  profile,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    await login();
    onLoginSuccess();
  };

  return (
    <header className="sticky top-0 z-50 bg-header border-b border-border/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 group"
            data-ocid="nav.home.link"
          >
            <div className="w-9 h-9 rounded bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-base text-foreground tracking-wider">
                FIRE
              </span>
              <span className="font-heading font-bold text-base text-primary tracking-wider -mt-1">
                BATTLEMAX
              </span>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => navigate(link.page)}
                data-ocid={`nav.${link.page}.link`}
                className={`px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider transition-colors relative ${
                  currentPage === link.page
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="flex items-center gap-3">
            {isLoggedIn && profile ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-muted/50 border border-border/50">
                  <span className="text-gold text-sm font-heading font-bold">
                    {Number(profile.walletBalance).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">coins</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      data-ocid="nav.user.dropdown_menu"
                    >
                      <Avatar className="w-8 h-8 border border-primary/50">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-heading">
                          {profile.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-heading font-semibold">
                        {profile.username}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => navigate("wallet")}
                      data-ocid="nav.wallet.link"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("lobby")}
                      data-ocid="nav.lobby.link"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Tournaments
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("referral")}
                      data-ocid="nav.referral.link"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Referrals
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={clear}
                      data-ocid="nav.logout.button"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                data-ocid="nav.logout.button"
                className="btn-outlined text-sm"
              >
                Logout
              </Button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="nav.login.button"
                  className="btn-outlined px-4 py-2 rounded text-sm"
                >
                  {isLoggingIn ? "Connecting..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="nav.signup.button"
                  className="btn-orange px-4 py-2 rounded text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
