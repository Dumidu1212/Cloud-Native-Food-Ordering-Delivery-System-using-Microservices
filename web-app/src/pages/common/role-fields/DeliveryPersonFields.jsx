import React, { useState } from "react";
import MapPickerLeaflet from "../MapPicker";
import "./../../../styles/pages/registerPage.css";

const DeliveryPersonFields = ({ onChange, onLocationChange }) => {
  const [location, setLocation] = useState(null);
  
  console.log("DeliveryPersonFields: location", location);

  const handleLocation = (location) => {
    setLocation(location);
    onLocationChange(location); // 👈 Notify parent
    onChange("address", location); // optional if storing address text
  };

  return (
    <div className="role-fields">
      {/* <input
        placeholder="Phone"
        onChange={(e) => onChange("phone", e.target.value)}
      /> */}
      <input
        placeholder="Vehicle Number"
        onChange={(e) => onChange("vehicleNumber", e.target.value)}
      />
      <input
        placeholder="License"
        onChange={(e) => onChange("license", e.target.value)}
      />
      <select onChange={(e) => onChange("gender", e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <label>📍 Pick your location:</label>
      <MapPickerLeaflet onLocationChange={handleLocation} />
    </div>
  );
};

export default DeliveryPersonFields;
