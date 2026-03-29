import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { UserProfile, WalletTransaction } from "../backend.d";
import { TransactionType } from "../backend.d";
import {
  useDepositCoins,
  useTransactions,
  useWalletBalance,
} from "../hooks/useQueries";

interface WalletPageProps {
  profile: UserProfile | null;
}

function txTypeLabel(type: TransactionType): { label: string; color: string } {
  switch (type) {
    case TransactionType.deposit:
      return { label: "Deposit", color: "text-green-400" };
    case TransactionType.withdrawal:
      return { label: "Withdrawal", color: "text-red-400" };
    case TransactionType.tournament_fee:
      return { label: "Tournament Fee", color: "text-primary" };
    case TransactionType.referral_reward:
      return { label: "Referral Reward", color: "text-gold" };
    default:
      return { label: "Other", color: "text-muted-foreground" };
  }
}

function txSign(type: TransactionType): string {
  return [TransactionType.deposit, TransactionType.referral_reward].includes(
    type,
  )
    ? "+"
    : "-";
}

function formatTxTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    transactionType: TransactionType.deposit,
    description: "Initial deposit",
    amount: 500n,
    timestamp: BigInt(Date.now() - 86400000) * 1_000_000n,
  },
  {
    transactionType: TransactionType.tournament_fee,
    description: "Solo Clash Championship",
    amount: 100n,
    timestamp: BigInt(Date.now() - 43200000) * 1_000_000n,
  },
  {
    transactionType: TransactionType.referral_reward,
    description: "Referral bonus from ProSniper99",
    amount: 50n,
    timestamp: BigInt(Date.now() - 3600000) * 1_000_000n,
  },
];

export default function WalletPage({ profile }: WalletPageProps) {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const depositMutation = useDepositCoins();

  const displayBalance =
    balance !== undefined ? balance : (profile?.walletBalance ?? 0n);
  const txList =
    transactions && transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

  const handleDeposit = async (amount: bigint) => {
    try {
      await depositMutation.mutateAsync(amount);
      toast.success(`${Number(amount).toLocaleString()} coins deposited!`);
    } catch {
      toast.error("Deposit failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-2">
          YOUR WALLET
        </h1>
        <p className="text-muted-foreground">
          Manage your coins and track transactions.
        </p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glow rounded-xl bg-card p-8 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-sm font-heading uppercase tracking-widest mb-2">
              Total Balance
            </p>
            {balanceLoading ? (
              <Skeleton
                className="h-16 w-48"
                data-ocid="wallet.loading_state"
              />
            ) : (
              <div className="flex items-end gap-3">
                <span className="text-gold font-heading text-6xl font-bold glow-text">
                  {Number(displayBalance).toLocaleString()}
                </span>
                <span className="text-muted-foreground text-xl mb-2">
                  coins
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {[100n, 500n, 1000n].map((amt) => (
              <button
                type="button"
                key={String(amt)}
                onClick={() => handleDeposit(amt)}
                disabled={depositMutation.isPending}
                data-ocid={`wallet.deposit_${Number(amt)}.button`}
                className="btn-orange px-6 py-2.5 rounded text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {depositMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                + {Number(amt).toLocaleString()} Coins
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Deposited",
            value: txList
              .filter((t) => t.transactionType === TransactionType.deposit)
              .reduce((s, t) => s + Number(t.amount), 0),
            icon: ArrowDownLeft,
            color: "text-green-400",
          },
          {
            label: "Spent on Entries",
            value: txList
              .filter(
                (t) => t.transactionType === TransactionType.tournament_fee,
              )
              .reduce((s, t) => s + Number(t.amount), 0),
            icon: ArrowUpRight,
            color: "text-primary",
          },
          {
            label: "Referral Earnings",
            value: txList
              .filter(
                (t) => t.transactionType === TransactionType.referral_reward,
              )
              .reduce((s, t) => s + Number(t.amount), 0),
            icon: RefreshCw,
            color: "text-gold",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-lg bg-card border border-border/50 p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-muted-foreground text-xs">
                {stat.label}
              </span>
            </div>
            <p className={`font-heading text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl bg-card border border-border/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="font-heading font-bold text-xl text-foreground uppercase tracking-wider">
            Transaction History
          </h2>
        </div>

        {txLoading ? (
          <div
            className="p-6 flex flex-col gap-3"
            data-ocid="wallet.transactions.loading_state"
          >
            {["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : txList.length === 0 ? (
          <div
            className="p-12 text-center"
            data-ocid="wallet.transactions.empty_state"
          >
            <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading text-muted-foreground uppercase tracking-wider">
              No transactions yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-heading uppercase text-xs tracking-wider">
                  Type
                </TableHead>
                <TableHead className="text-muted-foreground font-heading uppercase text-xs tracking-wider">
                  Description
                </TableHead>
                <TableHead className="text-muted-foreground font-heading uppercase text-xs tracking-wider text-right">
                  Amount
                </TableHead>
                <TableHead className="text-muted-foreground font-heading uppercase text-xs tracking-wider">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txList.map((tx, i) => {
                const { label, color } = txTypeLabel(tx.transactionType);
                const sign = txSign(tx.transactionType);
                return (
                  <TableRow
                    key={`tx-${i}-${tx.transactionType}`}
                    className="border-border/30 hover:bg-secondary/30"
                    data-ocid={`wallet.transaction.item.${i + 1}`}
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${color} border-current font-heading text-xs uppercase`}
                      >
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground text-sm">
                      {tx.description}
                    </TableCell>
                    <TableCell
                      className={`text-right font-heading font-bold ${sign === "+" ? "text-green-400" : "text-primary"}`}
                    >
                      {sign}
                      {Number(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatTxTime(tx.timestamp)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}
