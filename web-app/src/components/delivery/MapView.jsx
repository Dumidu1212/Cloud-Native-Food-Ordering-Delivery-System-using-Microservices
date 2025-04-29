import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const MapView = ({ markers }) => {
  const center = markers[0]?.coordinates || [6.9271, 79.8612];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "300px" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, idx) => (
        <Marker key={idx} position={m.coordinates}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
