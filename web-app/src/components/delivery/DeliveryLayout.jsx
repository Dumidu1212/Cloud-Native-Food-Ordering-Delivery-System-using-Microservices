// src/layouts/DeliveryLayout.jsx
import DeliveryNavbar from "./DeliveryNavbar";
import { Outlet } from "react-router-dom";

const DeliveryLayout = () => {
  return (
    <div>
      <DeliveryNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DeliveryLayout;
