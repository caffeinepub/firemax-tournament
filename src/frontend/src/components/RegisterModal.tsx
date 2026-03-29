import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegister } from "../hooks/useQueries";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [gameUID, setGameUID] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !gameUID.trim()) return;
    try {
      await register.mutateAsync({
        username: username.trim(),
        gameUID: gameUID.trim(),
        referredByCode: referredBy.trim() || null,
      });
      toast.success("Profile created! Welcome to Fire BattleMax!");
      onClose();
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md border border-primary/30 bg-card"
        data-ocid="register.modal"
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-6 h-6 text-primary" />
            <DialogTitle className="font-heading text-xl uppercase tracking-wider text-foreground">
              Create Your Profile
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Set up your Free Fire Max battle profile to join tournaments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="username"
              className="text-foreground font-heading uppercase text-xs tracking-wider"
            >
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your battle name"
              required
              data-ocid="register.username.input"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="gameUID"
              className="text-foreground font-heading uppercase text-xs tracking-wider"
            >
              Free Fire UID
            </Label>
            <Input
              id="gameUID"
              value={gameUID}
              onChange={(e) => setGameUID(e.target.value)}
              placeholder="Enter your in-game UID"
              required
              data-ocid="register.gameuid.input"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="referredBy"
              className="text-foreground font-heading uppercase text-xs tracking-wider"
            >
              Referral Code{" "}
              <span className="text-muted-foreground normal-case">
                (optional)
              </span>
            </Label>
            <Input
              id="referredBy"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              placeholder="Enter referral code"
              data-ocid="register.referral.input"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={register.isPending || !username.trim() || !gameUID.trim()}
            data-ocid="register.submit_button"
            className="btn-orange py-3 rounded text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {register.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {register.isPending
              ? "Creating Profile..."
              : "Enter The Battleground"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
