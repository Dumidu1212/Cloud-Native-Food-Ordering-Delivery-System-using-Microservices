import React from "react";
import "../../styles/components/spinner.css"; // Adjust the path as necessary

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <div className="lds-dual-ring"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
