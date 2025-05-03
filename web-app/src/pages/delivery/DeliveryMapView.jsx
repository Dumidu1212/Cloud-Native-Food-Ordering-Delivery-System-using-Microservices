import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";

const DeliveryMapView = ({ markers, isTracking }) => {
  const [driverLocation, setDriverLocation] = useState(
    markers.find((m) => m.label === "Delivery Person")?.coordinates || [0, 0]
  );
  console.log("Driver Location:", driverLocation);
  const [zoomLevel, setZoomLevel] = useState(14); // Default zoom level for the map

  const mapRef = useRef(null);

  useEffect(() => {
    if (isTracking && mapRef.current) {
      // Dynamically change zoom level (this is just an example)
      setZoomLevel(16); // Example of changing zoom level
      mapRef.current.setZoom(zoomLevel); // Set the map zoom level
    }
  }, [isTracking, zoomLevel]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:4000"); // Adjust your server URL
    socket.on("delivery-update", (locationData) => {
      if (locationData.orderId) {
        setDriverLocation(locationData.location);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Re-center the map when the driver's location changes or the map is in tracking mode
  useEffect(() => {
    if (mapRef.current && isTracking) {
      const map = mapRef.current;
      map.setView(
        new L.LatLng(driverLocation[0], driverLocation[1]),
        zoomLevel
      );
    }
  }, [driverLocation, isTracking, zoomLevel]);

  return (
    <MapContainer
      center={driverLocation}
      zoom={zoomLevel}
      ref={mapRef}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance; // save the leaflet map instance
      }}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add markers for restaurant and driver */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.coordinates}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DeliveryMapView;
