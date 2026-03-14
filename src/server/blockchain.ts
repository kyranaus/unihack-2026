// src/server/blockchain.ts
import { createHash } from "node:crypto"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"

export const BASE_SEPOLIA_EXPLORER = "https://sepolia.basescan.org/tx"

const rpcUrl = `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`

const account = privateKeyToAccount(
  `0x${process.env.METAMASK_PRIVATE_KEY}` as `0x${string}`,
)

console.log(`[Blockchain] Wallet address: ${account.address}`)
console.log(`[Blockchain] RPC: ${rpcUrl.replace(/\/v2\/.+/, "/v2/***")}`)

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
})

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(rpcUrl),
})

export async function storeHashOnChain(sha256Hex: string): Promise<string> {
  console.log(`[Blockchain] Sending tx with hash data (${sha256Hex.slice(0, 16)}...)`)
  const balance = await publicClient.getBalance({ address: account.address })
  console.log(`[Blockchain] Wallet balance: ${balance} wei`)
  if (balance === 0n) {
    throw new Error(`Wallet ${account.address} has 0 balance on Base Sepolia — fund it at https://www.alchemy.com/faucets/base-sepolia`)
  }
  const txHash = await walletClient.sendTransaction({
    to: account.address,
    value: 0n,
    data: `0x${sha256Hex}` as `0x${string}`,
  })
  console.log(`[Blockchain] Tx sent: ${txHash}, waiting for receipt...`)
  await publicClient.waitForTransactionReceipt({ hash: txHash })
  console.log(`[Blockchain] Tx confirmed: ${txHash}`)
  return txHash
}

export async function getHashFromChain(txHash: string): Promise<string> {
  const tx = await publicClient.getTransaction({
    hash: txHash as `0x${string}`,
  })
  return tx.input.slice(2)
}

export function sha256Hex(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex")
}
