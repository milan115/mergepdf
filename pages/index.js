import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Lightbulb,
  Lock,
  HandThumbsUp,
  FileCheck,
  Award,
  Cloud,
  WindowFullscreen,
} from "react-bootstrap-icons";
import Container from "../components/DND/Container.js";
import { useAppContext } from "../context/LangAppWrapper";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}

const Home = () => {
  const { t, i18n } = useAppContext();
  const dir = i18n.dir();
  const langStyle = {
    direction: dir,
    textAlign: dir === "rtl" ? "start" : "",
  };

  return (
    <>
      <Head>
        <title>{t("common:index_page_title")}</title>
        <meta name="description" content={t("common:description_text")} />
      </Head>
      <div className="page-section pt-0">
        <main className="main" id="main" role="main">
          <article className="article content" id="content">
            <section className="" id="section_top">
              <div className="container" style={langStyle}>
                <h1 className="h1 mb-5  d-flex justify-content-center align-items-center">
                  {t("home:page_title")}
                </h1>
                <h2 className="pb">{t("home:page_header_text")}</h2>
              </div>
            </section>
            <Container />
          </article>
        </main>
      </div>

      <div className="page-section pt-0 ">
        <div className="wrap ">
          <div className="container banner-info">
            <div className="row align-items-center">
              <div className="css-144tf61">
                <div className="css-1yxrvuu">
                  <div className="css-wvod" style={langStyle}>
                    <p className="css-1ablg7u">{t("home:how_to_title")}</p>
                  </div>
                  <div className="css-8m80m1">
                    <div className="css-139q39o">
                      <div className="css-1nym96n">01</div>
                      <div className="css-1viyoha" style={langStyle}>
                        <h3 className="css-1swband">
                          {t("home:how_to_step_one")}
                        </h3>
                      </div>
                    </div>
                    <div className="css-139q39o">
                      <div className="css-1nym96n">02</div>
                      <div className="css-1viyoha" style={langStyle}>
                        <h3 className="css-1swband">
                          {t("home:how_to_step_two")}
                        </h3>
                      </div>
                    </div>
                    <div className="css-139q39o">
                      <div className="css-1nym96n">03</div>
                      <div className="css-1viyoha" style={langStyle}>
                        <h3 className="css-1swband">
                          {t("home:how_to_step_three")}
                        </h3>
                      </div>
                    </div>
                    <div className="css-139q39o">
                      <div className="css-1nym96n">04</div>
                      <div className="css-1viyoha" style={langStyle}>
                        <h3 className="css-1swband">
                          {t("home:how_to_step_four")}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section pt-0 ">
        <div className="container">
          <div className="text-center" style={langStyle}>
            <div className="subhead">{t("home:our_services")}</div>
            <h2 className="title-section">{t("home:how_we_can_help_title")}</h2>
            <div className="divider mx-auto"></div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <Lightbulb />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_one_title")}</h5>
                  <p>{t("home:how_we_can_help_one_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <HandThumbsUp />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_two_title")}</h5>
                  <p>{t("home:how_we_can_help_two_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <Lock />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_three_title")}</h5>
                  <p>{t("home:how_we_can_help_three_text")}</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <FileCheck />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_four_title")}</h5>
                  <p>{t("home:how_we_can_help_four_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <Award />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_five_title")}</h5>
                  <p>{t("home:how_we_can_help_five_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 col-xl-4 py-3">
              <div className="features">
                <div className="header mb-3">
                  <WindowFullscreen />
                </div>
                <div style={langStyle}>
                  <h5>{t("home:how_we_can_help_sixe_title")}</h5>
                  <p>{t("home:how_we_can_help_sixe_text")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
