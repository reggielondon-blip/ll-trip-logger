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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#143350" />
        <meta name="author" content="L and L Law Group, PLLC" />
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Frisco" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        :root { --font-body: ${outfit.style.fontFamily}; --font-display: ${playfair.style.fontFamily}; }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}
