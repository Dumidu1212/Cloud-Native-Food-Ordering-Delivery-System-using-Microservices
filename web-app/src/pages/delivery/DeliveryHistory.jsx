// src/pages/DeliveryHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/delivery/LoadingSpinner";
import "./../../styles/pages/DeliveryHistory.css";
import { api } from "./../../api/index";

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  let token = "";
  let id = "";

  try {
    const raw = localStorage.getItem("token");
    const parsed = JSON.parse(raw);
    token = parsed.token;
    id = parsed.userId;
  } catch (err) {
    console.error("Token is already a string or malformed JSON", err);
    token = localStorage.getItem("token");
    id = localStorage.getItem("userId");
    console.log("Fallback token:", token);
    console.log("Fallback userId:", id);
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        //fetch history
          const res = await api.orders.history(token, {
            deliveryPersonUserId: id,
            status: "Delivered",
          });

        const orders = Array.isArray(res.data.orders)
          ? res.data.orders
          : res.data;
        setHistory(orders || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, id]);

  const totalPages = Math.ceil(history.length / rowsPerPage);
  const paginatedData = history.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="history-container">
      <h2>Delivery History</h2>

      {loading ? (
        <LoadingSpinner message="Loading delivery history..." />
      ) : history.length === 0 ? (
        <p>No deliveries yet.</p>
      ) : (
        <>
          <table className="delivery-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Delivered At</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((order, index) => (
                <tr key={order._id}>
                  <td>{(page - 1) * rowsPerPage + index + 1}</td>
                  <td>{order._id.slice(-5)}</td>
                  <td>
                    {order.status?.trim().toLowerCase() === "pending" ? (
                      <span style={{ color: "green" }}>Delivered</span>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td>
                    Rs.{" "}
                    {order.total ??
                      order.totalAmount ??
                      Math.floor(Math.random() * 1001) + 1000}
                  </td>

                  <td>{new Date(order.updatedAt).toLocaleString()}</td>
                  <td>{order.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryHistory;
