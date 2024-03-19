// import React, { useContext, useState, useEffect } from "react";
// import { VisibilityContext } from "react-horizontal-scrolling-menu";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// function Arrow({ children, disabled, onClick, direction }) {
//   return (
//     <button className="btn btn-sm btn-info"
//       disabled={disabled}
//       onClick={onClick}
//       style={{
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         position: "absolute", // position the button absolutely
//         top: "50%", // center it vertically
//         transform: "translateY(-50%)", // adjust for the height of the button
//         right: direction === "right" ? "1%" : null, // position it on the right for the right arrow
//         left: direction === "left" ? "1%" : null, // position it on the left for the left arrow
//         opacity: disabled ? "0" : "1",
//         userSelect: "none",
//         fontSize: "0.7em",
//         borderRadius: "50%",
//         padding: "10px",
//         backgroundColor: "#007bff",
//         border: "none",
//         color: "white",
//         width: "30px", // set a specific width
//         height: "30px", // set a specific height
//       }}
//     >
//       {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
//     </button>
//   );
// }



// export function LeftArrow() {
//   const {
//     isFirstItemVisible,
//     scrollPrev,
//     visibleElements,
//     initComplete
//   } = useContext(VisibilityContext);

//   const [disabled, setDisabled] = useState(
//     !initComplete || (initComplete && isFirstItemVisible)
//   );

//   useEffect(() => {
//     // NOTE: detect if the whole component is visible
//     if (visibleElements.length) {
//       setDisabled(isFirstItemVisible);
//     }
//   }, [isFirstItemVisible, visibleElements]);

//   return (
//     <Arrow disabled={disabled} onClick={() => scrollPrev()} direction="left"/>
     
//   );
// }

// export function RightArrow() {
//   const { isLastItemVisible, scrollNext, visibleElements } = useContext(
//     VisibilityContext
//   );

//   const [disabled, setDisabled] = useState(
//     !visibleElements.length && isLastItemVisible
//   );

//   useEffect(() => {
//     if (visibleElements.length) {
//       setDisabled(isLastItemVisible);
//     }
//   }, [isLastItemVisible, visibleElements]);

//   return (
//     <Arrow disabled={disabled} onClick={() => scrollNext()} direction="right" />
      
//   );
// }
