import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectMongo from "./database/connectionMongo.js";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRoutes);

try {
	await connectMongo();
	console.log("Connected to MongoDB successfully");
} catch (error) {
	console.error("Failed to connect to MongoDB:", error);
	process.exit(1);
}

app.listen(process.env.PORT || 3000);
