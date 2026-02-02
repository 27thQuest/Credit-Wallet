import "../../index.scss";
import { useState, useEffect } from "react";
import { createWalletClient, custom, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { sepoliaClient } from '../../../script/testnet';


//WALLET THING

type Address = `0x${string}`;

export default function WalletBalance(): JSX.Element {


  const [address, setAddress] = useState<Address | null>(null);
  const [eth, setEth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const connectAndLoad = async () => {
    try {
      setError(null);

      const addr = "0xaE7281756568e9093AB4129F57123681E085a354" as const;
      const bal = await sepoliaClient.getBalance({ address: addr });

      setEth(formatEther(bal));

     
    } catch (e: any) {
      setError(e?.message ?? "something went wrong");
    }
  };

  useEffect(() => {
    connectAndLoad();
  }, []);







  return (
    <div className="coin-asset-amount">
      <div>{eth}</div>
      {error && <p style={{ color: "crimson" }}>k{error}</p>}
    </div>

  )

}