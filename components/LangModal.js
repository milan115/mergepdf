import React from "react";
import Link from "next/link";
import { XLg } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import LanguageCountryFlag from "./LanguageCountryFlag";
import PropTypes from "prop-types";

const LangModal = React.memo(function LangModal({ show, onClose }) {
  const router = useRouter();
  return show ? (
    <div className="modal-open">
      <div
        className="lang-modal col-12 col-md-2 mb-10 mb-md-0 order-first order-md-0 active"
        id="lang-modal"
      >
        <div className="lang-modal__overlay" onClick={onClose}></div>
        <div className="lang-modal__wrap">
          <div className="lang-modal__inner">
            <XLg
              className="lang-modal__close btn fo-cross"
              size={30}
              onClick={onClose}
            />
            <div className="lang-modal__text font-weight-bold mb-5 mt-2">
              Select language
            </div>
            <ul className="lang-modal__list list-unstyled mb-0">
              {router.locales.map((locale) => {
                return (
                  <li className="lang-modal__item" key={locale}>
                    <Link href="" locale={locale}>
                      <a className="lang-modal__link">
                        <LanguageCountryFlag locale={locale} />
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : null;
});
export default LangModal;

LangModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};