const deliveryService = require("./../Services/deliveryService");
const DeliveryPerson = require("./../Models/DeliveryPerson");

// 🧠 POST /api/delivery/assign 
const assignOrder = async (req, res) => {

  console.log("delivery controller in delivery-service folder");

  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  console.log("Order ID:", orderId);

  try {
    const result = await deliveryService.assignOrder(orderId, req.token);
    console.log("Order assignment result:", result);
    
    if (result.error) {
      return res.status(500).json({ message: result.error });
    }
   
    res.status(200).json(result);
  } catch (err) {
    console.error("Error assigning order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 👤 PUT /api/delivery/profile
// Update delivery person profile
const updateProfile = async (req, res) => {
  try {
    const updated = await DeliveryPerson.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Delivery profile not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get delivery person profile
const getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for userId:", req.user.id);
    const profile = await DeliveryPerson.findOne({ userId: req.user.id });
    console.log("profile:", profile);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /delivery/availability/:id
const checkAvailability = async (req, res) => {

  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Find delivery person by userId (not by _id)
    const deliveryPerson = await DeliveryPerson.findOne({ userId : userId });

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    res.status(200).json({
      deliveryPersonId: deliveryPerson._id,
      name: deliveryPerson.name,
      isAvailable: deliveryPerson.isAvailable,
      status: deliveryPerson.status,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /delivery/availability/:id
const updateAvailability = async (req, res) => {
  const { id } = req.params; // id is the userId in the route parameter
  const { isAvailable } = req.body; // availability status from request body

  try {
    // Find delivery person by userId
    const deliveryPerson = await DeliveryPerson.findOne({ userId: id });

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    // Update the availability status
    deliveryPerson.isAvailable = !deliveryPerson.isAvailable;
    await deliveryPerson.save(); // Save the updated delivery person

    return res.status(200).json({
      success: true,
      message: "Availability status updated",
      isAvailable: deliveryPerson.isAvailable, // Return the updated status
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    return res.status(500).json({
      success: false,
      message: "Server error updating availability",
    });
  }
};

// In your delivery controller (e.g., deliveryController.js)
const updateLocation = async (req, res) => {
  try {
    const { deliveryPersonId, latitude, longitude } = req.body;
    const io = req.app.get("io");

    if (
      !deliveryPersonId ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the delivery person
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    // Update GeoJSON location
    deliveryPerson.location = {
      type: "Point",
      coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
    };
    await deliveryPerson.save();

    const updatedLocation = {
      deliveryPersonId,
      coordinates: deliveryPerson.location.coordinates,
    };

    // Emit to frontend
    io.emit("locationUpdate", updatedLocation);

    io.to(orderId).emit("locationUpdate", updatedLocation);
    
    res.status(200).json({
      message: "Location updated successfully",
      location: updatedLocation,
    });
  } catch (err) {
    console.error("Error updating location:", err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  updateProfile,
  updateLocation,
  getProfile,
  assignOrder,
  checkAvailability,
  updateAvailability,
};