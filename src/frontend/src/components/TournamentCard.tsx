import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Users, Zap } from "lucide-react";
import type { Tournament } from "../backend.d";
import { TournamentStatus } from "../backend.d";

const BANNERS = [
  "/assets/generated/tournament-banner-1.dim_400x220.jpg",
  "/assets/generated/tournament-banner-2.dim_400x220.jpg",
  "/assets/generated/tournament-banner-3.dim_400x220.jpg",
  "/assets/generated/tournament-banner-4.dim_400x220.jpg",
  "/assets/generated/tournament-banner-5.dim_400x220.jpg",
];

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
  onJoin: (id: bigint) => void;
  isJoining: boolean;
  isLoggedIn: boolean;
  ocidIndex: number;
}

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TournamentCard({
  tournament,
  index,
  onJoin,
  isJoining,
  isLoggedIn,
  ocidIndex,
}: TournamentCardProps) {
  const banner = BANNERS[index % BANNERS.length];
  const fillPct =
    (Number(tournament.filledSlots) / Number(tournament.maxSlots)) * 100;
  const isLive = tournament.status === TournamentStatus.live;
  const isCompleted = tournament.status === TournamentStatus.completed;
  const isFull = tournament.filledSlots >= tournament.maxSlots;

  return (
    <div
      className="card-glow rounded-lg overflow-hidden bg-card transition-all duration-300 hover:-translate-y-1 flex flex-col"
      data-ocid={`tournament.item.${ocidIndex}`}
    >
      {/* Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={banner}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {isLive && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-heading font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </span>
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-muted text-muted-foreground text-xs font-heading uppercase tracking-wider">
              Ended
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-heading font-semibold text-muted-foreground uppercase bg-black/60 px-2 py-1 rounded">
            {tournament.gameMode}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-heading font-bold text-lg text-foreground leading-tight">
          {tournament.name}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
              Prize Pool
            </span>
            <span className="text-gold font-heading font-bold text-base flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {Number(tournament.prizePool).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
              Entry Fee
            </span>
            <span className="text-foreground font-heading font-bold text-base flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-primary" />
              {Number(tournament.entryFee).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              {Number(tournament.filledSlots)}/{Number(tournament.maxSlots)}{" "}
              slots
            </span>
            <span className={isFull ? "text-destructive" : "text-green-400"}>
              {isFull
                ? "Full"
                : `${Number(tournament.maxSlots) - Number(tournament.filledSlots)} left`}
            </span>
          </div>
          <Progress value={fillPct} className="h-1.5" />
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(tournament.startTime)}</span>
        </div>

        <button
          type="button"
          onClick={() => onJoin(tournament.id)}
          disabled={isJoining || isFull || isCompleted || !isLoggedIn}
          data-ocid={`tournament.join_button.${ocidIndex}`}
          className="btn-orange w-full py-2.5 rounded text-sm mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining
            ? "Joining..."
            : isFull
              ? "FULL"
              : isCompleted
                ? "ENDED"
                : "JOIN NOW"}
        </button>
      </div>
    </div>
  );
}
