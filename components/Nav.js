import React from "react";
import Link from "next/link";
import { Globe } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import LangModal from "./LangModal";

const Nav = React.memo(function Nav() {
  const [showModal, setShowModal] = useState(false);
  return (
    <header className="header" id="header">
      <div className="container">
        <div className="header__wrapper d-flex align-items-center">
          <div className="header__logo mr-auto mr-md-15">
            <Link href="/">
              <a className="header__link">
                <span style={{ color: "#2988bc" }}>PDF</span>
                <span style={{ color: "rgb(45, 55, 72)" }}>Merger</span>
              </a>
            </Link>
          </div>

          <div className="d-flex  ml-auto">
            <div className="ml-0 ml-md-4 btn-cart">
              <Globe
                id="lang-modal-btn"
                className="btn-globe pl-5 pr-0 pr-md-5"
                fontSize="1.2em"
                onClick={() => setShowModal(true)}
              />
              <LangModal show={showModal} onClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Nav;
