import React, { useContext } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAppContext } from "../context/LangAppWrapper";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["contact", "common"])),
    },
  };
}

const Contacts = () => {
  const { t, i18n } = useAppContext();
  const dir = i18n.dir();
  return (
    <>
      <Head>
        <title>{t("common:contacts_page_title")}</title>
        <meta name="description" content={t("common:description_text")} />
      </Head>

      <div className="page-section pt-0">
        <main className="main" id="main" role="main">
          <article className="article content" id="content">
            <section className="" id="section_top">
              <div
                className="container"
                style={{
                  direction: dir,
                  textAlign: "start",
                }}
              >
                <h1 className="h1 mb-5  d-flex justify-content-center align-items-center">
                  {t("common:contact")}
                </h1>
                <p className="pb">{t("contact:contact_text")}</p>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
};

export default Contacts;
