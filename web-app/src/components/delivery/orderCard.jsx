import MapView from "./MapView";

const OrderCard = ({ order, onAccept, onDecline, driverLocation }) => {
  // Extract coordinates safely
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
      <h5>Order #{order._id.slice(-5)}</h5>
      <p>Total: Rs. {order.total}</p>
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
        {onAccept && (
          <button
            className="btn btn-success me-2"
            onClick={() => onAccept(order._id)}
          >
            Accept
          </button>
        )}
        {onDecline && (
          <button
            className="btn btn-danger"
            onClick={() => onDecline(order._id)}
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
