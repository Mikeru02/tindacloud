import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import pool from "./config/database.js";

// Import version routes here!
import v1 from "./routes/v1/index.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Implement version routes here!
// e.g. app.use("/v1", v1);
app.use("/v1", v1);

app.listen(port, async () => {
  try {
    await pool.query("SELECT 1");
    
    console.log("PostgreSQL connected successfully");
    console.log(`API Server running on port ${port}`);
  } catch (error) {
    console.error("PostgreSQL connection failed");
    console.error(error);
    process.exit(1);
  }
});