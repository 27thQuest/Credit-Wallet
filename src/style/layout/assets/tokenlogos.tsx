// src/components/tokenlogos.ts (or wherever this lives)

import eth from "../../../assets/image/token/token-ETH.png";
import usdc from "../../../assets/image/token/token-USDC.png";
import usdt from "../../../assets/image/token/token-USDT.png";
import fallback from "../../../assets/image/token/token-Default.png";
import eurc from "../../../assets/image/token/token-EURC.png"
import quest from "../../../assets/image/token/token-QUEST.png"

const tokenImages: Record<string, string> = {
  ETH: eth,
  USDC: usdc,
  USDT: usdt,
  EURC: eurc,
  QUEST: quest,
};

export const DEFAULT_TOKEN_IMAGE = fallback;
export default tokenImages;
