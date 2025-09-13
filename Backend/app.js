import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/customers", customerRoutes);

app.get("/", (req,res)=> res.send("Xeno CRM Backend Running"));

export default app;
