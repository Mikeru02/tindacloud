import { Router } from "express";

// TODO: Add routers here
import testRouter from "./testRouter.js";

const v1 = new Router();

// TODO: Implement the routes here
v1.use("/test", testRouter);

export default v1;
