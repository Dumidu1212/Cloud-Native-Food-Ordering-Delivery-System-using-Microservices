import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from '../../components/admin/Loader';
import { Table } from '../../components/admin/CardTable';
import {
  fetchRestaurants,
  updateRestaurantStatus,
  approveRestaurant,
  deleteRestaurant
} from '../../services/adminApi';

const Btn = styled.button`
  margin-right:.5rem;border:none;background:none;font:inherit;
  color:${({theme})=>theme.colours.primary};cursor:pointer;
  &.approve {color:${({theme})=>theme.colours.success}}
  &.danger  {color:${({theme})=>theme.colours.danger}}
`;

export default function RestaurantApproval(){
  const [rows,setRows]   = useState([]);
  const [loading,setLoading]=useState(true);

  const load = async()=>{
    setLoading(true);
    try{ setRows(await fetchRestaurants()); }finally{ setLoading(false); }
  };
  useEffect(()=>{load()},[]);

  const approve = r => approveRestaurant(r._id).then(load);
  const toggle  = r => updateRestaurantStatus(r._id,r.status==='Active'?'Inactive':'Active').then(load);
  const remove  = r => window.confirm('Delete?') && deleteRestaurant(r._id).then(load);

  return loading ? <Loader/> : (
    <Table>
      <thead><tr><th>Name</th><th>Email</th><th>Status</th><th/></tr></thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r._id}>
            <td>{r.name}</td><td>{r.email}</td><td>{r.status}</td>
            <td>
              {r.status==='Pending' && <Btn className="approve" onClick={()=>approve(r)}>Approve</Btn>}
              <Btn onClick={()=>toggle(r)}>{r.status==='Active'?'Deactivate':'Activate'}</Btn>
              <Btn className="danger" onClick={()=>remove(r)}>Delete</Btn>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
