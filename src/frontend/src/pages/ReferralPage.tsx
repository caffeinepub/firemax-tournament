import {
  ArrowRight,
  CheckCheck,
  Coins,
  Copy,
  Gift,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend.d";
import { useMyProfile } from "../hooks/useQueries";

interface ReferralPageProps {
  profile: UserProfile | null;
}

export default function ReferralPage({
  profile: initialProfile,
}: ReferralPageProps) {
  const { data: profile } = useMyProfile();
  const [copied, setCopied] = useState(false);

  const currentProfile = profile ?? initialProfile;
  const referralCode = currentProfile?.referralCode ?? "LOGIN-TO-SEE";
  const earnings = currentProfile
    ? Number(currentProfile.totalReferralEarnings)
    : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Copy,
      title: "Share Your Code",
      desc: "Share your unique referral code with friends who play Free Fire Max.",
    },
    {
      icon: Users,
      title: "Friend Registers",
      desc: "Your friend signs up using your referral code and creates their profile.",
    },
    {
      icon: Zap,
      title: "They Join a Tournament",
      desc: "When your friend joins their first tournament, the reward is triggered.",
    },
    {
      icon: Gift,
      title: "Earn 50 Coins",
      desc: "50 coins are automatically credited to your wallet. No limits!",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-2">
          REFER & EARN
        </h1>
        <p className="text-muted-foreground">
          Invite friends and earn coins for every successful referral.
        </p>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glow rounded-xl bg-card p-8 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-heading uppercase tracking-widest mb-3">
              Your Referral Code
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 bg-secondary border border-primary/30 rounded-lg px-4 py-3">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-heading font-bold text-xl text-foreground tracking-[0.2em] flex-1">
                  {referralCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                data-ocid="referral.copy.button"
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-heading font-bold text-sm uppercase tracking-wider transition-all ${
                  copied
                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                    : "btn-orange"
                }`}
              >
                {copied ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest">
              Total Earned
            </p>
            <p className="text-gold font-heading text-4xl font-bold glow-text">
              {earnings.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-sm">coins</p>
          </div>
        </div>
      </motion.div>

      {/* Share Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm font-heading uppercase tracking-widest mb-4">
          Share Via
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "WhatsApp",
              color:
                "bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30",
            },
            {
              label: "Telegram",
              color:
                "bg-blue-600/20 border-blue-600/40 text-blue-400 hover:bg-blue-600/30",
            },
            {
              label: "Share Link",
              color:
                "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20",
            },
          ].map((s) => (
            <button
              type="button"
              key={s.label}
              onClick={handleCopy}
              data-ocid={`referral.share_${s.label.toLowerCase().replace(" ", "_")}.button`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-heading font-semibold text-sm uppercase tracking-wider transition-colors ${s.color}`}
            >
              <ArrowRight className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-heading text-2xl text-foreground mb-6 uppercase tracking-wider">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-4 p-5 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
              data-ocid={`referral.step.item.${i + 1}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary font-heading font-bold text-xs">
                    STEP {i + 1}
                  </span>
                  <span className="w-4 h-px bg-border" />
                  <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reward summary */}
        <div className="mt-6 p-5 rounded-lg bg-gold/5 border border-gold/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="font-heading font-bold text-foreground uppercase tracking-wide">
              Unlimited Referrals
            </p>
            <p className="text-muted-foreground text-sm">
              Earn <span className="text-gold font-bold">50 coins</span> for
              every friend who joins a tournament — no cap, no expiry.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
