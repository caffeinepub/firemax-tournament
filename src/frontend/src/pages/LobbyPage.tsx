import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend.d";
import { TournamentStatus } from "../backend.d";
import TournamentCard from "../components/TournamentCard";
import { useJoinTournament, useTournaments } from "../hooks/useQueries";

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
  {
    id: 4n,
    name: "GRANDMASTER SOLO CUP",
    prizePool: 200000n,
    entryFee: 500n,
    maxSlots: 60n,
    filledSlots: 60n,
    startTime: BigInt(Date.now() - 7200000) * 1_000_000n,
    status: "completed" as const,
    gameMode: "Solo",
    participants: [],
  },
  {
    id: 5n,
    name: "FREE FIRE OPEN INVITATIONAL",
    prizePool: 300000n,
    entryFee: 750n,
    maxSlots: 100n,
    filledSlots: 45n,
    startTime: BigInt(Date.now() + 86400000) * 1_000_000n,
    status: "upcoming" as const,
    gameMode: "Squad",
    participants: [],
  },
];

interface LobbyPageProps {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  onRequireLogin: () => void;
}

export default function LobbyPage({
  isLoggedIn,
  onRequireLogin,
}: LobbyPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: tournaments, isLoading } = useTournaments();
  const joinMutation = useJoinTournament();

  const all = (
    tournaments && tournaments.length > 0 ? tournaments : MOCK_TOURNAMENTS
  ) as any[];

  const filtered = all.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "live")
      return matchesSearch && t.status === TournamentStatus.live;
    if (filter === "upcoming")
      return matchesSearch && t.status === TournamentStatus.upcoming;
    if (filter === "completed")
      return matchesSearch && t.status === TournamentStatus.completed;
    return matchesSearch;
  });

  const handleJoin = async (id: bigint) => {
    if (!isLoggedIn) {
      toast.error("Please login to join tournaments!");
      onRequireLogin();
      return;
    }
    try {
      await joinMutation.mutateAsync(id);
      toast.success("Successfully joined the tournament!");
    } catch {
      toast.error("Failed to join. Check your balance.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-2">
          TOURNAMENT LOBBY
        </h1>
        <p className="text-muted-foreground">
          Browse and join active tournaments. May the best player win.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournaments..."
            data-ocid="lobby.search_input"
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger
                value="all"
                data-ocid="lobby.all.tab"
                className="font-heading uppercase text-xs tracking-wider"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="live"
                data-ocid="lobby.live.tab"
                className="font-heading uppercase text-xs tracking-wider"
              >
                Live
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                data-ocid="lobby.upcoming.tab"
                className="font-heading uppercase text-xs tracking-wider"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                data-ocid="lobby.completed.tab"
                className="font-heading uppercase text-xs tracking-wider"
              >
                Ended
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="lobby.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div key={k} className="rounded-lg overflow-hidden bg-card">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 gap-3"
          data-ocid="lobby.empty_state"
        >
          <Search className="w-12 h-12 text-muted-foreground" />
          <p className="font-heading text-xl text-muted-foreground uppercase tracking-wider">
            No tournaments found
          </p>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <motion.div
              key={String(t.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <TournamentCard
                tournament={t}
                index={i}
                onJoin={handleJoin}
                isJoining={joinMutation.isPending}
                isLoggedIn={isLoggedIn}
                ocidIndex={i + 1}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
