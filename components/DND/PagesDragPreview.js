import React from "react";
import PropTypes from "prop-types";
import PageContent from "./PageContent";

const PagesDragPreview = React.memo(function PagesDragPreview({ pages }) {
  let backPreviews = 1;
  if (pages.length === 2) {
    backPreviews = 2;
  } else if (pages.length >= 3) {
    backPreviews = 3;
  }

  return (
    <div>
      {pages.slice(0, backPreviews).map((page, i) => (
        <div
          key={page.id}
          className="card card-dragged"
          style={{
            zIndex: pages.length - i,
            transform: `rotateZ(${-i * 2.5}deg)`,
          }}
        >
          <PageContent
            isPreviwerContent={false}
            isPreviwerDragContent={true}
            blob={page.blob}
            rotation={page.rotation}
            pageOriginalWidth={page.width}
            pageOriginalHeight={page.height}
            scale={1}
            height={146}
          />
        </div>
      ))}
    </div>
  );
});

export default PagesDragPreview;

PagesDragPreview.propTypes = {
  pages: PropTypes.array.isRequired,
};
