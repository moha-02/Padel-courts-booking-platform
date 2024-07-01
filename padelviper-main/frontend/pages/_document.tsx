import Document, { Html, Head, NextScript, Main } from "next/document";
import { DocumentContext, DocumentInitialProps } from "next/dist/shared/lib/utils";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head > 
          {/* Favicon */}
          <link rel="icon" href="../images/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
