export type ArenaTriviaQuestion = {
  id: string;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
};

/** Rotating pool — correct answer is always one of three options (index 0–2). */
export const ARENA_TRIVIA: ArenaTriviaQuestion[] = [
  {
    id: "base-wallet",
    question: "Which network do RainbowKit / viem typically use for Gems-style L2 wallets in this stack?",
    options: ["Solana", "Base", "Bitcoin L1"],
    correctIndex: 1,
    explanation: "This app’s wagmi config includes Base and Base Sepolia — an Ethereum L2, not Solana or Bitcoin L1.",
  },
  {
    id: "erc20",
    question: "Creator coins on Gems are modeled as which token standard?",
    options: ["ERC-721", "ERC-20", "ERC-1155 only"],
    correctIndex: 1,
    explanation: "Fungible creator coins map to ERC-20; NFT passes/moments use other standards.",
  },
  {
    id: "superfluid",
    question: "Superfluid streaming is used for which idea?",
    options: ["One-time airdrops only", "Per-second money flows (e.g. tips over time)", "Proof-of-work mining"],
    correctIndex: 1,
    explanation: "Superfluid enables continuous streaming payments — a natural fit for live support meters.",
  },
  {
    id: "lp",
    question: "What does adding liquidity to a creator pool usually involve?",
    options: [
      "Depositing a pair of assets into an AMM pool",
      "Burning NFTs permanently",
      "Staking only stablecoins on Bitcoin",
    ],
    correctIndex: 0,
    explanation: "LP means supplying both sides (or wrapped equivalents) to a trading pool so others can swap.",
  },
  {
    id: "nft-gate",
    question: "Token-gated streams check ownership of…",
    options: ["A DNS domain", "An on-chain NFT or balance", "Your email password"],
    correctIndex: 1,
    explanation: "Gates verify wallet-held tokens or NFTs via smart contracts or indexers.",
  },
  {
    id: "sepolia",
    question: "Base Sepolia is primarily a…",
    options: ["Mainnet production chain", "Testnet for development", "Layer 3 on Solana"],
    correctIndex: 1,
    explanation: "Sepolia-family networks are testnets; use them for cheap deploys and QA before mainnet.",
  },
];
