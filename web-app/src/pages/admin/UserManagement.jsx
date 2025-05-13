import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from '../../components/admin/Loader';
import Pagination from '../../components/admin/Pagination'; 
import { Table } from '../../components/admin/CardTable';
import {
  fetchUsers,
  updateUserStatus,
  approveUser,
  deleteUser
} from '../../services/adminApi';

/* ––––– styled helpers ––––– */
const ActionBtn = styled.button`
  margin-right:.5rem;border:none;background:none;font:inherit;
  color:${({theme})=>theme.colours.primary};cursor:pointer;

  &.danger   {color:${({theme})=>theme.colours.danger}}
  &.approve  {color:${({theme})=>theme.colours.success}}
`;

/* ––––– main component ––––– */
export default function UserManagement() {
  /* state */
  const [rows,setRows]         = useState([]);
  const [page,setPage]         = useState(1);
  const [total,setTotal]       = useState(0);
  const [loading,setLoading]   = useState(true);
  const limit = 15;

  /* fetch */
  const load = async (p=1) => {
    setLoading(true);
    try{
      const res = await fetchUsers(p,limit);      // {page,limit,total,data}
      setRows(res.data);
      setTotal(res.total);
      setPage(res.page);
    }finally{ setLoading(false); }
  };
  useEffect(()=>{ load(1); },[]);

  /* actions */
  const toggle = (u)=>
    updateUserStatus(u._id, u.status==='Active'?'Inactive':'Active').then(()=>load(page));

  const approve = (u)=> approveUser(u._id).then(()=>load(page));
  const remove  = (u)=> window.confirm('Delete user?') &&
                        deleteUser(u._id).then(()=>load(page));

  /* ui */
  return(
    <>
      {loading? <Loader/> : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th/>
              </tr>
            </thead>
            <tbody>
              {rows.map(u=>(
                <tr key={u._id}>
                  <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.status}</td>
                  <td>
                    {u.status==='Pending' && (
                      <ActionBtn className="approve" onClick={()=>approve(u)}>Approve</ActionBtn>
                    )}
                    <ActionBtn onClick={()=>toggle(u)}>
                      {u.status==='Active'?'Block':'Unblock'}
                    </ActionBtn>
                    <ActionBtn className="danger" onClick={()=>remove(u)}>Delete</ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={page} total={total} limit={limit} onChange={load}/>
        </>
      )}
    </>
  );
}
