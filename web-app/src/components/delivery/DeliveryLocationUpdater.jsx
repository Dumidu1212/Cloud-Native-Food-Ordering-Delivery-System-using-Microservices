import socket from "../socket";
import { useEffect } from "react";

const DriverLocationUpdater = ({ deliveryPersonId, currentLocation }) => {
  useEffect(() => {
    if (!deliveryPersonId) return;

    // Join room for the delivery person
    socket.emit("joinRoom", deliveryPersonId);

    // Send location updates
    socket.emit("updateLocation", {
      roomId: deliveryPersonId, // Or could be orderId if preferred
      location: currentLocation, // { lat, lng }
    });

    // Optional: Cleanup when component unmounts
    return () => {
      socket.emit("leaveRoom", deliveryPersonId);
    };
  }, [deliveryPersonId, currentLocation]);

  return null; // or a hidden component
};

export default DriverLocationUpdater;