// CurrencyNames.tsx
import React, { useEffect, useMemo, useState } from "react";
import tokenImages, { DEFAULT_TOKEN_IMAGE } from "../assets/tokenlogos";
import "../../index.scss";
import { formatEther, formatUnits, type Address } from "viem";

type Asset = {
  symbol: string;
  name: string;
  amount: string; // formatted string
  logo?: string;
};

async function alchemyRpc(rpcUrl: string, method: string, params: any[], id: number) {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });

  if (!res.ok) throw new Error(`Alchemy RPC failed: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? "Alchemy RPC error");
  return json.result;
}

interface CurrencyNamesProps {
  onClose: () => void;
  onSelectToken: (token: Asset) => void;

  // Optional overrides (you can ignore these and it will behave like your WalletBalance snippet)
  wallet?: Address;
  alchemyKey?: string;
  chainRpcBaseUrl?: string; // default Sepolia base
  title?: string;
}

export default function CurrencyNames({
  onClose,
  onSelectToken,
  wallet = "0xc294d6bdB0a7F3c88F56Bea4cE3Ca7ee1fE370D2",
  alchemyKey = "68lX8oDehihnxzyg8UohM",
  chainRpcBaseUrl = "https://eth-sepolia.g.alchemy.com/v2/",
  title = "Select a token",
}: CurrencyNamesProps): JSX.Element {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const rpcUrl = `${chainRpcBaseUrl}${alchemyKey}`;

        // 1) ETH
        const ethHex: string = await alchemyRpc(rpcUrl, "eth_getBalance", [wallet, "latest"], 1);
        const ethWei = BigInt(ethHex);

        const base: Asset[] =
          ethWei === 0n
            ? []
            : [{ symbol: "ETH", name: "Sepolia Ethereum", amount: formatEther(ethWei) }];

        // 2) Auto-detect ERC-20 balances
        const tb = await alchemyRpc(rpcUrl, "alchemy_getTokenBalances", [wallet], 2);
        const tokenBalances = (tb?.tokenBalances ?? []) as Array<{
          contractAddress: string;
          tokenBalance: string | null; // hex string
          error?: string | null;
        }>;

        const nonZero = tokenBalances.filter(
          (t) => t.tokenBalance && BigInt(t.tokenBalance) > 0n && !t.error
        );

        // 3) Metadata + formatting
        const tokenAssets: Asset[] = await Promise.all(
          nonZero.map(async (t, idx) => {
            const contract = t.contractAddress as Address;

            const meta = await alchemyRpc(rpcUrl, "alchemy_getTokenMetadata", [contract], 100 + idx);

            const decimals = Number(meta?.decimals ?? 18);
            const symbol = (meta?.symbol as string) ?? "UNKNOWN";
            const name = (meta?.name as string) ?? "Unknown Token";
            const logo = meta?.logo as string | undefined;

            const raw = BigInt(t.tokenBalance!);
            return {
              symbol,
              name,
              logo,
              amount: formatUnits(raw, decimals),
            };
          })
        );

        tokenAssets.sort((a, b) => a.symbol.localeCompare(b.symbol));

        if (!cancelled) setAssets([...base, ...tokenAssets]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [wallet, alchemyKey, chainRpcBaseUrl]);

  // Only show what user actually has (non-zero), and de-dupe by symbol
  const tokens = useMemo(() => {
    const seen = new Set<string>();

    return (assets ?? [])
      .filter((a) => {
        const amt = Number(a.amount);
        return a.symbol && a.name && !Number.isNaN(amt) && amt > 0;
      })
      .filter((a) => {
        const sym = a.symbol.toUpperCase();
        if (seen.has(sym)) return false;
        seen.add(sym);
        return true;
      });
  }, [assets]);

  const handleSelect = (token: Asset) => {
    onSelectToken(token);
    onClose(); // close immediately after selection
  };

  return (
    <section className="layer-wrap page" role="dialog" aria-modal="true">
      {/* click outside closes */}
      <div className="dimmed" onClick={onClose} />

      {/* stop clicks inside from closing */}
      <div className="layer-container" onClick={(e) => e.stopPropagation()}>
        <header className="layer-header">
          <div className="inner">
            <h3>{title}</h3>
            <button type="button" className="button-close" onClick={onClose} aria-label="Close">
              <i className="blind">Close</i>
            </button>
          </div>
        </header>

        <div className="layer-content">
          <div className="inner">
            <div className="select-token-wrap">
              <div className="currency-list-wrap">
                <div className="lists">
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <p style={{ color: "crimson" }}>{error}</p>
                  ) : tokens.length === 0 ? (
                    <div className="empty-cryptos">There are no cryptos.</div>
                  ) : (
                    tokens.map((a) => (
                      <button
                        key={a.symbol}
                        type="button"
                        className="currency-label"
                        onClick={() => handleSelect(a)}
                      >
                        {/* SAME markup style as TokenSelector */}
                        <img className="token" data-token-size = "36"
                          src={tokenImages[a.symbol.toUpperCase()] ?? DEFAULT_TOKEN_IMAGE}
                          alt={a.symbol}
                        />
                        <div className="name">
                          <div className="full">{a.name}</div>
                          <span>{a.symbol}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
