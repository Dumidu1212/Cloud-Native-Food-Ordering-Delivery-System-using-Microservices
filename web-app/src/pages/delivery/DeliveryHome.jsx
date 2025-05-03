import { useEffect, useState, useCallback } from "react";
import OrderCard from "../../components/delivery/orderCard";
import { api } from "./../../api/index";

const DeliveryHome = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [ongoingDelivery, setOngoingDelivery] = useState([]);
  const [availability, setAvailability] = useState(true); // default
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [geolocationDenied, setGeolocationDenied] = useState(false);

  const raw = localStorage.getItem("token");
  let deliveryPersonUserId = "";
  let token = "";
  let id = "";

  try {
    const parsed = JSON.parse(raw); // ✅ only works if stored as JSON
    token = parsed.token;
    id = parsed.userId;
  } catch (err) {
    console.log("Token is already a string or malformed JSON", err);
    token = raw; // fallback
    id = localStorage.getItem("userId"); // fallback if userId was stored separately
  }

  const fetchAssignedOrders = useCallback(async () => {
    try {
      //get assigned orders
      const res = await api.orders.getAssignedTo(id, token);

      console.log("Response from server:", res.data);

      if (res.data.success) {
        const orders = res.data.data;
        console.log("Assigned orders:", orders);
        if (orders.length === 0) {
          alert("No assigned orders found.");
          setAssignedOrders([]);
        } else {
          setAssignedOrders(orders);
        }
      } else {
        console.error("Error from server:", res.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch assigned orders", err);
    }
  }, [id, token]);

  // Fetch assigned orders
  useEffect(() => {
    if (id && token) {
      console.log("Fetching assigned orders for userId:", id);
      fetchAssignedOrders();
    } else if (!id) {
      console.error("User ID is not available in localStorage");
    } else if (!token) {
      console.error("Token is not available in localStorage");
    }
  }, [id, token, fetchAssignedOrders]);

  // Fetch delivery person availability status
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        //check availability
        const res = await api.delivery.checkAvailability(id, token);
        setAvailability(res.data.isAvailable);
      } catch (err) {
        console.error("Failed to fetch availability status", err);
      }
    };

    if (id && token) {
      fetchAvailability();
    } else if (!id) {
      console.error("User ID is not available in localStorage");
    } else if (!token) {
      console.error("Token is not available in localStorage");
    }
  }, [id, token]); // ✅ include dependencies here

  useEffect(() => {
    if (token && id) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeolocationDenied(false);
          const { longitude, latitude } = pos.coords;
          setDriverLocation([longitude, latitude]);
          console.log(`geolocationDenied: ${geolocationDenied}`);
          console.log("Driver location set:", [longitude, latitude]);
          // fetchAssignedOrders();
        },
        (err) => {
          console.log(`geolocationDenied: ${geolocationDenied}`);
          console.error("Geolocation error:", err);
          setGeolocationDenied(true);
          alert(
            "Geolocation permission denied. Please enable location services in your browser settings."
          );
        }
      );
    }
  }, [fetchAssignedOrders, geolocationDenied, id, token]); // ✅ include dependencies here

  const toggleAvailability = async () => {
    try {
      setLoading(true);
      const newStatus = !availability;

      //update availability
      const res = await api.delivery.updateAvailability(id, newStatus, token);

      if (!res.data.success) {
        throw new Error("Failed to update availability status");
      }
      setAvailability(newStatus);
      alert(`You are now ${newStatus ? "available" : "unavailable"}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  // Accept an order
  const handleAccept = async (orderId) => {
    deliveryPersonUserId = id; // Use the ID from localStorage or state
    try {
          const acceptResponse = await api.orders.accept(
            orderId,
            deliveryPersonUserId,
            token
          );

      if (acceptResponse.status === 200) {
        alert("Order accepted!");

        // Move accepted order to ongoing delivery and update assigned orders
        const acceptedOrder = acceptResponse.data; // Assuming the response contains the updated order data

        // Update ongoing deliveries state
        setOngoingDelivery((prevOngoing) => [...prevOngoing, acceptedOrder]);

        console.log(`ongoingDelivery: ${ongoingDelivery}`);

        setAssignedOrders((orders) => orders.filter((o) => o._id !== orderId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept order");
    }
  };

  // Decline an order
  const handleDecline = async (orderId) => {
    deliveryPersonUserId = id;
    console.log("Declining order:", orderId);
    console.log("Delivery person ID:", deliveryPersonUserId);
    try {
      const declineResponse = await api.orders.decline(
        orderId,
        deliveryPersonUserId,
        token
      );
      if (declineResponse.status === 200) {
        console.log("Decline response:", declineResponse.data);
        alert("Order declined.");
        setAssignedOrders((orders) => orders.filter((o) => o._id !== orderId));

        const resAvailability = await api.delivery.updateAvailability(
          deliveryPersonUserId,
          true,
          token
        );
        if (resAvailability.status === 200) {
          console.log("Driver availability updated successfully.");
          alert("Order delivered. You are now available for new deliveries.");
        } else {
          console.warn("Failed to update driver availability");
          alert("Order delivered but failed to update availability.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to decline order");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Delivery Dashboard</h2>

      {/* Quick Stats */}
      <div className="bg-light p-3 rounded shadow-sm mb-4">
        <h5>Quick Stats</h5>
        <p>
          <strong>Assigned Orders:</strong> {assignedOrders.length}
        </p>
        <p>
          <strong>Ongoing Deliveries:</strong> {ongoingDelivery.length}
        </p>
        <p>
          <strong>Availability Status:</strong>{" "}
          {availability ? (
            <span className="text-success">Available</span>
          ) : (
            <span className="text-danger">Unavailable</span>
          )}
        </p>

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={toggleAvailability}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : availability
            ? "Go Unavailable"
            : "Go Available"}
        </button>
      </div>

      {geolocationDenied && (
        <div className="alert alert-danger mt-3">
          Location access denied. Some features may be limited.
          <br />
          <button
            className="btn btn-sm btn-warning mt-2"
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setGeolocationDenied(false);
                  const { longitude, latitude } = pos.coords;
                  setDriverLocation([longitude, latitude]);
                  fetchAssignedOrders();
                },
                (err) => {
                  console.error("Retry geolocation failed:", err);
                  alert(
                    "Still unable to access location. Please enable it from browser settings."
                  );
                }
              );
            }}
          >
            Retry Location Access
          </button>
        </div>
      )}

      {/* Assigned Orders Section */}
      <h4>Assigned Orders</h4>
      {assignedOrders.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        assignedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            driverLocation={driverLocation}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      )}
      <h4>Ongoing Deliveries</h4>
      {ongoingDelivery.length === 0 ? (
        <p>No ongoing deliveries yet.</p>
      ) : (
        ongoingDelivery.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            driverLocation={driverLocation}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      )}
    </div>
  );
};

export default DeliveryHome;
