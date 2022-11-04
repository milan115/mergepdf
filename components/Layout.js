import Nav from "./Nav";
import Footer from "./Footer";
import React, { useEffect, useRef } from "react";
import { ArrowUpSquareFill } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const Layout = ({ children, title }) => {
  const backToTop = useRef();

  useEffect(() => {
    const btn = backToTop.current;
    const handleClick = function (evt) {
      evt.preventDefault();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    btn.addEventListener("click", handleClick);

    const handleScroll = function () {
      document.body.scrollTop > 300
        ? btn.classList.add("show")
        : btn.classList.remove("show");
    };
    document.body.addEventListener("scroll", handleScroll);

    return () => {
      btn.removeEventListener("click", handleClick);
      document.body.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        autoClose={5000}
        closeOnClick
        draggable={false}
        style={{ width: "390px" }}
      />
      <div ref={backToTop} id="back-to-top-btn">
        <ArrowUpSquareFill />
      </div>

      <Nav />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
