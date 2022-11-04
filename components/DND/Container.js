import React, { useReducer, useState, useEffect, useRef } from "react";

import { useAppContext } from "../../context/LangAppWrapper";
import PageDragLayer from "./PageDragLayer";
import Page from "./Page";
import {
  Trash,
  ArrowClockwise,
  ArrowCounterclockwise,
  Plus,
} from "react-bootstrap-icons";
import {
  generatePages,
  addMultipleEventListener,
  removeMultipleEventListener,
  handleFileSelect,
  handleSave,
  rotateLeft,
  rotateRight,
} from "../../Utils/utils.js";
import Selecto from "react-selecto";
import PgaePreviwerModal from "../PagePreviwerModal.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}

const updatePagesOrder = (newPages) => {
  for (let index = 0; index < newPages.length; index++) {
    const page = newPages[index];
    page.order = index + 1;
  }
  return newPages;
};

const pageReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PAGES":
      const newPages = state.pages.concat([action.newPage]);
      newPages = updatePagesOrder(newPages);
      return {
        ...state,
        pages: newPages,
        selectedPages: init_state.selectedPages,
      };

    case "DELETE_PAGES":
      return {
        ...state,
        pages: action.newPages,
        selectedPages: init_state.selectedPages,
        lastSelectedIndex: init_state.lastSelectedIndex,
      };

    case "DELETE_PAGE":
      return {
        ...state,
        pages: action.newPages,
        selectedPages: action.newSelectedPages,
        lastSelectedIndex: action.newLastSelectedIndex,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "ROTATE_SELECTION_LEFT":
      return {
        ...state,
        pages: action.newPages,
        selectedPages: action.newSelectedPages,
      };
    case "ROTATE_PAGE_LEFT":
      const newRotatedLeftPage = action.newPage;
      const newPagesAfterPageRotationLeft = state.pages.map((page) => {
        if (page.id === newRotatedLeftPage.id) {
          return newRotatedLeftPage;
        } else {
          return page;
        }
      });

      const newSelectedPagesAfterPageRotationLeft = state.selectedPages.map(
        (selPage) => {
          if (selPage.id === newRotatedLeftPage.id) {
            return newRotatedLeftPage;
          } else {
            return selPage;
          }
        }
      );

      return {
        ...state,
        pages: newPagesAfterPageRotationLeft,
        selectedPages: newSelectedPagesAfterPageRotationLeft,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "ROTATE_PAGE_RIGHT":
      const newRotatedRightPage = action.newPage;
      const newPagesAfterPageRotationRight = state.pages.map((page) => {
        if (page.id === newRotatedRightPage.id) {
          return newRotatedRightPage;
        } else {
          return page;
        }
      });

      const newSelectedPagesAfterPageRotationRight = state.selectedPages.map(
        (selPage) => {
          if (selPage.id === newRotatedRightPage.id) {
            return newRotatedRightPage;
          } else {
            return selPage;
          }
        }
      );

      return {
        ...state,
        pages: newPagesAfterPageRotationRight,
        selectedPages: newSelectedPagesAfterPageRotationRight,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "ROTATE_SELECTION_RIGHT":
      return {
        ...state,
        pages: action.newPages,
        selectedPages: action.newSelectedPages,
      };

    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedPages: init_state.selectedPages,
        lastSelectedIndex: init_state.lastSelectedIndex,
      };

    case "UPDATE_SELECTION":
      return {
        ...state,
        selectedPages: action.newSelectedPages,
        lastSelectedIndex: action.newLastSelectedIndex,
      };

    case "SELECT_PAGE":
      const newSelectedPage = action.newSelectedPage;
      let newSelectedPagesAdd;
      const addedIndex = state.selectedPages.findIndex(
        (f) => f === newSelectedPage
      );

      if (addedIndex >= 0) {
        newSelectedPagesAdd = [...state.selectedPages];
      } else {
        newSelectedPagesAdd = [...state.selectedPages, newSelectedPage];
      }
      return {
        ...state,
        selectedPages: newSelectedPagesAdd,
        lastSelectedIndex: action.newLastSelectedIndex,
      };

    case "REMOVE_SELECT_PAGE":
      const newUnselectedPage = action.newUnselectedPage;
      let newSelectedPagesRemove;
      const removedIndex = state.selectedPages.findIndex(
        (f) => f === newUnselectedPage
      );
      if (removedIndex >= 0) {
        newSelectedPagesRemove = [
          ...state.selectedPages.slice(0, removedIndex),
          ...state.selectedPages.slice(removedIndex + 1),
        ];
      } else {
        newSelectedPagesRemove = [...state.selectedPages];
      }

      return {
        ...state,
        selectedPages: newSelectedPagesRemove,
        lastSelectedIndex: action.newLastSelectedIndex,
      };

    case "REARRANGE_PAGES":
      return {
        ...state,
        pages: action.newPages,
        selectedPages: action.newSelectedPages,
        lastSelectedIndex: action.newLastSelectedIndex,
      };

    case "SET_INSERTINDEX":
      return {
        ...state,
        dragIndex: action.dragIndex,
        hoverIndex: action.hoverIndex,
        insertIndex: action.insertIndex,
      };

    case "ZOOM_ON_PAGE":
      return {
        ...state,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "MOVE_TO_NEXT_ZOOMED_ON_PAGE":
      return {
        ...state,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "MOVE_TO_PREVIOUS_ZOOMED_ON_PAGE":
      return {
        ...state,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "JUMP_TO_ZOOMED_ON_PAGE":
      return {
        ...state,
        zoomedOnPage: action.newZoomedOnPage,
      };

    case "EMPTY_PAGES_ARRAY":
      return init_state;

    default:
      return state;
  }
};

const init_state = {
  pages: new Array(),
  selectedPages: [],
  lastSelectedIndex: -1,
  zoomedOnPage: null,
  dragIndex: -1,
  hoverIndex: -1,
  insertIndex: -1,
  isDragging: false,
};

const Container = React.memo(function Container() {
  const { t } = useAppContext();
  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  const deleteBtn = useRef();
  const saveBtn = useRef();
  const rotateLeftBtn = useRef();
  const rotateRightBtn = useRef();
  const file = useRef();
  const dropZone = useRef();
  const toolbox = useRef(false);
  const mountedRef = useRef(false);
  const [newBlob, setNewBlob] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [state, dispatch] = useReducer(pageReducer, init_state);
  const [scrollOptions, setScrollOptions] = React.useState({});

  const jsStickyTop = useRef();
  const previewer = useRef();
  const jsStickyBottom = useRef();

  const opts = {
    scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 },
    ],
  };

  const addPage = (addedPage) => {
    if (mountedRef.current) {
      dispatch({
        type: "ADD_PAGES",
        newPage: addedPage,
      });
    }
  };

  const rotateSelectedPagesToRight = () => {
    const pages = state.pages;
    const selectedPages = state.selectedPages;
    const newItemsLIst = [];
    if (selectedPages.length === 0) {
      newItemsLIst = pages.map((page) => {
        const newRotation = rotateRight(page.rotation);
        return { ...page, rotation: newRotation };
      });

      if (mountedRef.current) {
        dispatch({
          type: "ROTATE_SELECTION_RIGHT",
          newPages: newItemsLIst,
          newSelectedPages: init_state.selectedPages,
        });
      }
    } else {
      let newSelectedPages = [];
      newItemsLIst = pages.map((page) => {
        const found = selectedPages.find((element) => element.id === page.id);
        if (found) {
          const newRotation = rotateRight(page.rotation);
          const updatedPage = { ...page, rotation: newRotation };
          newSelectedPages.push(updatedPage);
          return updatedPage;
        } else {
          return page;
        }
      });

      if (mountedRef.current) {
        dispatch({
          type: "ROTATE_SELECTION_RIGHT",
          newPages: newItemsLIst,
          newSelectedPages: newSelectedPages,
        });
      }
    }
  };

  const rotateSelectedPagesToLeft = () => {
    const pages = state.pages;
    const selectedPages = state.selectedPages;
    const newItemsLIst = [];

    if (selectedPages.length === 0) {
      newItemsLIst = pages.map((page) => {
        const newRotation = rotateLeft(page.rotation);
        return { ...page, rotation: newRotation };
      });

      if (mountedRef.current) {
        dispatch({
          type: "ROTATE_SELECTION_LEFT",
          newPages: newItemsLIst,
          newSelectedPages: init_state.selectedPages,
        });
      }
    } else {
      let newSelectedPages = [];
      newItemsLIst = pages.map((page) => {
        const found = selectedPages.find((element) => element.id === page.id);
        if (found) {
          const newRotation = rotateLeft(page.rotation);
          const updatedPage = { ...page, rotation: newRotation };
          newSelectedPages.push(updatedPage);
          return updatedPage;
        } else {
          return page;
        }
      });

      if (mountedRef.current) {
        dispatch({
          type: "ROTATE_SELECTION_LEFT",
          newPages: newItemsLIst,
          newSelectedPages: newSelectedPages,
        });
      }
    }
  };

  const rotatePageToLeft = (page) => {
    const newRotation = rotateLeft(page.rotation);
    const newPage = { ...page, rotation: newRotation };

    if (mountedRef.current) {
      dispatch({
        type: "ROTATE_PAGE_LEFT",
        newPage: newPage,
        newZoomedOnPage: newPage,
      });
    }
  };

  const rotatePageToRight = (page) => {
    const newRotation = rotateRight(page.rotation);
    const newPage = { ...page, rotation: newRotation };

    if (mountedRef.current) {
      dispatch({
        type: "ROTATE_PAGE_RIGHT",
        newPage: newPage,
        newZoomedOnPage: newPage,
      });
    }
  };

  const deleteSelectedPages = () => {
    const pages = state.pages;
    const selectedPages = state.selectedPages;
    let result = selectedPages.map(({ id }) => parseInt(id));
    let newPages = pages.filter((page) => !result.includes(page.id));
    newPages = updatePagesOrder(newPages);
    if (newPages.length === 0) {
      toolbox.current = false;
    }
    if (mountedRef.current) {
      dispatch({
        type: "DELETE_PAGES",
        newPages: newPages,
        newSelectedPages: [],
        newLastSelectedIndex: -1,
      });
    }
  };

  const deleteZoomedOnPage = () => {
    const zoomedOnPage = state.zoomedOnPage;

    const zoomedOnIndex = state.pages.findIndex(
      (page) => page === zoomedOnPage
    );

    const pages = state.pages;
    const selectedPages = state.selectedPages;
    let newLastSelectedIndex = -1;
    let newZoomedOnPage = null;

    const newPages = pages.filter((c) => c.id !== zoomedOnPage.id);
    newPages = updatePagesOrder(newPages);

    const newSelectedPages = selectedPages.filter(
      (sc) => sc.id !== zoomedOnPage.id
    );

    if (newPages.length === 0) {
      toolbox.current = false;
    } else if (newPages.length > 0) {
      if (newPages[zoomedOnIndex - 1]) {
        newZoomedOnPage = newPages[zoomedOnIndex - 1];
      }
    }

    if (newSelectedPages.length > 0) {
      newLastSelectedIndex = newSelectedPages[0].index;
    }

    if (mountedRef.current) {
      dispatch({
        type: "DELETE_PAGE",
        newPages: newPages,
        newSelectedPages: newSelectedPages,
        newLastSelectedIndex: newLastSelectedIndex,
        newZoomedOnPage: newZoomedOnPage,
      });
    }
  };

  const zoomOnPage = (page) => {
    if (mountedRef.current) {
      dispatch({
        type: "ZOOM_ON_PAGE",
        newZoomedOnPage: page,
      });
    }
  };

  const clearPageSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handlePagesSelection = (index, ctrlKey) => {
    let newSelectedPages;
    const pages = state.pages;
    const page = index < 0 ? "" : pages[index];
    const newLastSelectedIndex = index;
    if (!ctrlKey) {
      newSelectedPages = [page];
    } else {
      const foundIndex = state.selectedPages.findIndex((f) => f === page);
      if (foundIndex >= 0) {
        newSelectedPages = [
          ...state.selectedPages.slice(0, foundIndex),
          ...state.selectedPages.slice(foundIndex + 1),
        ];
      } else {
        newSelectedPages = [...state.selectedPages, page];
      }
    }
    const finalList = pages
      ? pages.filter((f) => newSelectedPages.find((a) => a === f))
      : [];
    dispatch({
      type: "UPDATE_SELECTION",
      newSelectedPages: finalList,
      newLastSelectedIndex: newLastSelectedIndex,
    });
  };

  const handlePagesSelectionOnMobile = (index) => {
    let newSelectedPages;
    const pages = state.pages;
    const page = index < 0 ? "" : pages[index];
    const newLastSelectedIndex = index;

    const foundIndex = state.selectedPages.findIndex((f) => f === page);
    if (foundIndex >= 0) {
      newSelectedPages = [
        ...state.selectedPages.slice(0, foundIndex),
        ...state.selectedPages.slice(foundIndex + 1),
      ];
    } else {
      newSelectedPages = [...state.selectedPages, page];
    }

    const finalList = pages
      ? pages.filter((f) => newSelectedPages.find((a) => a === f))
      : [];
    dispatch({
      type: "UPDATE_SELECTION",
      newSelectedPages: finalList,
      newLastSelectedIndex: newLastSelectedIndex,
    });
  };

  const handlePageSelection = (index) => {
    const pages = state.pages;
    const page = index < 0 ? "" : pages[index];
    const newLastSelectedIndex = index;

    dispatch({
      type: "SELECT_PAGE",
      newSelectedPage: page,
      newLastSelectedIndex: newLastSelectedIndex,
    });
  };

  const handleRemovePageSelection = (index, selectedPages) => {
    const pages = state.pages;
    const page = index < 0 ? "" : pages[index];
    const newLastSelectedIndex = -1;

    if (selectedPages.length > 0) {
      newLastSelectedIndex = parseInt(
        selectedPages[0].getAttribute("data-index")
      );
    }

    dispatch({
      type: "REMOVE_SELECT_PAGE",
      newUnselectedPage: page,
      newLastSelectedIndex: newLastSelectedIndex,
    });
  };

  const rearrangePages = (dragItem) => {
    let pages = state.pages.slice();
    const draggedPages = dragItem.pages;
    const newLastSelectedIndex = draggedPages[0]?.index;
    let dividerIndex;
    if ((state.insertIndex >= 0) & (state.insertIndex < pages.length)) {
      dividerIndex = state.insertIndex;
    } else {
      dividerIndex = pages.length;
    }
    const upperHalfRemainingPages = pages
      .slice(0, dividerIndex)
      .filter((c) => !draggedPages.find((dc) => dc.id === c.id));
    const lowerHalfRemainingPages = pages
      .slice(dividerIndex)
      .filter((c) => !draggedPages.find((dc) => dc.id === c.id));
    const newPages = [
      ...upperHalfRemainingPages,
      ...draggedPages,
      ...lowerHalfRemainingPages,
    ];

    newPages = updatePagesOrder(newPages);

    if (mountedRef.current) {
      dispatch({
        type: "REARRANGE_PAGES",
        newPages: newPages,
        newSelectedPages: draggedPages,
        newLastSelectedIndex: newLastSelectedIndex,
      });
    }
  };

  const moveToNextZoomedPage = () => {
    const zoomedOnPage = state.zoomedOnPage;

    const zoomedOnIndex = state.pages.findIndex(
      (page) => page === zoomedOnPage
    );

    const pages = state.pages;

    let newZoomedOnPage;

    if (pages[zoomedOnIndex + 1]) {
      newZoomedOnPage = pages[zoomedOnIndex + 1];
    } else {
      newZoomedOnPage = zoomedOnPage;
    }

    if (mountedRef.current) {
      dispatch({
        type: "MOVE_TO_NEXT_ZOOMED_ON_PAGE",
        newZoomedOnPage: newZoomedOnPage,
      });
    }
  };

  const moveToPreviousZoomedPage = () => {
    const zoomedOnPage = state.zoomedOnPage;

    const zoomedOnIndex = state.pages.findIndex(
      (page) => page === zoomedOnPage
    );

    const pages = state.pages;

    let newZoomedOnPage;

    if (pages[zoomedOnIndex - 1]) {
      newZoomedOnPage = pages[zoomedOnIndex - 1];
    } else {
      newZoomedOnPage = zoomedOnPage;
    }

    if (mountedRef.current) {
      dispatch({
        type: "MOVE_TO_PREVIOUS_ZOOMED_ON_PAGE",
        newZoomedOnPage: newZoomedOnPage,
      });
    }
  };

  const jumpToZoomedOnPage = (index) => {
    const pages = state.pages;
    const zoomedOnPage = state.zoomedOnPage;
    let newZoomedOnPage;

    if (pages[index]) {
      newZoomedOnPage = pages[index];
    } else {
      newZoomedOnPage = zoomedOnPage;
    }

    if (mountedRef.current) {
      dispatch({
        type: "JUMP_TO_ZOOMED_ON_PAGE",
        newZoomedOnPage: newZoomedOnPage,
      });
    }
  };

  const setInsertIndex = (dragIndex, hoverIndex, newInsertIndex) => {
    if (
      state.dragIndex === dragIndex &&
      state.hoverIndex === hoverIndex &&
      state.insertIndex === newInsertIndex
    ) {
      return;
    }
    dispatch({
      type: "SET_INSERTINDEX",
      dragIndex: dragIndex,
      hoverIndex: hoverIndex,
      insertIndex: newInsertIndex,
    });
  };

  useEffect(() => {
    mountedRef.current = true;

    const deleteBtnCurrent = deleteBtn.current;
    const rotateRightBtnCurrent = rotateRightBtn.current;
    const rotateLeftBtnCurrent = rotateLeftBtn.current;
    const dropZoneCurrent = dropZone.current;
    const fileCurrent = file.current;

    const handleChange = (e) => {
      toolbox.current = true;
      handleFileSelect(e, setFilesCount, setNewBlob, t, mountedRef);
    };
    const handlePreventDefaultAndStopPropagation = (e) => {
      e.preventDefault();
    };
    const handleStopPropagation = (e) => {
      e.stopPropagation();
    };

    addMultipleEventListener(
      [deleteBtnCurrent, rotateRightBtnCurrent, rotateLeftBtnCurrent],
      ["pointerup", "mouseup", "touchend"],
      handleStopPropagation
    );

    dropZoneCurrent.addEventListener("drop", handleChange, false);

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropZoneCurrent.addEventListener(
        eventName,
        handlePreventDefaultAndStopPropagation,
        false
      );
    });

    fileCurrent.addEventListener("change", handleChange, false);

    setScrollOptions({
      container: document.body,
      getScrollPosition: () => [
        document.body.scrollLeft,
        document.body.scrollTop,
      ],
      throttleTime: 0,
      threshold: 0,
    });

    return () => {
      dispatch({
        type: "EMPTY_PAGES_ARRAY",
      });
      mountedRef.current = false;
      toolbox.current = false;
      removeMultipleEventListener(
        [deleteBtnCurrent, rotateRightBtnCurrent, rotateLeftBtnCurrent],
        ["pointerup", "mouseup", "touchend"],
        handleStopPropagation
      );
      fileCurrent.removeEventListener("change", handleChange, false);
      dropZoneCurrent.removeEventListener("drop", handleChange, false);
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropZoneCurrent.removeEventListener(
          eventName,
          handlePreventDefaultAndStopPropagation,
          false
        );
      });
    };
  }, []);

  useEffect(() => {
    if (newBlob.length > 0 && newBlob.length === filesCount) {
      if (mountedRef.current) {
        setIsSpinnerActive(true);
      }
      generatePages(newBlob, mountedRef, addPage).then(() => {
        if (mountedRef.current) {
          setIsSpinnerActive(false);
        }
      });

      file.current.value = null;

      if (mountedRef.current) {
        setNewBlob([]);
      }
      if (mountedRef.current) {
        setFilesCount(0);
      }
    }
  }, [newBlob, filesCount, file]);

  const handleStickyTopBottom = () => {
    let fixmeTop = previewer.current?.getBoundingClientRect().top;
    let currentScroll = window.pageYOffset;
    let intFrameHeight = window.innerHeight;
    let fixmeBottom = previewer.current?.getBoundingClientRect().bottom;

    if (currentScroll > fixmeTop) {
      jsStickyTop.current?.classList.remove("sticky-top-border");
      if (currentScroll + 70 < fixmeBottom) {
        jsStickyTop.current?.classList.remove("sticky-top-border-b");
      } else {
        jsStickyTop.current?.classList.add("sticky-top-border-b");
      }
    } else {
      jsStickyTop.current?.classList.add("sticky-top-border");
    }
    if (currentScroll < intFrameHeight - fixmeBottom) {
      jsStickyBottom.current?.classList.add("sticky-bottom-border");
    } else {
      jsStickyBottom.current?.classList.remove("sticky-bottom-border");
    }
  };
  useEffect(() => {
    if (isSpinnerActive === false && toolbox.current) {
      document.body.addEventListener("scroll", handleStickyTopBottom);
    }
    return () => {
      document.body.removeEventListener("scroll", handleStickyTopBottom);
    };
  }, [isSpinnerActive]);

  return (
    <>
      <section
        className={`toolbox py-0 ${
          toolbox.current ? "is-process" : "is-upload"
        } merge`}
        id="toolbox"
      >
        <div className="container">
          <div
            className="drop-area toolbox__wrapper d-flex enable"
            ref={dropZone}
          >
            <div className="toolbox__inner uploader w-100 pt-10 pb-12">
              <div className="d-flex flex-column align-items-center">
                <input
                  type="file"
                  className="input-file"
                  accept="application/pdf"
                  id="inputFile"
                  tabIndex="-1"
                  name="file"
                  ref={file}
                  multiple
                />
                <label
                  htmlFor="inputFile"
                  className="uploader__img mb-4"
                ></label>
                <div className="subtitle mb-5">{t("home:drop_files")}</div>

                <label
                  htmlFor="inputFile"
                  className="btn btn-accent btn-accent--inverse d-inline-block mb-0"
                >
                  {t("home:choose_files")}
                </label>
              </div>
            </div>

            <div className={`spinner ${isSpinnerActive ? "active" : ""}`}>
              <div
                className="spinner__inner fixed"
                style={{ top: "auto", bottom: "25%" }}
              ></div>
            </div>

            <div className="toolbox__inner previewer w-100" ref={previewer}>
              <div
                className="panel panel--top container sticky-top sticky-top-border"
                ref={jsStickyTop}
              >
                <div className="panel__inner d-flex align-items-center justify-content-end justify-content-md-center ">
                  <div className="panel__btn-left mr-5 ">
                    <label
                      htmlFor="inputFile"
                      className="btn btn-normal mb-0"
                      aria-label="Add more files"
                    >
                      <Plus />
                      <span>{t("home:add_files")}</span>
                    </label>
                  </div>
                  <button
                    ref={rotateLeftBtn}
                    className={
                      "btn btn-normal mr-5 " +
                      `${state.pages.length > 0 ? "" : "disabled"}`
                    }
                    id="btnRotateLeft"
                    aria-label="Rotate to the left"
                    onClick={rotateSelectedPagesToLeft}
                  >
                    <ArrowCounterclockwise />
                    <span>{t("home:rotate_left")}</span>
                  </button>
                  <button
                    ref={rotateRightBtn}
                    className={
                      "btn btn-normal mr-5 " +
                      `${state.pages.length > 0 ? "" : "disabled"}`
                    }
                    id="btnRotateRight"
                    aria-label="rotate to the right"
                    onClick={rotateSelectedPagesToRight}
                  >
                    <ArrowClockwise />

                    <span>{t("home:rotate_right")}</span>
                  </button>
                  <button
                    ref={deleteBtn}
                    className={`btn btn-normal mr-5 ${
                      state.selectedPages.length > 0 ? "" : "disabled"
                    } `}
                    id="btnDelete"
                    title="Select some pages to delete"
                    aria-label="Delete selected pages"
                    onClick={deleteSelectedPages}
                  >
                    <Trash />
                    <span>{t("home:delete")}</span>
                  </button>
                </div>
              </div>
              {mountedRef.current && (
                <DndProvider
                  backend={isMobile ? TouchBackend : HTML5Backend}
                  options={isMobile ? opts : null}
                >
                  <div
                    className="previewer__content d-flex flex-wrap scroll"
                    id="previewer__content"
                  >
                    {!isMobile && (
                      <Selecto
                        dragContainer={".previewer__content"}
                        selectableTargets={[".preview"]}
                        selectByClick={false}
                        selectFromInside={false}
                        toggleContinueSelect={["ctrl"]}
                        boundContainer={false}
                        hitRate={0}
                        ratio={0}
                        onSelectStart={(e) => {
                          if (
                            state.selectedPages.length > 0 &&
                            !e.inputEvent.ctrlKey
                          ) {
                            clearPageSelection();
                          }
                        }}
                        onSelect={(e) => {
                          e.added.forEach((el) => {
                            const index = parseInt(
                              el.getAttribute("data-index")
                            );
                            handlePageSelection(index);
                          });
                          e.removed.forEach((el) => {
                            const removedIndex = parseInt(
                              el.getAttribute("data-index")
                            );
                            if (e.selected.length === 0) {
                              clearPageSelection();
                            } else {
                              handleRemovePageSelection(
                                removedIndex,
                                e.selected
                              );
                            }
                          });
                        }}
                        scrollOptions={scrollOptions}
                        onScroll={(e) => {
                          document.body.scrollBy(
                            e.direction[0] * 10,
                            e.direction[1] * 10
                          );
                        }}
                      />
                    )}
                    <PageDragLayer />
                    {state.pages.map((page, i) => {
                      const insertLineOnLeft =
                        state.hoverIndex === i && state.insertIndex === i;
                      const insertLineOnRight =
                        state.hoverIndex === i && state.insertIndex === i + 1;
                      return (
                        <Page
                          key={"page-" + page.id}
                          id={page.id}
                          index={i}
                          order={page.order}
                          rotation={page.rotation}
                          height={page.height}
                          width={page.width}
                          blob={page.blob}
                          selectedPages={state.selectedPages}
                          rearrangePages={rearrangePages}
                          setInsertIndex={setInsertIndex}
                          onSelectionChange={
                            isMobile
                              ? handlePagesSelectionOnMobile
                              : handlePagesSelection
                          }
                          clearPageSelection={clearPageSelection}
                          insertLineOnLeft={insertLineOnLeft}
                          insertLineOnRight={insertLineOnRight}
                          isSelected={state.selectedPages.includes(page)}
                          zoomOnPage={() => zoomOnPage(page)}
                        />
                      );
                    })}
                  </div>
                </DndProvider>
              )}

              <div
                className={`panel panel--bottom container ${
                  state.pages.length > 0 ? " sticky-bottom" : ""
                } sticky-bottom-border`}
                ref={jsStickyBottom}
              >
                <div className="panel__inner d-flex align-items-center justify-content-center justify-content-md-center ">
                  <button
                    className={
                      "btn btn-accent " +
                      `${state.pages.length > 0 ? "" : "disabled"}`
                    }
                    id="btnDownload"
                    ref={saveBtn}
                    type="button"
                    onClick={() => handleSave(state.pages)}
                  >
                    {t("home:save_download")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PgaePreviwerModal
        onClose={() => {
          if (mountedRef.current) {
            zoomOnPage(null);
          }
        }}
        show={state.zoomedOnPage !== null ? true : false}
        currentPage={state.zoomedOnPage}
        currentPageOrder={
          state.zoomedOnPage !== null ? state.zoomedOnPage.order : -1
        }
        currentPageRotation={
          state.zoomedOnPage !== null ? state.zoomedOnPage.rotation : -1
        }
        currentPageWidth={
          state.zoomedOnPage !== null ? state.zoomedOnPage.width : -1
        }
        currentPageHeight={
          state.zoomedOnPage !== null ? state.zoomedOnPage.height : -1
        }
        moveToNextZoomedPage={moveToNextZoomedPage}
        moveToPreviousZoomedPage={moveToPreviousZoomedPage}
        jumpToZoomedOnPage={jumpToZoomedOnPage}
        deletePage={deleteZoomedOnPage}
        rotatePageToLeft={rotatePageToLeft}
        rotatePageToRight={rotatePageToRight}
        pagesNumber={state.pages.length}
      />
    </>
  );
});
export default Container;

