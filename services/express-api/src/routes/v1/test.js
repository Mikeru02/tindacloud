import { Router } from "express";

// Import controllers here!
import TestController from "../../controllers/v1/testController.js";

// Import middlewares here!

const testRouter = new Router();
const test = new TestController();

// Get Methods
testRouter.get("/", test.get.bind(test));

// Post Methods
testRouter.post("/", test.post.bind(test));

// Patch Methods

// Delete Methods

export default testRouter;
