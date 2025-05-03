const axios = require("axios");
require("dotenv").config(); // Load .env file

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
// Define the base URLs for each service
const SERVICE_BASE_URLS = {
  orderService: ORDER_SERVICE_URL,
};

// Centralized request function for service-to-service communication
const makeServiceRequest = async (
  serviceName,
  method,
  endpoint,
  data = {},
  token = null
) => {
  const baseUrl = SERVICE_BASE_URLS[serviceName];

  // Check if the serviceName is valid
  if (!baseUrl) {
    throw new Error(
      `Service name ${serviceName} is not valid or not configured.`
    );
  }

  try {
    // Prepare the headers, including the Authorization token if provided
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
    };

    // Construct the full URL
    const url = `${baseUrl}${endpoint}`;

    const config = {
      method,
      url,
      headers,
    };

    // 👉 Only add data if the method is not GET
    if (method.toLowerCase() !== "get") {
      config.data = data;
    }

     const response = await axios(config);
    // Log the full response for debugging purposes
    console.log(`Response from ${serviceName}:`, response.data);

    // Check if the response is valid and is in JSON format
    if (!response.data || response.data === "null") {
      throw new Error("Received null or empty response from orderService");
    }

    if (response.headers["content-type"].includes("application/json")) {
      return response.data; // Return parsed JSON data
    } else {
      // Log the non-JSON response body for debugging
      console.error(
        `Non-JSON response from ${serviceName}:`,
        response.data
      );
      throw new Error("Non-JSON response from service");
    }

  } catch (error) {
    // Log error details
    console.error(
      `Error making request to ${serviceName} at ${baseUrl}${endpoint}:`,
      error.response ? error.response.data : error.message
    );

    // Check if the error is from axios (e.g., network issues, status code issues)
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Body:", error.response.data);
    }

    // Throw the error for further handling
    throw error;
  }
};

module.exports = makeServiceRequest;
