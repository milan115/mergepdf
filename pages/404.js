import React, { useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAppContext } from "../context/LangAppWrapper";
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["page404", "common"])),
    },
  };
}

const NotFound = (props) => {
  const { t, i18n } = useAppContext();
  const dir = i18n.dir();

  return (
    <>
      <Head>
        <title>{t("common:error_page_title")}</title>
        <meta name="description" content={t("common:description_text")} />
      </Head>

      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h3>{t("page404:oops")}</h3>
            <h1>
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </h1>
          </div>
          <h2>{t("page404:we_are_sorry")}</h2>
          <p style={{ direction: dir }}>
            {t("page404:go_back_to")}{" "}
            <Link href="/">
              <a>Homepage</a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
