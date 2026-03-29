# FireMax Tournament

## Current State
New project. Empty Motoko backend with React frontend scaffold.

## Requested Changes (Diff)

### Add
- User authentication (Internet Identity / anonymous login simulating Google/phone)
- Wallet system: balance display, deposit/withdraw history, coin transactions
- Tournament listing and joining system: browse tournaments, join with entry fee deducted from wallet
- Referral system: unique referral code per user, earn coins when referred users join
- User profile: game UID, username, referral code, stats
- Admin: create tournaments, manage entries

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: User profiles with wallet balance, referral codes, tournament CRUD, join tournament (deduct fee, track entries), referral reward on join
2. Frontend: Dark gaming UI with orange accents, login page, dashboard, tournament lobby, wallet page, referral page
3. Components: authorization for login, wallet transactions stored on-chain
