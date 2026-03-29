import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Tournament {
    id: bigint;
    startTime: Time;
    status: TournamentStatus;
    participants: Array<Principal>;
    maxSlots: bigint;
    name: string;
    gameMode: string;
    entryFee: bigint;
    filledSlots: bigint;
    prizePool: bigint;
}
export interface WalletTransaction {
    transactionType: TransactionType;
    description: string;
    timestamp: Time;
    amount: bigint;
}
export interface UserProfile {
    referralCode: string;
    username: string;
    referredBy?: Principal;
    gameUID: string;
    walletBalance: bigint;
    totalReferralEarnings: bigint;
}
export enum TournamentStatus {
    upcoming = "upcoming",
    live = "live",
    completed = "completed"
}
export enum TransactionType {
    other = "other",
    tournament_fee = "tournament_fee",
    deposit = "deposit",
    referral_reward = "referral_reward",
    withdrawal = "withdrawal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTournament(name: string, prizePool: bigint, entryFee: bigint, maxSlots: bigint, startTime: Time, gameMode: string): Promise<bigint>;
    creditCoins(targetUser: Principal, amount: bigint, description: string): Promise<void>;
    depositCoins(amount: bigint, description: string): Promise<void>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllTournaments(): Promise<Array<Tournament>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(user: Principal): Promise<UserProfile | null>;
    getTournamentDetails(tournamentId: bigint): Promise<Tournament>;
    getTransactions(): Promise<Array<WalletTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    joinTournament(tournamentId: bigint): Promise<void>;
    register(username: string, gameUID: string, referralCode: string, referredByCode: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTournamentStatus(tournamentId: bigint, newStatus: TournamentStatus): Promise<void>;
    withdrawCoins(amount: bigint, description: string): Promise<void>;
}
