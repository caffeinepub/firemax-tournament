import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type TournamentStatus = {
    #upcoming;
    #live;
    #completed;
  };

  type TransactionType = {
    #deposit;
    #withdrawal;
    #tournament_fee;
    #referral_reward;
    #other;
  };

  type WalletTransaction = {
    transactionType : TransactionType;
    amount : Nat;
    timestamp : Time.Time;
    description : Text;
  };

  type Tournament = {
    id : Nat;
    name : Text;
    prizePool : Nat;
    entryFee : Nat;
    maxSlots : Nat;
    filledSlots : Nat;
    startTime : Time.Time;
    status : TournamentStatus;
    gameMode : Text;
    participants : [Principal];
  };

  type UserProfile = {
    username : Text;
    gameUID : Text;
    walletBalance : Nat;
    referralCode : Text;
    referredBy : ?Principal;
    totalReferralEarnings : Nat;
  };

  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.username, p2.username);
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Principal, List.List<WalletTransaction>>();
  let tournaments = Map.empty<Nat, Tournament>();
  var tournamentIdCounter = 0;

  // Required Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin Functions
  public shared ({ caller }) func createTournament(name : Text, prizePool : Nat, entryFee : Nat, maxSlots : Nat, startTime : Time.Time, gameMode : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };
    let id = tournamentIdCounter;
    tournamentIdCounter += 1;

    let tournament : Tournament = {
      id;
      name;
      prizePool;
      entryFee;
      maxSlots;
      filledSlots = 0;
      startTime;
      status = #upcoming;
      gameMode;
      participants = [];
    };

    tournaments.add(id, tournament);
    id;
  };

  public shared ({ caller }) func updateTournamentStatus(tournamentId : Nat, newStatus : TournamentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tournament status");
    };
    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        let updatedTournament : Tournament = {
          tournament with status = newStatus;
        };
        tournaments.add(tournamentId, updatedTournament);
      };
    };
  };

  public shared ({ caller }) func creditCoins(targetUser : Principal, amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can credit coins");
    };
    let profile = switch (userProfiles.get(targetUser)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let updatedProfile : UserProfile = {
      profile with walletBalance = profile.walletBalance + amount;
    };
    userProfiles.add(targetUser, updatedProfile);

    let transaction : WalletTransaction = {
      transactionType = #deposit;
      amount;
      timestamp = Time.now();
      description;
    };

    let userTransactions = switch (transactions.get(targetUser)) {
      case (null) { List.empty<WalletTransaction>() };
      case (?t) { t };
    };
    userTransactions.add(transaction);
    transactions.add(targetUser, userTransactions);
  };

  // User Functions
  public shared ({ caller }) func register(username : Text, gameUID : Text, referralCode : Text, referredByCode : ?Text) : async () {
    // Anyone can register (including guests), no authorization check needed
    if (userProfiles.containsKey(caller)) { Runtime.trap("Already registered") };
    
    // Find referrer if referral code provided
    var referredBy : ?Principal = null;
    switch (referredByCode) {
      case (null) {};
      case (?code) {
        // Search for user with matching referral code
        for ((principal, profile) in userProfiles.entries()) {
          if (profile.referralCode == code) {
            referredBy := ?principal;
          };
        };
      };
    };

    let newProfile : UserProfile = {
      username;
      gameUID;
      walletBalance = 0;
      referralCode;
      referredBy;
      totalReferralEarnings = 0;
    };
    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func depositCoins(amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit coins");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let updatedProfile : UserProfile = {
      profile with walletBalance = profile.walletBalance + amount;
    };
    userProfiles.add(caller, updatedProfile);

    let transaction : WalletTransaction = {
      transactionType = #deposit;
      amount;
      timestamp = Time.now();
      description;
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { List.empty<WalletTransaction>() };
      case (?t) { t };
    };
    userTransactions.add(transaction);
    transactions.add(caller, userTransactions);
  };

  public shared ({ caller }) func withdrawCoins(amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw coins");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    if (profile.walletBalance < amount) { Runtime.trap("Insufficient balance") };
    let updatedProfile : UserProfile = {
      profile with walletBalance = profile.walletBalance - amount;
    };
    userProfiles.add(caller, updatedProfile);

    let transaction : WalletTransaction = {
      transactionType = #withdrawal;
      amount;
      timestamp = Time.now();
      description;
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { List.empty<WalletTransaction>() };
      case (?t) { t };
    };
    userTransactions.add(transaction);
    transactions.add(caller, userTransactions);
  };

  public shared ({ caller }) func joinTournament(tournamentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join tournaments");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let tournament = switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };

    if (profile.walletBalance < tournament.entryFee) {
      Runtime.trap("Insufficient balance");
    };
    if (tournament.filledSlots >= tournament.maxSlots) { Runtime.trap("Tournament is full") };

    // Check if already joined
    for (participant in tournament.participants.vals()) {
      if (participant == caller) {
        Runtime.trap("Already joined this tournament");
      };
    };

    // Deduct entry fee
    let updatedProfile : UserProfile = {
      profile with walletBalance = profile.walletBalance - tournament.entryFee;
    };
    userProfiles.add(caller, updatedProfile);

    // Record tournament fee transaction
    let feeTransaction : WalletTransaction = {
      transactionType = #tournament_fee;
      amount = tournament.entryFee;
      timestamp = Time.now();
      description = "Tournament entry: " # tournament.name;
    };

    let userTransactions = switch (transactions.get(caller)) {
      case (null) { List.empty<WalletTransaction>() };
      case (?t) { t };
    };
    userTransactions.add(feeTransaction);
    transactions.add(caller, userTransactions);

    // Add participant
    let newParticipants = tournament.participants.concat([caller]);
    let updatedTournament : Tournament = {
      tournament with
      participants = newParticipants;
      filledSlots = tournament.filledSlots + 1;
    };
    tournaments.add(tournamentId, updatedTournament);

    // Handle referral reward (only on first tournament)
    switch (profile.referredBy) {
      case (null) {};
      case (?referrer) {
        // Check if this is the first tournament for the user
        var isFirstTournament = true;
        for ((tid, t) in tournaments.entries()) {
          if (tid != tournamentId) {
            for (p in t.participants.vals()) {
              if (p == caller) {
                isFirstTournament := false;
              };
            };
          };
        };

        if (isFirstTournament) {
          let referrerProfile = switch (userProfiles.get(referrer)) {
            case (null) { /* Referrer deleted, skip reward */ };
            case (?rp) {
              let updatedRefProfile : UserProfile = {
                rp with
                walletBalance = rp.walletBalance + 50;
                totalReferralEarnings = rp.totalReferralEarnings + 50;
              };
              userProfiles.add(referrer, updatedRefProfile);

              // Record referral reward transaction
              let transaction : WalletTransaction = {
                transactionType = #referral_reward;
                amount = 50;
                timestamp = Time.now();
                description = "Referral reward for " # profile.username;
              };

              let referrerTransactions = switch (transactions.get(referrer)) {
                case (null) { List.empty<WalletTransaction>() };
                case (?t) { t };
              };
              referrerTransactions.add(transaction);
              transactions.add(referrer, referrerTransactions);
            };
          };
        };
      };
    };
  };

  // Query Functions
  public query ({ caller }) func getWalletBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet balance");
    };
    switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.walletBalance };
    };
  };

  public query ({ caller }) func getTournamentDetails(tournamentId : Nat) : async Tournament {
    // Public information, no authorization needed
    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };
  };

  public query ({ caller }) func getTransactions() : async [WalletTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?txs) { txs.toArray() };
    };
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?UserProfile {
    // Deprecated: Use getUserProfile instead
    // Only allow viewing own profile or admin viewing any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllTournaments() : async [Tournament] {
    // Public information, no authorization needed
    tournaments.values().toArray();
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    // Only admins can view all profiles due to sensitive data
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.values().toArray().sort();
  };
};
