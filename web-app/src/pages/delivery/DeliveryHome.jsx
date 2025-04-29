import { useEffect, useState , useCallback } from "react";
import axios from "axios";
import OrderCard from "../../components/delivery/orderCard";

const DeliveryHome = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [availability, setAvailability] = useState(true); // default
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [geolocationDenied, setGeolocationDenied] = useState(false);

  const raw = localStorage.getItem("token");

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

  console.log("Token (final string):", token);
  console.log("inside Delivery Home");
  console.log("userId:", id);

  const fetchAssignedOrders = useCallback(async () => {
    console.log("Fetching assigned orders for userId:", id);
    console.log("Token for assigned orders:", token);
    try {
      const res = await axios.get(
        `http://localhost:4040/api/orders/getAssignedOrders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        const orders = res.data.orders || [];
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
  },[id, token]); 

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
  }, [id, token,fetchAssignedOrders]);

  // Fetch delivery history
  useEffect(() => {
    const fetchDeliveryHistory = async () => {
      console.log("Fetching delivery history for userId:", id);
      console.log("Token for delivery history:", token);
      try {
        const res = await axios.get(
          "http://localhost:4040/api/orders/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveryHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch delivery history", err);
      }
    };
    if (id && token) {
    fetchDeliveryHistory();
    }else if (!id) {
      console.error("User ID is not available in localStorage");
    } else if (!token) {
      console.error("Token is not available in localStorage");
    }
  }, [id, token]);

  // Fetch delivery person availability status
  useEffect(() => {
    const fetchAvailability = async () => {
      console.log("Fetching availability status for userId:", id);
      console.log("Token for availability check:", token);
      try {
        const res = await axios.get(
          `http://localhost:4000/api/delivery/availability/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailability(res.data.isAvailable);
      } catch (err) {
        console.error("Failed to fetch availability status", err);
      }
    };

    if (id && token) {
      fetchAvailability();
    }else if (!id) {
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
        fetchAssignedOrders();
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

  // Toggle delivery person availability
  const toggleAvailability = async () => {
    try {
      setLoading(true);
      const newStatus = !availability;

      const res = await axios.post(
        `http://localhost:4000/api/delivery/UpdateAvailability/${id}`,
        { isAvailable: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
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
    try {
      await axios.post(
        `http://localhost:4040/api/orders/accept/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order accepted!");
      setAssignedOrders((orders) =>
        orders.map((o) =>
          o._id === orderId ? { ...o, status: "Accepted" } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to accept order");
    }
  };

  // Decline an order
  const handleDecline = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:4040/api/orders/decline/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order declined.");
      setAssignedOrders((orders) => orders.filter((o) => o._id !== orderId));
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
          <strong>Delivered Orders:</strong> {deliveryHistory.length}
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
    </div>
  );
};

export default DeliveryHome;
