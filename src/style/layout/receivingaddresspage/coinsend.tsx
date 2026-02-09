import { useEffect, useState } from "react";
import { WALLET_ADDRESS, TEST_PRIVATE_KEY, ALCHEMY_RPC_URL } from "../walletaddress.ts";

import {
  JsonRpcProvider,
  Wallet,
  parseEther,
  isAddress,
  Contract,
  parseUnits,
} from "ethers";

// ✅ Known Sepolia token contracts (add more here)
const SEPOLIA_CONTRACTS: Record<string, { address: string; decimals: number }> =
  {
    USDC: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
    },
    QUEST:{
        address: "0x883175D1Be03b39c92fd3d421C8C7D4F3B738127",
        decimals: 18,
    }
  };

type Asset = {
  symbol: string; // "ETH", "USDC", etc
  name: string;

  // Optional: you can still pass these in from your token list
  contractAddress?: string;
  decimals?: number;
};

type Props = {
  open: boolean;

  token: Asset; // currency info
  amount: string; // human-readable amount, e.g. "1.5"
  toAddress: string; // receiving wallet

  onClose: () => void;
};

type Stage = "sending" | "sent" | "error";

// ✅ Alchemy Sepolia RPC

// ⚠️ HARD CODED TEST PRIVATE KEY (Sepolia ONLY)
// IMPORTANT: do not commit real keys

// Minimal ERC20 ABI for transfers
const ERC20_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];

export default function CoinSend({
  open,
  token,
  amount,
  toAddress,
  onClose,
}: Props) {
  const [stage, setStage] = useState<Stage>("sending");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const send = async () => {
      try {
        setStage("sending");
        setErrorMsg("");
        setTxHash("");

        // ✅ Guards
        if (!isAddress(toAddress)) throw new Error("Invalid address format.");

        const n = Number(amount);
        if (!amount || !Number.isFinite(n) || n <= 0) {
          throw new Error("Invalid amount.");
        }

        if (!token) throw new Error("Missing currency/token info.");

        console.log("Sending token:", token.symbol);
        console.log("Sending amount:", amount);
        console.log("To address:", toAddress);

        // ✅ Provider = Alchemy RPC
        const provider = new JsonRpcProvider(ALCHEMY_RPC_URL);

        // ✅ Signer = Wallet(privateKey)
        const wallet = new Wallet(TEST_PRIVATE_KEY, provider);

        // ✅ ETH (native)
        if (token.symbol === "ETH") {
          const txResponse = await wallet.sendTransaction({
            to: toAddress,
            value: parseEther(amount),
          });

          if (cancelled) return;
          setTxHash(txResponse.hash);
          setStage("sent");
          return;
        }

        // ✅ ERC20 (any token)
        let contractAddress = token.contractAddress;
        let decimals = token.decimals;

        // Auto-fill known token info (like USDC)
        const known = SEPOLIA_CONTRACTS[token.symbol];
        if (!contractAddress && known) {
          contractAddress = known.address;
          decimals = known.decimals;
        }

        if (!contractAddress) {
          throw new Error(`Missing contract address for ${token.symbol}.`);
        }

        if (decimals == null) {
          throw new Error(`Missing decimals for ${token.symbol}.`);
        }

        if (!isAddress(contractAddress)) {
          throw new Error(`Invalid contract address for ${token.symbol}.`);
        }

        const contract = new Contract(contractAddress, ERC20_ABI, wallet);
        const tokenAmount = parseUnits(amount, decimals);

        const txResponse = await contract.transfer(toAddress, tokenAmount);

        if (cancelled) return;
        setTxHash(txResponse.hash);
        setStage("sent");
      } catch (err: any) {
        if (cancelled) return;
        setStage("error");
        setErrorMsg(err?.message || "Send failed");
      }
    };

    send();

    return () => {
      cancelled = true;
    };
  }, [open, token, amount, toAddress]);

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        {stage === "sending" && (
          <>
            <h2>Sending...</h2>
            <p>
              {amount} {token.symbol} → {toAddress.slice(0, 6)}...
            </p>
          </>
        )}

        {stage === "sent" && (
          <>
            <h2>✅ Sent!</h2>
            <p>
              Sent {amount} {token.symbol}
            </p>
            <p>{txHash}</p>
          </>
        )}

        {stage === "error" && (
          <>
            <h2>❌ Error</h2>
            <p>{errorMsg}</p>
          </>
        )}

        <button onClick={onClose} disabled={stage === "sending"}>
          Close
        </button>
      </div>
    </div>
  );
}
