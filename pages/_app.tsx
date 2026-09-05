import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Outfit, Playfair_Display } from "next/font/google";

// Flagship (landllawgroup.com) typography: Playfair Display for display, Outfit for UI/body.
const playfair = Playfair_Display({ variable: "--font-display", subsets: ["latin"], weight: ["700", "800"] });
const outfit = Outfit({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${playfair.variable} ${outfit.variable} min-h-screen flex flex-col bg-[var(--snow)] text-[var(--ink)]`}>
      <Head>
        <title>Trip Logger | L and L Law Group</title>
        <meta name="description" content="Occupational driver's license trip log for L and L Law Group clients." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
