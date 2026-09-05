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
        <meta name="description" content="Free occupational driver's license trip log from L and L Law Group. No account needed; saved on your device; export a PDF for the court." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="L and L Law Group" />
        <meta property="og:title" content="Trip Logger | L and L Law Group" />
        <meta property="og:description" content="Every mile, on the record. Free occupational driver's license trip log with PDF export." />
        <meta property="og:url" content="https://ll-trip-logger-local.netlify.app/" />
        <meta property="og:image" content="https://ll-trip-logger-local.netlify.app/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Cartoon magenta car on a winding road with exhaust puffs, headline Trip Logger" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trip Logger | L and L Law Group" />
        <meta name="twitter:image" content="https://ll-trip-logger-local.netlify.app/og.png" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <style jsx global>{`
        :root { --font-body: ${outfit.style.fontFamily}; --font-display: ${playfair.style.fontFamily}; }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}
