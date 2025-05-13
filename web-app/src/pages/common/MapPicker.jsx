import React, { useState } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
});

const LocationMarker = ({
  position,
  setPosition,
  onDragEnd,
  onClick,
  setTempGeoJson,
}) => {
  useMapEvents({
    click(e) {
      const clicked = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      setPosition(clicked);
      setTempGeoJson({
        type: "Point",
        coordinates: [clicked.lng, clicked.lat],
      });
      onClick({
        type: "Point",
        coordinates: [clicked.lng, clicked.lat],
      });
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
          setTempGeoJson({
            type: "Point",
            coordinates: [latlng.lng, latlng.lat],
          });
          onDragEnd({
            type: "Point",
            coordinates: [latlng.lng, latlng.lat],
          });
        },
      }}
    />
  ) : null;
};

const LocateButton = ({ setMapCenter, setTempGeoJson }) => {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      map.setView(coords, 14);
      setMapCenter(coords);
      setTempGeoJson({
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      });
    });
  };

  return (
    <button onClick={locate} style={{ margin: "10px", padding: "5px 10px" }}>
      📍 Locate Me
    </button>
  );
};

const MapPickerLeaflet = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null); // Initially null
  const [tempGeoJson, setTempGeoJson] = useState(null);
  const [saved, setSaved] = useState(false);

   const handleSave = () => {
     if (!tempGeoJson) {
       alert("Please select a location on the map first.");
       return;
     }
     onLocationChange(tempGeoJson); // Send to parent
     setSaved(true);
   };

   const handleReset = () => {
     setPosition(null);
     setTempGeoJson(null);
     setSaved(false);
     onLocationChange(null); // Clear location in parent
   };

  const handleUpdate = (location) => {
    if (!location?.lat || !location?.lng) return;
    setPosition(location);
    onLocationChange({
      type: "Point",
      coordinates: [location.lng, location.lat],
    });
  };

  return (
    <div>
      <MapContainer
        center={{ lat: 6.9271, lng: 79.8612 }}
        zoom={13}
        style={{ height: "300px", width: "100%", marginBottom: "1rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onDragEnd={handleUpdate}
          onClick={handleUpdate}
          setTempGeoJson={setTempGeoJson}
        />
        <LocateButton
          setMapCenter={handleUpdate}
          setTempGeoJson={setTempGeoJson}
        />
      </MapContainer>

      <div style={{ textAlign: "center" }}>
        <button
          className="map-btn"
          onClick={handleSave}
          disabled={!tempGeoJson}
        >
          ✅ Save Location
        </button>
        <button
          className="map-btn"
          onClick={handleReset}
          style={{ marginLeft: "10px" }}
        >
          🔄 Reset Location
        </button>
      </div>

      {!saved || !position && (
        <p style={{ color: "red", textAlign: "center" }}>
          📍 Please click on the map to select your location.
        </p>
      )}

      {saved && position && (
        <p style={{ color: "green", textAlign: "center" }}>
          📍 Location saved! Coordinates: {position.lat}, {position.lng}
        </p>
      )}
    </div>
  );
};

export default MapPickerLeaflet;
