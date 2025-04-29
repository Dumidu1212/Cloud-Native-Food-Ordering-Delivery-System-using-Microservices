import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

// Fix Leaflet icon path issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const coords = [e.latlng.lat, e.latlng.lng];
      setPosition(coords);
      onSelect(coords);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onCoordinatesSelect }) => {
  return (
    <MapContainer
      center={[6.9271, 79.8612]}
      zoom={7}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onCoordinatesSelect} />
    </MapContainer>
  );
};

export default MapPicker;
