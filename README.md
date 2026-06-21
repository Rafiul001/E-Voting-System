# E‑Voting System on Private Blockchain

A secure, end‑to‑end electronic voting platform built on a **permissioned Hyperledger Fabric** network. The system separates voter eligibility, candidate management, and vote tallying into independent smart contracts (chaincodes), and exposes them through role‑based web panels for election authorities, district operators, and voting machines.

> 📄 **Publication:** This work was published as an IEEE Conference Paper.
> 👉 [Read it on IEEE Xplore](https://ieeexplore.ieee.org/document/11546455)

---

## Overview

Traditional electronic voting struggles with trust: a single authority controls the data, so results can be tampered with or repudiated. This project addresses that by recording the election lifecycle and votes on a **private, multi‑organization blockchain** where no single party can unilaterally alter the ledger.

Two organizations jointly operate the network:

- **Election Commission** — the central authority that defines elections and candidates.
- **District Commission** — the regional authority that issues voter permits and operates voting machines on the ground.

A voter is never stored on‑chain in identifiable form. Instead, the voter receives a one‑time **permit** (a hashed credential). The permit is validated and *spent* at the moment of voting, which guarantees **one person, one vote** without linking the vote back to the voter — preserving ballot secrecy while preventing double voting.

### How a vote flows

1. **Election Commission** initializes an election and registers candidates per constituency (`election-cc`, `candidate-cc`).
2. **District Commission** issues a voter a single‑use permit (`voter-permit-cc`).
3. At a polling station, the **voting machine** authenticates the voter, validates the permit, and casts the ballot.
4. The vote is recorded and counted on‑chain (`vote-tally-cc`), and the permit is marked as spent so it cannot be reused.
5. After polls close, the election is finished and tallies are read directly from the immutable ledger.

---

## Architecture

```
                        ┌───────────────────────────────────────────┐
                        │      Hyperledger Fabric Network            │
                        │      Channel: votingchannel                │
                        │                                            │
   ┌─────────────┐      │   Org1: ElectionCommissionMSP              │
   │ Admin Panel │◄────►│   Org2: DistrictCommissionMSP             │
   │  (Election  │      │                                            │
   │ Commission) │      │   Chaincodes (smart contracts):           │
   └─────────────┘      │     • election-cc      (election lifecycle)│
                        │     • candidate-cc     (candidates/const.) │
   ┌─────────────┐      │     • voter-permit-cc  (eligibility/permit)│
   │  Operator   │◄────►│     • vote-tally-cc    (cast & count votes)│
   │   Panels    │      │                                            │
   │ (District   │      │   Orderer (solo) · CouchDB state DB · CA   │
   │ Commission) │      └───────────────────────────────────────────┘
   └─────────────┘
          │
          ▼  WebSocket (operator ↔ machine coordination)
   ┌─────────────┐
   │ Machine App │  (in‑booth voting client)
   └─────────────┘
```

Each web panel has a **Node/Express API** (the Fabric gateway client) that connects to the network using the Fabric SDK, and a **React frontend**. Off‑chain data (admin/operator accounts, user images, lookup metadata) is stored in **MongoDB**, while all election‑critical state lives on the blockchain.

---

## Repository Structure

```
e-voting-system-main/
├── network/                 # Hyperledger Fabric network scripts & config
│   ├── network.sh           # Bring up network, create channel, join peers
│   ├── deploy_*_cc.sh       # Chaincode deployment scripts (per contract)
│   ├── configtx/            # Channel & genesis configuration (configtx.yaml)
│   ├── compose-*.yaml       # Docker Compose templates (peers, orderer, CA)
│   └── register-enroll-*.sh # Fabric CA identity registration/enrollment
│
├── chaincodes/              # On‑chain smart contracts (TypeScript)
│   ├── election-cc/         # Election lifecycle: Initialize/Start/Finish
│   ├── candidate-cc/        # Candidates & constituencies
│   ├── voter-permit-cc/     # One‑time voter permits (issue/spend)
│   └── vote-tally-cc/       # Cast vote & tally results
│
├── admin-panel/             # Election Commission panel
│   ├── api/                 # Express + Fabric SDK gateway, MongoDB
│   └── client/              # React + Vite + Tailwind frontend
│
├── operatorPanel/           # District Commission panels
│   ├── api/                 # Express + Fabric SDK gateway + WebSocket server
│   ├── districtCommissionAdminPanel/  # District admin frontend (React)
│   ├── operatorPanelFrontend/         # Polling‑station operator frontend
│   └── machineApp/                    # In‑booth voting machine app
│
├── commands.txt             # Reference CLI commands (peer invoke examples)
└── README.md
```

---

## Smart Contracts (Chaincodes)

| Chaincode | Responsibility | Key transactions |
|-----------|----------------|------------------|
| **election-cc** | Election lifecycle and state | `Initialize`, `StartElection`, `FinishElection`, `getAllElection`, `getElectionById`, `isStarted`, `checkAlreadyFinished` |
| **candidate-cc** | Candidate & constituency registry | `CreateCandidate`, `addConstituency`, `RemoveConstituency`, `DeleteCandidate`, `getAllCandidatesByElectionId`, `getAllCandidatesByConstituencyNumber` |
| **voter-permit-cc** | Eligibility & double‑vote prevention | `IssuePermit`, `SpendPermit`, `getPermit` |
| **vote-tally-cc** | Ballot casting & counting | `CastVote`, `GetTally`, `GetConstituencyTallies`, `GetElectionTallies` |

Chaincodes are written with `fabric-contract-api` / `fabric-shim` and run on Node ≥ 20.

---

## Tech Stack

**Blockchain / Network**
- Hyperledger Fabric 2.x (permissioned, 2 orgs, 1 channel `votingchannel`)
- Fabric CA for identity management
- CouchDB as the state database
- Solo orderer
- Docker / Docker Compose

**Smart Contracts**
- TypeScript, `fabric-contract-api`, `fabric-shim`

**Backend APIs (Admin & Operator panels)**
- Node.js + Express 5 (TypeScript)
- `fabric-network` / `fabric-ca-client` (Fabric Gateway SDK)
- MongoDB (off‑chain data) via the official `mongodb` driver
- JWT authentication (`jsonwebtoken`) + `bcryptjs` password hashing
- `zod` validation, `multer` file uploads, `cors`, `dotenv`
- `ws` (WebSocket) for operator ↔ machine real‑time coordination

**Frontends (React apps)**
- React 19 + TypeScript + Vite
- Tailwind CSS
- `zustand` (state), `axios`, `react-router`, `react-toastify`
- `jwt-decode`, `react-hook-form`

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Hyperledger Fabric binaries & images](https://hyperledger-fabric.readthedocs.io/) v2.x (`peer`, `orderer`, `configtxgen`, `fabric-ca-client` on your `PATH`)
- Node.js ≥ 20 and npm
- MongoDB instance (local or remote)

---

## Getting Started

### 1. Bring up the blockchain network

```bash
cd network

# Start network, create the channel, enroll CA identities
./network.sh up createChannel -s couchdb -ca

# Deploy each chaincode
./deploy_election_cc.sh
./deploy_candidate_cc.sh
./deploy_voter_permit_cc.sh
./deploy_vote_tally_cc.sh
```

> See [network/readme.txt](network/readme.txt) for the org/channel layout and the
> files you may need to edit for your environment, and [commands.txt](commands.txt)
> for example `peer chaincode invoke` calls.

### 2. Configure environment variables

Each API (`admin-panel/api`, `operatorPanel/api`) reads a `.env` file:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=evoting
JWT_PRIVATE_KEY=your-secret-key
```

### 3. Run the Admin Panel (Election Commission)

```bash
# API
cd admin-panel/api
npm install
npm run dev          # nodemon + ts-node on PORT (default 3000)

# Frontend
cd ../client
npm install
npm run dev          # Vite dev server
```

### 4. Run the Operator Panels (District Commission)

```bash
# API (also starts a WebSocket server on ws://localhost:4000)
cd operatorPanel/api
npm install
npm run dev

# Frontends — run each as needed
cd ../districtCommissionAdminPanel && npm install && npm run dev
cd ../operatorPanelFrontend        && npm install && npm run dev
cd ../machineApp                   && npm install && npm run dev
```

---

## API Surface (v1)

**Admin Panel** (`/api/v1`): `admin`, `voter`, `candidate`, `election`, `constituency`, `vote`

**Operator Panel** (`/api/v1`): `auth`, `operator`, `machine`, `vote`, `permit`, `voter`, `candidate`, `election`, `constituency`

The operator API additionally runs a WebSocket server (`ws://localhost:4000`) that relays messages between operator clients and voting machines using client IDs.

---

## Security Model

- **Permissioned ledger** — only enrolled, CA‑issued identities from the two organizations can transact.
- **Ballot secrecy** — votes are recorded against permits/constituencies, not voter identities.
- **One‑person‑one‑vote** — permits are single‑use; spending a permit is an atomic on‑chain operation, preventing double voting.
- **Immutability & auditability** — election lifecycle and tallies are append‑only on the Fabric ledger.
- **Authenticated panels** — JWT‑based auth with bcrypt‑hashed credentials for all web access.

---

## Citation

If you use or reference this work, please cite the IEEE conference paper:

> *E‑Voting System on Private Blockchain*, IEEE.
> https://ieeexplore.ieee.org/document/11546455

---

## License

ISC (see individual `package.json` files).
