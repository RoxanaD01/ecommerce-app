// Create a basic server
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import { stripeWebhook } from "./controllers/orderController.js";

// ----- App Config -----

const app = express(); // instance of the express server
const port = process.env.PORT || 4000; // if the PORT nr is aviable in the env variable then will be user, if NOT we will use port nr 4000
connectDB();
connectCloudinary();

// ----- Middlewares -----

// CORS restrictionat la domeniile tale
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, // e.g. https://yourshop.com
  process.env.ADMIN_URL, // e.g. https://admin.yourshop.com
].filter(Boolean); // removes undefined if env vars aren't set yet

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
  }),
);

// The webhook MUST be registered BEFORE express.json() so the body arrives as raw Buffer.
// Stripe verifies the raw bytes — once express.json() parses them, signature verification breaks.

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }), // raw bytes
  stripeWebhook,
);

app.use(express.json()); // wathever request we will have, it will be parsed using JSON

// ----- API Endpoints -----
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.get("/", (req, res) => {
  // Whenever we'll open locahost port 4000 will be deplayed this message
  res.send("API Working");
});

// ----- ERROR middleware -----
// Global error handler — prinde orice eroare aruncată cu next(error) din controllere

app.use((err, req, res, next) => {
  console.error(err.stack);
  const isProduction = process.env.NODE_ENV === 'production';
  res
    .status(500)
    .json({ success: false, message: isProduction ? 'Internal server error' : (err.message || "Internal server error" )});
});

// ----- START the server -----

app.listen(port, () => console.log("Server started on PORT: " + port));
