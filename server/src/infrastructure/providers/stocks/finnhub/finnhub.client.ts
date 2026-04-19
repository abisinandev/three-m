// import axios from "axios";
// import { FinnhubStock, NormalizedStock } from "./finnhub-types";
// import { env } from "@presentation/express/utils/constants/env.constants";
// import { buildStock, saveStocks } from "./finnhub.utils";

// export async function fetchNYCStocks(): Promise<FinnhubStock[]> {
//   const res = await axios.get<FinnhubStock[]>(
//     `${env.FINNHUB_BASE_URL}${env.FINNHUB_API_KEY_SECRET}`
//   );

//   return res.data;
// }

// export async function SyncStocks(): Promise<void> {
//   const rawStocks = await fetchNYCStocks();

//   const CHUNK_SIZE = 50;
//   const processedStocks: NormalizedStock[] = [];

//   for (let i = 0; i < rawStocks.length; i += CHUNK_SIZE) {
//     const chunk: FinnhubStock[] = rawStocks.slice(i, i + CHUNK_SIZE);

//     const chunkProcessed = await Promise.all(
//       chunk.map(stock => buildStock(stock))
//     );

//     processedStocks.push(...chunkProcessed);

//     await new Promise(resolve => setTimeout(resolve, 500));

//     console.log(
//       `Processed ${Math.min(i + CHUNK_SIZE, rawStocks.length)} of ${rawStocks.length} stocks`
//     );
//   }

//   await saveStocks(processedStocks);
// }