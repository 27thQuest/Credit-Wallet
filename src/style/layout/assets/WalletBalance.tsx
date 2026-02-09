import "../../index.scss";
import { WALLET_ADDRESS, TEST_PRIVATE_KEY, ALCHEMY_RPC_URL, ALCHEMY_RPC_API } from "../walletaddress.ts";
import tokenImages, { DEFAULT_TOKEN_IMAGE } from "./tokenlogos";
import { useEffect, useState } from "react";
import { formatEther, formatUnits, type Address } from "viem";

type Asset = {
  symbol: string;
  name: string;
  amount: string;
  logo?: string;
};

//Initial knock on alchemy, so its sending it the json prc, and awaiting for a response.
async function alchemyRpc(rpcUrl: string, method: string, params: any[], id: number) {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });


  if (!res.ok) throw new Error(`Alchemy RPC failed: ${res.status}`);
  const json = await res.json();
  // console.log(json);
  if (json.error) throw new Error(json.error.message ?? "Alchemy RPC error");
  return json.result;
}
//change to creating viem client instance 
//send w viem or with a similar fetch kind of way.

export default function WalletBalance(): JSX.Element {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      
      const alchemyKey = ALCHEMY_RPC_API;
      const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;

      // 1) ETH
      const ethHex: string = await alchemyRpc(rpcUrl, "eth_getBalance", [WALLET_ADDRESS, "latest"], 1);
      const ethWei = BigInt(ethHex);

      const ethAmount = formatEther(ethWei);

      const out: Asset[] =
        ethWei === 0n
          ? []
          : [{ symbol: "ETH", name: "Sepolia Ethereum", amount: ethAmount }];




      // 2) Auto-detect ERC-20 token balances
      const tb = await alchemyRpc(rpcUrl, "alchemy_getTokenBalances", [WALLET_ADDRESS], 2);
      const tokenBalances = (tb?.tokenBalances ?? []) as Array<{
        contractAddress: string;
        tokenBalance: string | null; // hex
        error?: string | null;
      }>;

      const nonZero = tokenBalances.filter(
        (t) => t.tokenBalance && BigInt(t.tokenBalance) > 0n && !t.error
      );

      // 3) Metadata + formatting
      const tokenAssets = await Promise.all(
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
          } satisfies Asset;
        })
      );

      // optional: sort
      tokenAssets.sort((a, b) => a.symbol.localeCompare(b.symbol));

      setAssets([...out, ...tokenAssets]);
    } catch (e: any) {
      setError(e?.message ?? "something went wrong");
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    load();
  }, []);

  if (!loading && assets.length === 0 && !error) {

    return (
      <>
        <img
          className="list-empty-graphic"
          src="src/assets/image/graphicEmpty.svg"
        />
        <div className="empty-cryptos">There are no cryptos.</div>
        <button className="add-token-button">Add tokens</button>
      </>
    );
  }

  return (
    <>
      {loading && <div>Loading...</div>}

      {assets.map((a) => (
        <div className="coin-asset-div" key={a.symbol}>
          <div className="coin-asset">
            <img
              src={tokenImages[a.symbol.toUpperCase()] ?? DEFAULT_TOKEN_IMAGE}
              alt={a.symbol}
            />


            <div className="coin-asset-text">
              <div className="coin-asset-ticker">{a.symbol}</div>
              <div className="coin-asset-fullname">{a.name}</div>
            </div>
          </div>

          <div className="coin-asset-amount">
            {Number(a.amount).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 100,
            })}
          </div>
        </div>
      ))}



      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </>
  );

}
