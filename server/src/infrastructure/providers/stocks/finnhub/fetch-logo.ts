// import { env } from "@presentation/express/utils/constants/env.constants";
// import axios from "axios";

// export async function getLogo(symbol: string) {
//     try {
//         const res = await axios.get(
//             env.FINNHUB_LOGO_URL,
//             {
//                 params: {
//                     symbol,
//                     token: env.FINNHUB_API_KEY_SECRET
//                 }
//             } 
//         );
//         console.log("Symbol logo: ", res.data.logo);
//         return res.data.logo || null;
//     } catch {
//         return null;
//     }
// }