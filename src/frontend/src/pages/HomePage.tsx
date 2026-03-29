import { ArrowRight, Flame, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Page } from "../App";
import TournamentCard from "../components/TournamentCard";
import { useTournaments } from "../hooks/useQueries";
import { useJoinTournament } from "../hooks/useQueries";

const MOCK_TOURNAMENTS = [
  {
    id: 1n,
    name: "SOLO CLASH CHAMPIONSHIP",
    prizePool: 50000n,
    entryFee: 100n,
    maxSlots: 100n,
    filledSlots: 87n,
    startTime: BigInt(Date.now() + 3600000) * 1_000_000n,
    status: "live" as const,
    gameMode: "Solo",
    participants: [],
  },
  {
    id: 2n,
    name: "SQUAD BATTLE ROYALE",
    prizePool: 120000n,
    entryFee: 250n,
    maxSlots: 50n,
    filledSlots: 32n,
    startTime: BigInt(Date.now() + 7200000) * 1_000_000n,
    status: "upcoming" as const,
    gameMode: "Squad",
    participants: [],
  },
  {
    id: 3n,
    name: "DUO SHOWDOWN SERIES",
    prizePool: 75000n,
    entryFee: 150n,
    maxSlots: 80n,
    filledSlots: 60n,
    startTime: BigInt(Date.now() + 14400000) * 1_000_000n,
    status: "upcoming" as const,
    gameMode: "Duo",
    participants: [],
  },
];

interface HomePageProps {
  navigate: (page: Page) => void;
  isLoggedIn: boolean;
}

export default function HomePage({ navigate, isLoggedIn }: HomePageProps) {
  const { data: liveTournaments } = useTournaments();
  const joinMutation = useJoinTournament();

  const displayed = (
    liveTournaments && liveTournaments.length > 0
      ? liveTournaments
      : MOCK_TOURNAMENTS
  ).slice(0, 3);

  const handleJoin = async (id: bigint) => {
    if (!isLoggedIn) {
      toast.error("Please login to join tournaments!");
      return;
    }
    try {
      await joinMutation.mutateAsync(id);
      toast.success("Successfully joined the tournament!");
    } catch {
      toast.error("Failed to join tournament.");
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="hero-gradient relative min-h-[90vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-px bg-primary" />
                  <span className="text-primary font-heading text-sm uppercase tracking-widest">
                    Battle. Win. Dominate.
                  </span>
                </div>
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-none text-foreground">
                  COMPETE IN
                  <br />
                  <span className="text-gold glow-text">FREE FIRE MAX</span>
                  <br />
                  TOURNAMENTS
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-muted-foreground text-lg max-w-md leading-relaxed"
              >
                Join thousands of players competing for massive prize pools.
                Prove your skills, climb the leaderboard, and claim glory.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  type="button"
                  onClick={() => navigate("lobby")}
                  data-ocid="home.join_tournament.primary_button"
                  className="btn-orange px-8 py-4 rounded text-base flex items-center gap-2"
                >
                  JOIN NOW
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("lobby")}
                  data-ocid="home.view_tournaments.secondary_button"
                  className="btn-outlined px-8 py-4 rounded text-base"
                >
                  VIEW TOURNAMENTS
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-4 border-t border-border/30"
              >
                <div>
                  <p className="text-gold font-heading text-2xl font-bold">
                    50K+
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Active Players
                  </p>
                </div>
                <div>
                  <p className="text-gold font-heading text-2xl font-bold">
                    ₹5M+
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Prize Distributed
                  </p>
                </div>
                <div>
                  <p className="text-gold font-heading text-2xl font-bold">
                    200+
                  </p>
                  <p className="text-muted-foreground text-sm">Tournaments</p>
                </div>
              </motion.div>
            </div>

            {/* Right: Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
                <img
                  src="/assets/generated/hero-character.dim_600x700.png"
                  alt="Free Fire Max Character"
                  className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-gold/40 px-4 py-2 rounded">
                  <p className="text-gold font-heading font-bold text-sm uppercase tracking-widest">
                    FREE FIRE MAX
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Official Tournament Platform
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy,
                title: "Massive Prizes",
                desc: "Compete for prize pools up to ₹1,00,000 per tournament",
              },
              {
                icon: Users,
                title: "Fair Matchmaking",
                desc: "Balanced brackets ensuring every player a fair shot",
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                desc: "Win coins credited instantly to your wallet",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/50 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">
              UPCOMING TOURNAMENTS
            </h2>
            <p className="text-muted-foreground">
              Jump into the action and compete for glory
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((t, i) => (
              <motion.div
                key={String(t.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <TournamentCard
                  tournament={t as any}
                  index={i}
                  onJoin={handleJoin}
                  isJoining={joinMutation.isPending}
                  isLoggedIn={isLoggedIn}
                  ocidIndex={i + 1}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => navigate("lobby")}
              data-ocid="home.view_all_tournaments.button"
              className="btn-outlined px-8 py-3 rounded"
            >
              VIEW ALL TOURNAMENTS
            </button>
          </div>
        </div>
      </section>

      {/* Wallet & Referral Preview */}
      <section className="py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">
              WALLET & REFERRALS
            </h2>
            <p className="text-muted-foreground">
              Manage your coins and invite friends to earn more
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Wallet Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-glow rounded-lg bg-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    YOUR WALLET
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Tournament currency
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-gold font-heading text-5xl font-bold glow-text">
                  0
                </span>
                <span className="text-muted-foreground mb-2">coins</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("wallet")}
                data-ocid="home.wallet.button"
                className="btn-orange py-2.5 rounded text-sm"
              >
                MANAGE WALLET
              </button>
            </motion.div>

            {/* Referral Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-glow rounded-lg bg-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    REFER & EARN
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    50 coins per referral
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded px-3 py-2">
                <Flame className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground font-heading text-sm tracking-widest flex-1">
                  LOGIN TO GET YOUR CODE
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("referral")}
                data-ocid="home.referral.button"
                className="btn-orange py-2.5 rounded text-sm"
              >
                INVITE FRIENDS
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
