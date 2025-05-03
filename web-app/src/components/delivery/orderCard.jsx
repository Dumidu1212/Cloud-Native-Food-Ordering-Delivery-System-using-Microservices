import { useNavigate } from "react-router-dom";
import MapView from "./MapView";
import { useState } from "react";

const OrderCard = ({ order, onAccept, onDecline, driverLocation }) => {
  const [accepted, setAccepted] = useState(order.status === "Accepted");
  const [declined, setDeclined] = useState(order.status === "Declined");

  console.log(accepted, declined);
  
  const navigate = useNavigate();
  
  const handleAccept = (orderId) => {
    onAccept(orderId);
    setAccepted(true);
  };

  const handleDecline = (orderId) => {
    onDecline(orderId);
    setDeclined(true);
  }

  const handleTrackDelivery = (orderId) => {
    console.log("Inside OrderCard ; Tracking delivery for order:", orderId);
    navigate(`/delivery/track/${orderId}`, 
    {
      state: { driverLocation, order },
    });
  };

  const restaurantCoords =
    Array.isArray(order?.restaurantLocation?.coordinates) &&
    order.restaurantLocation.coordinates.length === 2
      ? order.restaurantLocation.coordinates.slice().reverse()
      : null;

  const driverCoords =
    Array.isArray(driverLocation) && driverLocation.length === 2
      ? driverLocation.slice().reverse()
      : null;

  // Prepare markers only if coordinates are valid
  const markers = [];
  if (restaurantCoords) {
    markers.push({ label: "Restaurant", coordinates: restaurantCoords });
  }
  if (driverCoords) {
    markers.push({ label: "You", coordinates: driverCoords });
  }

  return (
    <div className="order-card border p-3 mb-3 rounded shadow-sm">
      <h5>Order #{order._id}</h5>
      <p>
        Total: Rs.{" "}
        {order.total ??
          order.totalAmount ??
          Math.floor(Math.random() * 1001) + 1000}
      </p>
      <p>Status: {order.status}</p>
      {order.items.map((item, i) => (
        <p key={i}>
          {item.foodItem?.name || "Unnamed Item"} × {item.quantity}
        </p>
      ))}

      {markers.length > 0 ? (
        <MapView markers={markers} />
      ) : (
        <p className="text-muted">Location data unavailable</p>
      )}

      <div className="mt-2">
      {order.status !== "Accepted" ? (
        <>
        {onAccept && (
          <button
            className="btn btn-success me-2"
            onClick={() => handleAccept(order._id)}
              >
            Accept
          </button>
        )}
        {onDecline && (
          <button
            className="btn btn-danger"
            onClick={() => handleDecline(order._id)}
          >
          Decline
          </button>
       )}
       </>
      ) : (
        <button className="btn btn-primary" onClick={() => handleTrackDelivery(order._id)}>
            Track Delivery
        </button>
        )}
    </div>
      </div>
  );
};

export default OrderCard;
