const axios = require('axios');

// Define the base URLs for each service
const SERVICE_BASE_URLS = {
  userService: process.env.USER_SERVICE_URL,
  orderService: process.env.ORDER_SERVICE_URL,
  productService: process.env.PRODUCT_SERVICE_URL,
  restaurantService: process.env.RESTAURANT_SERVICE_URL,
  deliveryService: process.env.DELIVERY_SERVICE_URL,
};

// Centralized request function for service-to-service communication
const makeServiceRequest = async (serviceName, method, endpoint, data = {}, token = null) => {
  const baseUrl = SERVICE_BASE_URLS[serviceName];

  // Check if the serviceName is valid
  if (!baseUrl) {
    throw new Error(`Service name ${serviceName} is not valid or not configured.`);
  }

  try {
    // Prepare the headers, including the Authorization token if provided
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),  // Add token if available
    };

    // Construct the full URL
    const url = `${baseUrl}${endpoint}`;

    // Make the request
    const response = await axios({
      method,
      url,
      headers,
      data,
    });

    return response.data;  // Return the response data
  } catch (error) {
    console.error(`Error making request to ${serviceName} at ${baseUrl}${endpoint}:`, error.response ? error.response.data : error.message);
    throw error;  // Propagate the error
  }
};

module.exports = makeServiceRequest;
