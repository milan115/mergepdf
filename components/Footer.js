import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Facebook, Twitter, Reddit } from "react-bootstrap-icons";
import { useAppContext } from "../context/LangAppWrapper";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Footer = React.memo(function Footer() {
  const { t } = useAppContext();

  const mountedRef = useRef();
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  function share(i) {
    const wSize = "width=600,height=460",
      title = "share",
      // Sharer URLs
      fb = "https://www.facebook.com/sharer/sharer.php?u=", // 0. Facebook
      rd = "http://reddit.com/submit?url=", // 1. Reddit
      // URLs array
      url = [fb, rd];
    if (mountedRef.current) {
      const loc = encodeURIComponent(window.location.href);
      window.open(url[i] + loc, title, wSize);
    }
  }

  function twitter() {
    const wSize = "width=600,height=460";
    const title = "share";
    const tw = "https://twitter.com/share?url=";
    const text = "Title";
    const hashtag = "hashtags=Tags";
    if (mountedRef.current) {
      const loc = encodeURIComponent(window.location.href);
      window.open(tw + loc + "&" + text + "&" + hashtag, title, wSize);
    }
  }

  return (
    <footer className="page-footer">
      <div className="container text-center">
        <div className="row">
          <div className="col-lg-12">
            <Link href="/">
              <a>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  <span style={{ color: "#2988bc" }}>PDF</span>
                  <span style={{ color: "rgb(45, 55, 72)" }}>Merger</span>
                </h3>
              </a>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul className="footer-menu">
              <li>
                <Link href="/about">{t("common:about")}</Link>
              </li>
              <li>
                <Link href="/privacy-policy">{t("common:privacy")}</Link>
              </li>
              <li>
                <Link href="/terms-of-use">{t("common:terms")}</Link>
              </li>
              <li>
                <Link href="/contacts">{t("common:contact")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 py-3">
            <div className="social-media-button">
              <div className="share-Btn ml-2 mr-2" onClick={() => share(0)}>
                <Facebook />
              </div>

              <div className="ml-2 mr-2 share-Btn" onClick={() => twitter()}>
                <Twitter />
              </div>

              <div className="share-Btn ml-2 mr-2" onClick={() => share(1)}>
                <Reddit />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 py-3 d-flex justify-content-center">
            <p className="text-center" id="copyright">
              Copyright &copy;{" "}
              <Link href="/">
                <a target="_blank">PDFMerger 2022</a>
              </Link>
              . {t("common:all_rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
