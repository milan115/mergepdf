import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import Head from "next/head";

import { appWithTranslation } from "next-i18next";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/error-page.css";
import "../styles/toolbox.css";
import "../styles/index.css";
import "../styles/dnd-style.css";
import { LangAppWrapper } from "../context/LangAppWrapper";
import Layout from "../components/Layout";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#2988bc" />
        <meta
          name="keywords"
          content="pdf, merger, merge pdf, combine pdf, pdf combiner, rotate pdf"
        />
        <link rel="icon" href="/img/files.png" />
        <link rel="apple-touch-icon" href="/img/files.png" />

        {/* canonical */}
        {/* Here */}
        {/* alternate */}
        {/* Here */}
      </Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        onError={(e) => {
          console.error("gtag Script failed to load", e);
        }}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <LangAppWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LangAppWrapper>
    </>
  );
};

export default appWithTranslation(MyApp);
