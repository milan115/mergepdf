import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Trash,
  ArrowClockwise,
  ArrowCounterclockwise,
  ArrowLeft,
  ArrowRight,
  X,
} from "react-bootstrap-icons";
import PageContent from "./DND/PageContent";
import PropTypes from "prop-types";

const PagePreviwerModal = React.memo(function PagePreviwerModal({
  show,
  currentPage,
  currentPageOrder,
  currentPageRotation,
  onClose,
  rotatePageToLeft,
  rotatePageToRight,
  deletePage,
  pagesNumber,
  moveToNextZoomedPage,
  moveToPreviousZoomedPage,
  jumpToZoomedOnPage,
  currentPageWidth,
  currentPageHeight,
}) {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const modalContent = show ? (
    <>
      <div
        id="modalPreview"
        className="modal js-modal-preview modal-preview show"
        role="dialog"
        style={{
          display: "block",
          paddingRight: "16px",
        }}
      >
        <div
          className="modal-backdrop show"
          onClick={() => {
            if (mountedRef.current) {
              onClose();
            }
          }}
        ></div>
        <div className="modal-dialog" role="document">
          <div className="modal__content h-100 d-flex flex-column">
            <div className="modal__panel">
              <div className="container">
                <div className="d-flex justify-content-center relative">
                  <div className="modal-actions d-flex">
                    <button
                      className="btn btn-icon-modal d-md-flex mr-md-4"
                      id="btnModalRotateLeft"
                      title="Rotate the page to the left"
                      aria-label="Rotate the page to the left"
                    >
                      <ArrowCounterclockwise
                        onClick={() => {
                          if (mountedRef.current) {
                            rotatePageToLeft(currentPage);
                          }
                        }}
                      />
                    </button>
                    <button
                      className="btn btn-icon-modal mr-1 mr-md-4"
                      id="btnModalRotateRight"
                      title="Rotate the page to the right"
                      aria-label="Rotate the page to the right"
                    >
                      <ArrowClockwise
                        onClick={() => {
                          if (mountedRef.current) {
                            rotatePageToRight(currentPage);
                          }
                        }}
                      />
                    </button>
                    <button
                      className="btn btn-icon-modal "
                      id="btnModalDelete"
                      title="Delete the page"
                      aria-label="Delete the page"
                    >
                      <Trash
                        onClick={() => {
                          if (mountedRef.current) {
                            deletePage();
                          }
                        }}
                      />
                    </button>
                  </div>
                  <div className="modal-paginators d-flex">
                    <button
                      className="btn btn-icon-modal mr-1 mr-md-4"
                      id="btnModalPrev"
                      title="Previous page"
                      aria-label="Previous page"
                    >
                      <ArrowLeft
                        onClick={() => {
                          if (mountedRef.current) {
                            moveToPreviousZoomedPage();
                          }
                        }}
                      />
                    </button>
                    <div className="modal-info color-white d-md-flex align-items-center mr-4">
                      <input
                        className="modal-input js-modal-input mr-2"
                        type="number"
                        value={currentPageOrder}
                        onChange={(e) => {
                          const index = parseInt(e.target.value);
                          if (index && typeof index == "number") {
                            if (mountedRef.current) {
                              jumpToZoomedOnPage(index - 1);
                            }
                          }
                        }}
                        max={pagesNumber}
                        min="1"
                      />
                      <span className="modal-info__total-count js-modal-pages-count">
                        {pagesNumber}
                      </span>
                    </div>
                    <button
                      className="btn btn-icon-modal"
                      id="btnModalNext"
                      title="Next page"
                      aria-label="Next page"
                    >
                      <ArrowRight
                        onClick={() => {
                          if (mountedRef.current) {
                            moveToNextZoomedPage();
                          }
                        }}
                      />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="close btn btn-icon-modal"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      if (mountedRef.current) {
                        onClose();
                      }
                    }}
                  >
                    <X />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="modal__body d-flex justify-content-center align-items-center h-100 m-9"
              data-page-rotation={currentPage.rotation}
            >
              <div className="modal__canvas-wrapper">
                <PageContent
                  isPreviwerContent={true}
                  isPreviwerDragContent={false}
                  blob={currentPage.blob}
                  rotation={currentPageRotation}
                  pageOriginalWidth={currentPageWidth}
                  pageOriginalHeight={currentPageHeight}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  if (mountedRef.current) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
});

export default PagePreviwerModal;

PagePreviwerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  currentPage: PropTypes.object,
  currentPageOrder: PropTypes.number.isRequired,
  currentPageRotation: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  rotatePageToLeft: PropTypes.func.isRequired,
  rotatePageToRight: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  pagesNumber: PropTypes.number.isRequired,
  moveToNextZoomedPage: PropTypes.func.isRequired,
  moveToPreviousZoomedPage: PropTypes.func.isRequired,
  jumpToZoomedOnPage: PropTypes.func.isRequired,
  currentPageWidth: PropTypes.number.isRequired,
  currentPageHeight: PropTypes.number.isRequired,
};
