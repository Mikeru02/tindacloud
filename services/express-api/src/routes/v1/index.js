import { Router } from "express";

// Import all v1 routes here
import testRouter from "./test.js";

const v1 = Router();

// Mount routes
v1.use("/test", testRouter);

export default v1;