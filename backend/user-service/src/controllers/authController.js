// src/controllers/authController.js
import ApiError from "../utils/ApiError.js";
import User     from "../models/User.js";
import Restaurant      from "../models/Restaurant.js";
import DeliveryPerson  from "../models/DeliveryPerson.js";
import Customer        from "../models/Customer.js";
import Admin           from "../models/Admin.js";
import { hash }        from "bcryptjs";
import { loginUser }   from "../services/authService.js";

export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      address,
      location,
      restaurantName,
      category,
      ...rest
    } = req.body;

    // 1) Uniqueness check
    const conflict = await User.findOne({ $or: [{ email }, { phone }] });
    if (conflict) {
      const field = conflict.email === email ? "Email" : "Phone number";
      throw new ApiError(400, `${field} already in use`);
    }

    // 2) Validate geo-coordinates (if required by your schema)
    if (["restaurant","delivery","customer"].includes(role)) {
      if (!address?.coordinates?.every(c => typeof c === "number")) {
        throw new ApiError(400, "Valid address coordinates are required");
      }
    }
    if (role === "delivery") {
      if (!location?.coordinates?.every(c => typeof c === "number")) {
        throw new ApiError(400, "Valid location coordinates are required");
      }
    }

    // 3) Hash password & create user
    const hashedPassword = await hash(password, 10);
    const status = role === "customer" ? "Active" : "Pending";
    const user = await User.create({ name, email, phone, password: hashedPassword, role, status });

    // 4) Create role-specific profile
    switch (role) {
      case "restaurant":
        await Restaurant.create({
          userId: user._id,
          restaurantName,
          restaurantOwner: name,
          address,
          phone,
          email,
          category,
          status: "Pending",
        });
        break;
      case "delivery":
        await DeliveryPerson.create({
          userId: user._id,
          name,
          address,
          location,
          email,
          phone,
          /* ...etc... */
          status: "Pending",
        });
        break;
      case "customer":
        await Customer.create({
          userId: user._id,
          name,
          address,
          phone,
          email,
          status: "Active",
        });
        break;
      case "admin":
        await Admin.create({
          userId: user._id,
          name,
          email,
          phone,
          status: "Active",
        });
        break;
      default:
        throw new ApiError(400, `Unsupported role: ${role}`);
    }

    // 5) Respond
    res.status(201).json({ success: true, userId: user._id, role });
  } catch (err) {
    // pass ApiError to your error-handler, or respond
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const loginResult = await loginUser(req.body);
    // loginResult === { token, userId, name, role, email }
    return res.status(200).json(loginResult);
  } catch (err) {
    next(err);
  }
};


export const meController = (req, res) => {
  // `verifyToken` middleware has already put `req.user`
  const { _id, name, email, role } = req.user;
  res.json({
    userId: _id,
    name,
    email,
    role
  });
};