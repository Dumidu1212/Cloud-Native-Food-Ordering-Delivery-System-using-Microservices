import React, { createContext, useContext, useState } from "react";

// Create the context
const DeliveryContext = createContext();

// Provide the context to the app
export const useDelivery = () => {
  return useContext(DeliveryContext);
};

export const DeliveryProvider = ({ children }) => {
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]);

  // Update ongoing deliveries (add accepted deliveries, etc.)
  const addOngoingDelivery = (delivery) => {
    setOngoingDeliveries((prevDeliveries) => [...prevDeliveries, delivery]);
  };

  const updateDelivery = (orderId, updatedData) => {
    setOngoingDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.orderId === orderId
          ? { ...delivery, ...updatedData }
          : delivery
      )
    );
  };

  return (
    <DeliveryContext.Provider
      value={{ ongoingDeliveries, addOngoingDelivery, updateDelivery }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
