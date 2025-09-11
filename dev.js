const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary");

const { __connectToMongo } = require("./src/database/db");
__connectToMongo();

const app = express();
const port = process.env.PORT || 8012;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// All Routes
const { V1 } = require("./src/routeController");
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/v1/app", V1.APP_ROUTE);
app.use("/api/v1/admin", V1.ADMIN_ROUTE);
app.use("/api/v1/common", V1.COMMON_ROUTE);

// Server
// app.listen(port, host, () => {
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
