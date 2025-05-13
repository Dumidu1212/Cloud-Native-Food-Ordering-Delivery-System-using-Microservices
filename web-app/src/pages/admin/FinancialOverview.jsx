import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from '../../components/admin/Loader';
import { fetchFinancialOverview } from '../../services/adminApi';

const Wrap = styled.section`
  display:grid;gap:1.2rem;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
`;
const Card = styled.div`
  background:#fff;border-radius:8px;padding:1.4rem;
  box-shadow:0 2px 6px rgba(0,0,0,.05);
  h3{font-size:.9rem;color:${({theme})=>theme.colours.gray600};margin-bottom:.4rem}
  p{font-size:1.7rem;font-weight:700;color:${({theme})=>theme.colours.gray900}}
`;

export default function FinancialOverview(){
  const [data,setData]=useState(null);

  useEffect(()=>{
    fetchFinancialOverview().then(setData);
  },[]);

  if(!data) return <Loader/>;

  return(
    <Wrap>
      <Card><h3>Total revenue</h3><p>${data.totalRevenue.toLocaleString()}</p></Card>
      <Card><h3>Pending payouts</h3><p>${data.pendingPayouts.toLocaleString()}</p></Card>
      <Card><h3># Transactions</h3><p>{data.transactionCount}</p></Card>
      <Card><h3>Paid</h3><p>{data.paidCount}</p></Card>
      <Card><h3>Pending</h3><p>{data.pendingCount}</p></Card>
    </Wrap>
  );
}
