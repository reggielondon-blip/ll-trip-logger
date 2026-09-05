import Document, { Html, Head, Main, NextScript, type DocumentContext, type DocumentInitialProps } from "next/document";

type Props = DocumentInitialProps & { lang: string };

// Server-rendered <html lang> per route: /es/ is Spanish, everything else English.
export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const initial = await Document.getInitialProps(ctx);
    const lang = ctx.pathname.startsWith("/es") ? "es" : "en";
    return { ...initial, lang };
  }
  render() {
    return (
      <Html lang={this.props.lang}>
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
