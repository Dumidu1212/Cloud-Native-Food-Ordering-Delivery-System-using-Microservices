import React, { useState } from "react";
import MapPickerLeaflet from "../MapPicker";
import "./../../../styles/pages/registerPage.css";

const RestaurantFields = ({ onChange, onLocationChange }) => {
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
      <input
        placeholder="Restaurant Name"
        onChange={(e) => onChange("restaurantName", e.target.value)}
      />
      <input
        placeholder="Owner Name"
        onChange={(e) => onChange("restaurantOwner", e.target.value)}
      />
      {/* <input
        placeholder="Phone"
        onChange={(e) => onChange("phone", e.target.value)}
      /> */}
      <input
        placeholder="Category"
        onChange={(e) => onChange("category", e.target.value)}
      />
      <label>📍 Pick your location:</label>
      <MapPickerLeaflet onLocationChange={handleLocation} />
    </div>
  );
};

export default RestaurantFields;
