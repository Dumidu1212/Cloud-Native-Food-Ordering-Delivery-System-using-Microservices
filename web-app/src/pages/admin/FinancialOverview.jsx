// src/pages/admin/FinancialOverview.jsx
import React, { useEffect, useState } from 'react';
import { fetchFinancialOverview } from '../../services/adminApi.js';

export default function FinancialOverview() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchFinancialOverview().then(resp => setData(resp.data)); }, []);

  if (!data) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div>Total Revenue: ${data.totalRevenue}</div>
      <div>Pending Payouts: ${data.pendingPayouts}</div>
      <div>Transactions: {data.transactionCount} (Paid: {data.paidCount}, Pending: {data.pendingCount})</div>
    </div>
  );
}