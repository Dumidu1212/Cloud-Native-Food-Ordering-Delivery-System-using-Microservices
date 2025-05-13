import { useEffect,useState } from 'react';
import styled from 'styled-components';
import Loader from '../../components/admin/Loader';
import { Table } from '../../components/admin/CardTable';
import {
  fetchDeliveryPersons,
  approveDeliveryPerson,
  updateDeliveryPersonStatus,
  deleteDeliveryPerson
} from '../../services/adminApi';

const Btn = styled.button`
  margin-right:.5rem;border:none;background:none;font:inherit;
  color:${({theme})=>theme.colours.primary};cursor:pointer;
  &.approve {color:${({theme})=>theme.colours.success}}
  &.danger  {color:${({theme})=>theme.colours.danger}}
`;

export default function DeliveryApproval(){
  const [rows,setRows]=useState([]);const [loading,setLoading]=useState(true);

  const load=async()=>{
    setLoading(true);
    try{ setRows(await fetchDeliveryPersons()); }finally{ setLoading(false); }
  };
  useEffect(()=>{load()},[]);

  const approve = d=> approveDeliveryPerson(d._id).then(load);
  const toggle  = d=> updateDeliveryPersonStatus(d._id,d.status==='Active'?'Inactive':'Active').then(load);
  const remove  = d=> window.confirm('Delete?') && deleteDeliveryPerson(d._id).then(load);

  return loading? <Loader/> : (
    <Table>
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th/></tr></thead>
      <tbody>
        {rows.map(d=>(
          <tr key={d._id}>
            <td>{d.name}</td><td>{d.email}</td><td>{d.phone}</td><td>{d.status}</td>
            <td>
              {d.status==='Pending' && <Btn className="approve" onClick={()=>approve(d)}>Approve</Btn>}
              <Btn onClick={()=>toggle(d)}>{d.status==='Active'?'Block':'Unblock'}</Btn>
              <Btn className="danger" onClick={()=>remove(d)}>Delete</Btn>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
