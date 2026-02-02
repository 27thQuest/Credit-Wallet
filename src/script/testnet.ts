import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";


export const sepoliaClient = createPublicClient({
    chain: sepolia,
    transport: http(),

});

//Essentially what I'm doing here is I am making the sepolia client link


