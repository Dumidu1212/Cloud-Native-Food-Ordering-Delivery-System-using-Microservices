const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const orderRoutes = require("./src/Routes/OrderRoutes");

require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4001;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
