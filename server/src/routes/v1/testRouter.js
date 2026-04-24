import { Router } from "express";
import TestController from "../../controllers/v1/testController.js";
import authorization from "../../middlewares/authorization.js";

const testRouter = new Router();
const test = new TestController();

testRouter.use(authorization);

testRouter.get("/", test.get.bind(test));

testRouter.post("/", test.create.bind(test));



// // Get Methods
// testRouter.get("/", (req, res) => {
//     return res.status(200).json({
//         success: true,
//         message: "Hello from API"
//     })
// })

// // Post Methods
// testRouter.post("/", (req, res) => {
//     if (!req.body){
//         return res.status(400).json({
//             success: false,
//             message: "Payload is required"
//         })
//     }
//     return res.status(200).json({
//         success: true,
//         payload: req.body
//     })
// })

// // Patch Methods
// testRouter.patch("/", (req, res) => {
//     if (!req.query.id) {
//         return res.status(400).json({
//             success: false,
//             message: "ID is required in the query"
//         })
//     }

//     if (!req.body) {
//         return res.status(400).json({
//             success: false,
//             message: "Payload is required"
//         })
//     }

//     return res.status(200).json({
//         success: true,
//         message: `Resource ${req.query.id} updated`,
//         payload: req.body
//     })
// })

// // Delete Methods
// testRouter.delete("/", (req, res) => {
//     if (!req.query.id) {
//         return res.status(400).json({
//             success: false,
//             message: "ID is required in the query"
//         })
//     }

//     if (!req.body) {
//         return res.status(400).json({
//             success: false,
//             message: "Payload is required"
//         })
//     }

//     return res.status(200).json({
//         success: true,
//         message: `Resource ${req.query.id} deleted`,
//         payload: req.body
//     })
// })

export default testRouter;