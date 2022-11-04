import React, { useRef, useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { notify } from "../../Utils/utils";
import { useAppContext } from "../../context/LangAppWrapper";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ArrowDownShort } from "react-bootstrap-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const CanvaStyleisPreviwerContent90270Landscape = styled.div`
  canvas {
    width: 65% !important;
    height: auto !important;
    border: 2px solid #2988bca1;
    border-radius: 6px;

    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
      width: 90% !important;
      height: auto !important;
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      width: 70% !important;
      height: auto !important;
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
      width: 50% !important;
      height: auto !important;
    }

    /* Extra large devices (large laptops and desktops, 2560px) */
    @media only screen and (min-width: 2560px) {
      width: 90% !important;
      height: auto !important;
    }
  }
`;

const CanvaStyleisPreviwerContent90270Portrait = styled.div`
  canvas {
    width: 70% !important;
    height: auto !important;
    border: 2px solid #2988bca1;
    border-radius: 6px;

    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
      width: 70% !important;
      height: auto !important;
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      width: 60% !important;
      height: auto !important;
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
      width: 70% !important;
      height: auto !important;
    }

    /* Extra large devices (large laptops and desktops, 2560px) */
    @media only screen and (min-width: 2560px) {
      width: 90% !important;
      height: auto !important;
    }
  }
`;

const CanvaStyleisPreviwerContent0180Landscape = styled.div`
  canvas {
    width: 70% !important;
    height: auto !important;
    border: 2px solid #2988bca1;
    border-radius: 6px;

    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
      width: 90% !important;
      height: auto !important;
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      width: 80% !important;
      height: auto !important;
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
      width: 70% !important;
      height: auto !important;
    }

    /* Extra large devices (large laptops and desktops, 2560px) */
    @media only screen and (min-width: 2560px) {
      width: 90% !important;
      height: auto !important;
    }
  }
`;

const CanvaStyleisPreviwerContent0180Portrait = styled.div`
  canvas {
    width: 65% !important;
    height: auto !important;
    border: 2px solid #2988bca1;
    border-radius: 6px;

    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
      width: 90% !important;
      height: auto !important;
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      width: 50% !important;
      height: auto !important;
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
      width: 50% !important;
      height: auto !important;
    }

    /* Extra large devices (large laptops and desktops, 2560px) */
    @media only screen and (min-width: 2560px) {
      width: 90% !important;
      height: auto !important;
    }
  }
`;

const CanvaStyleisNotPreviwerContentisPreviwerDragContent = styled.div`
  canvas {
    height: 146px !important;
    width: 103px !important;
    @media only screen and (max-width: 768px) {
      width: 90px !important;
      height: 130px !important;
    }
    @media only screen and (max-width: 600px) {
      width: 70px !important;
      height: 100px !important;
    }
  }
`;

const CanvaStyleisNotPreviwerContentisNotPreviwerDragContentLandscape = styled.div`
  canvas {
    width: 100%;
    height: auto;
    @media only screen and (max-width: 768px) {
      width: 100% !important;
      height: 92px !important;
    }
    @media only screen and (max-width: 600px) {
      width: 100% !important;
      height: 70px !important;
    }
  }
`;

const CanvaStyleisNotPreviwerContentisNotPreviwerDragContentPortrait = styled.div`
  canvas {
    width: 100%;
    height: auto;
    @media only screen and (max-width: 768px) {
      width: 100% !important;
      height: 130px !important;
    }
    @media only screen and (max-width: 600px) {
      width: 100% !important;
      height: 100px !important;
    }
  }
`;

const PageContent = React.memo(function PageContent({
  isPreviwerContent,
  isPreviwerDragContent,
  blob,
  rotation,
  pageOriginalWidth,
  pageOriginalHeight,
  scale,
  height,
}) {
  const { t } = useAppContext();
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const canvaStyle = () => {
    if (isPreviwerContent) {
      if (rotation === 90 || rotation === 270) {
        if (pageOriginalWidth > pageOriginalHeight) {
          return CanvaStyleisPreviwerContent90270Landscape;
        } else if (pageOriginalWidth < pageOriginalHeight) {
          return CanvaStyleisPreviwerContent90270Portrait;
        }
      } else if (rotation === 0 || rotation === 180) {
        if (pageOriginalWidth > pageOriginalHeight) {
          return CanvaStyleisPreviwerContent0180Landscape;
        } else if (pageOriginalWidth < pageOriginalHeight) {
          return CanvaStyleisPreviwerContent0180Portrait;
        }
      }
    } else {
      if (isPreviwerDragContent) {
        return CanvaStyleisNotPreviwerContentisPreviwerDragContent;
      } else {
        if (pageOriginalWidth > pageOriginalHeight) {
          return CanvaStyleisNotPreviwerContentisNotPreviwerDragContentLandscape;
        } else {
          return CanvaStyleisNotPreviwerContentisNotPreviwerDragContentPortrait;
        }
      }
    }
  };

  const content = (
    <Document
      file={blob}
      loading={
        !isPreviwerContent ? (
          <ArrowDownShort style={{ color: "#2988bca1" }} />
        ) : null
      }
      onLoadError={(error) => {
        isPreviwerDragContent
          ? null
          : mountedRef.current
          ? notify("error", t("common:file_load_error"))
          : null;
      }}
      renderMode={"canvas"}
    >
      <Page
        height={height}
        pageNumber={1}
        rotate={0}
        onRenderSuccess={(pdf) => {
          pdf._transport.commonObjs.clear();
          pdf._transport.fontLoader.clear();
          pdf._transport.loadingTask.destroy();
          pdf._transport.pageCache = [];
          pdf._transport._params = [];
          pdf._transport.pagePromises = [];
        }}
        loading={
          !isPreviwerContent ? (
            <ArrowDownShort style={{ color: "#2988bca1" }} />
          ) : null
        }
        renderAnnotationLayer={false}
        renderInteractiveForms={false}
        renderTextLayer={false}
        renderMode={"canvas"}
        scale={scale}
      />
    </Document>
  );
  const PDFDocumentWrapper = canvaStyle();
  return (
    <>
      <div className="card-outer">
        <div className="card-inner">
          <PDFDocumentWrapper>{content}</PDFDocumentWrapper>
        </div>
      </div>
    </>
  );
});
export default PageContent;

PageContent.propTypes = {
  isPreviwerContent: PropTypes.bool.isRequired,
  isPreviwerDragContent: PropTypes.bool.isRequired,
  blob: PropTypes.object.isRequired,
  rotation: PropTypes.number.isRequired,
  pageOriginalWidth: PropTypes.number.isRequired,
  pageOriginalHeight: PropTypes.number.isRequired,
  scale: PropTypes.number,
  height: PropTypes.number,
};


