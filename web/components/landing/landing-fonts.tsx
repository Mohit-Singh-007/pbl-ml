import { Fraunces, IBM_Plex_Mono } from "next/font/google";

export const display = Fraunces({ subsets: ["latin"], display: "swap" });
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
