// src/pages/DeliveryHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../../components/delivery/orderCard";
import LoadingSpinner from "../../components/delivery/LoadingSpinner";

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:4000/delivery/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Delivery History</h2>
      {loading ? (
        <LoadingSpinner message="Loading delivery history..." />
      ) : history.length > 0 ? (
        history.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <p>No deliveries yet.</p>
      )}
    </div>
  );
};

export default DeliveryHistory;
