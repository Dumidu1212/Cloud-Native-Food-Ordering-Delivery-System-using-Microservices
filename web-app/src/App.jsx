import { Routes, Route, Navigate } from 'react-router-dom'

import Register            from './pages/common/Register.jsx'
import Login               from './pages/common/Login.jsx'

import CustomerHome        from './pages/customer/CustomerHome.jsx'

import RestaurantDashboard from './pages/restaurant/RestaurantDashboard.jsx'

import AdminDashboard      from './pages/admin/Dashboard.jsx'
import UserManagement      from './pages/admin/UserManagement.jsx'
import RestaurantApproval  from './pages/admin/RestaurantApproval.jsx'
import FinancialOverview   from './pages/admin/FinancialOverview.jsx'

import DeliveryLayout      from './components/delivery/DeliveryLayout.jsx'
import DeliveryHome        from './pages/delivery/DeliveryHome.jsx'
import DeliveryHistory     from './pages/delivery/DeliveryHistory.jsx'
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage.jsx'

import { RequireAuth }     from './components/common/RequireAuth.jsx'

export default function App() {
  
  return (
    <Routes>
      {/* public */}
      <Route path="/"      element={<Navigate to="/login" replace/>} />
      <Route path="/login"    element={<Login   />} />
      <Route path="/register" element={<Register/>} />

      {/* delivery */}
      <Route path="/delivery/*" element={
        <RequireAuth roles={['delivery']}>
          <DeliveryLayout/>
        </RequireAuth>
      }>
        <Route path="home"    element={<DeliveryHome       />} />
        <Route path="history" element={<DeliveryHistory    />} />
        <Route path="profile" element={<DeliveryProfilePage/>} />
        <Route path="*"       element={<Navigate to="home" replace/>}/>
      </Route>

      {/* customer */}
      <Route path="/customer/home" element={
        <RequireAuth roles={['customer']}>
          <CustomerHome/>
        </RequireAuth>
      }/>

      {/* restaurant */}
      <Route path="/restaurant" element={
        <RequireAuth roles={['restaurant']}>
          <RestaurantDashboard/>
        </RequireAuth>
      }/>

      {/* admin */}
      <Route path="/admin/*" element={
        <RequireAuth roles={['admin']}>
          <AdminDashboard/>
        </RequireAuth>
      }>
        <Route path="users"       element={<UserManagement     />} />
        <Route path="restaurants" element={<RestaurantApproval />} />
        <Route path="financials"  element={<FinancialOverview  />} />
        <Route path="*"           element={<Navigate to="users" replace/>}/>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
