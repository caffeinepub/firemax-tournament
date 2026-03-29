import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RegisterModal from "./components/RegisterModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useMyProfile } from "./hooks/useQueries";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import ReferralPage from "./pages/ReferralPage";
import WalletPage from "./pages/WalletPage";

export type Page = "home" | "lobby" | "wallet" | "referral";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [showRegister, setShowRegister] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  const isLoggedIn = !!identity;
  const isRegistered = !!profile;

  const handleLoginSuccess = () => {
    if (!profileLoading && !isRegistered) {
      setShowRegister(true);
    }
  };

  const navigate = (page: Page) => setCurrentPage(page);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={currentPage}
        navigate={navigate}
        onLoginSuccess={handleLoginSuccess}
        profile={profile ?? null}
      />
      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage navigate={navigate} isLoggedIn={isLoggedIn} />
        )}
        {currentPage === "lobby" && (
          <LobbyPage
            isLoggedIn={isLoggedIn}
            profile={profile ?? null}
            onRequireLogin={() => setShowRegister(!isRegistered)}
          />
        )}
        {currentPage === "wallet" && isLoggedIn && (
          <WalletPage profile={profile ?? null} />
        )}
        {currentPage === "wallet" && !isLoggedIn && (
          <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
            <p className="text-muted-foreground text-xl font-heading uppercase tracking-wider">
              Login required
            </p>
            <p className="text-muted-foreground">
              Please log in to access your wallet.
            </p>
          </div>
        )}
        {currentPage === "referral" && isLoggedIn && (
          <ReferralPage profile={profile ?? null} />
        )}
        {currentPage === "referral" && !isLoggedIn && (
          <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
            <p className="text-muted-foreground text-xl font-heading uppercase tracking-wider">
              Login required
            </p>
            <p className="text-muted-foreground">
              Please log in to access referrals.
            </p>
          </div>
        )}
      </main>
      <Footer />
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}
