import React, { useState } from "react";
import MapPickerLeaflet from "../MapPicker";
import "./../../../styles/pages/registerPage.css";

const CustomerFields = ({ onChange, onLocationChange }) => {
  const [location, setLocation] = useState(null);
  console.log(location);

  const handleLocation = (location) => {
    setLocation(location);
    onLocationChange(location); // 👈 Notify parent
    console.log("Location selected:", location);
    onChange("address", location); // Send GeoJSON-style location
  };

  return (
    <div className="role-fields">
      <label>📍 Pick your location:</label>
      <MapPickerLeaflet onLocationChange={handleLocation} />
    </div>
  );
};

export default CustomerFields;
