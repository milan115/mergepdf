import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import PageContent from "./PageContent";
import { ZoomIn } from "react-bootstrap-icons";
import { isMobile } from "react-device-detect";

 const Page = React.memo(function Page({
   id,
   order,
   blob,
   rotation,
   width,
   height,
   index,
   selectedPages,
   clearPageSelection,
   rearrangePages,
   setInsertIndex,
   onSelectionChange,
   insertLineOnLeft,
   insertLineOnRight,
   isSelected,
   zoomOnPage,
 }) {
   const ref = useRef(null);
   const mountedRef = useRef(false);

   useEffect(() => {
     mountedRef.current = true;
     return () => {
       mountedRef.current = false;
     };
   }, []);

   const [{ isDragging }, drag, preview] = useDrag({
     type: "page",
     item: (monitor) => {
       const draggedPage = { id, order, blob, rotation, width, height };
       let pages;
       if (selectedPages.find((page) => page.id === id)) {
         pages = selectedPages;
       } else {
         clearPageSelection();
         onSelectionChange(index, null);
         pages = [draggedPage];
       }
       const otherPages = pages.concat();
       otherPages.splice(
         pages.findIndex((c) => c.id === id),
         1
       );
       const pagesDragStack = [draggedPage, ...otherPages];
       const pagesIDs = pages.map((c) => c.id);
       return { pages, pagesDragStack, draggedPage, pagesIDs };
     },
     isDragging: (monitor) => {
       return monitor.getItem().pagesIDs.includes(id);
     },
     end: (item, monitor) => {
       rearrangePages(item);
     },
     collect: (monitor) => ({
       isDragging: monitor.isDragging(),
     }),
   });

   const [{ hovered }, drop] = useDrop({
     accept: "page",
     hover: (item, monitor) => {
       const dragIndex = item.draggedPage.index;
       const hoverIndex = index;

       // Determine rectangle on screen
       const hoverBoundingRect = ref.current?.getBoundingClientRect();

       // Get horizontal middle
       const midX =
         hoverBoundingRect.left +
         (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
       // Determine mouse position
       const pointerOffset = monitor.getClientOffset();

       const newInsertIndex =
         pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;
       setInsertIndex(dragIndex, hoverIndex, newInsertIndex);

       //Add scroll in mobile
       if (isMobile) {
         if (monitor.getDifferenceFromInitialOffset().y > 0) {
           document.body.scrollLeft = 0;
           document.body.scrollTop = document.body.scrollTop + 2;
         }
         if (monitor.getDifferenceFromInitialOffset().y < 0) {
           document.body.scrollLeft = 0;
           document.body.scrollTop = document.body.scrollTop - 2;
         }
       }
     },
     collect: (monitor) => ({
       hovered: monitor.isOver(),
     }),
   });

   drag(drop(ref));

   const onClick = (e) => {
     onSelectionChange(index, e.ctrlKey);
   };

   useEffect(() => {
     preview(getEmptyImage(), {
       captureDraggingState: true,
     });
   }, []);

   const opacity = isDragging ? 0.4 : 1;

   const borderLeft = insertLineOnLeft && hovered ? "2px solid #2988bc" : null;

   const borderRight =
     insertLineOnRight && hovered ? "2px solid #2988bc" : null;

   const pageHeight = width > height ? 103 : 146;

   return (
     <>
       <div
         className={`preview  ${isSelected ? "selected" : ""} `}
         ref={ref}
         onClick={onClick}
         style={{ opacity, borderLeft, borderRight }}
         id={id}
         data-id={id}
         data-index={index}
         data-page-rotation={rotation}
         data-page-number="1"
       >
         <div className="preview__inner page">
           <div className="page__controls">
             <button className="btn btn-icon btn-icon--small">
               <ZoomIn
                 onClick={() => {
                   zoomOnPage();
                 }}
               />
             </button>
           </div>
           <PageContent
             isPreviwerContent={false}
             isPreviwerDragContent={false}
             blob={blob}
             rotation={rotation}
             pageOriginalWidth={width}
             pageOriginalHeight={height}
             height={pageHeight}
           />
         </div>
         <div className="preview__number">{order}</div>
       </div>
     </>
   );
 });

 export default Page;

 Page.propTypes = {
   id: PropTypes.number.isRequired,
   order: PropTypes.number.isRequired,
   blob: PropTypes.object.isRequired,
   rotation: PropTypes.number.isRequired,
   width: PropTypes.number.isRequired,
   height: PropTypes.number.isRequired,
   index: PropTypes.number.isRequired,
   selectedPages: PropTypes.array.isRequired,
   clearPageSelection: PropTypes.func.isRequired,
   rearrangePages: PropTypes.func.isRequired,
   setInsertIndex: PropTypes.func.isRequired,
   onSelectionChange: PropTypes.func.isRequired,
   insertLineOnLeft: PropTypes.bool.isRequired,
   insertLineOnRight: PropTypes.bool.isRequired,
   isSelected: PropTypes.bool.isRequired,
   zoomOnPage: PropTypes.func.isRequired,
 };
