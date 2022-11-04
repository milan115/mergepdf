import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <div className="modal-open">
            <div id="modal-root"></div>
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
