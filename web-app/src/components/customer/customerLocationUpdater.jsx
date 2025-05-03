import socket from "../socket";
import { useEffect, useState } from "react";

const CustomerOrderTracker = ({ orderId }) => {
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    // Join room to listen to updates for this order
    socket.emit("joinRoom", orderId);

    socket.on("locationUpdate", (location) => {
      console.log("Driver moved to:", location);
      setDriverLocation(location);
    });

    // Cleanup
    return () => {
      socket.emit("leaveRoom", orderId);
      socket.off("locationUpdate");
    };
  }, [orderId]);

  return (
    <div>
      {driverLocation ? (
        <p>
          Driver Location: {driverLocation.lat}, {driverLocation.lng}
        </p>
      ) : (
        <p>Waiting for driver...</p>
      )}
    </div>
  );
};

export default CustomerOrderTracker;
