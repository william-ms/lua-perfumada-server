import "dotenv/config";
import express from "express";
import connection from "./database/connection.js";

import cors from "cors";

import apiRoutes from "./routes/api.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", apiRoutes);

app.listen(process.env.PORT);

await connection();
