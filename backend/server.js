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
const app = express(); 
const port = process.env.PORT || 4000; 
connectDB();
connectCloudinary();

// ----- Middlewares -----
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, 
  process.env.ADMIN_URL, 
].filter(Boolean); 

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
  }),
);

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }), // raw bytes
  stripeWebhook,
);

app.use(express.json()); 

// ----- API Endpoints -----
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// ----- ERROR middleware -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isProduction = process.env.NODE_ENV === 'production';
  res
    .status(500)
    .json({ success: false, message: isProduction ? 'Internal server error' : (err.message || "Internal server error" )});
});

// ----- START the server -----
app.listen(port, () => console.log("Server started on PORT: " + port));
