import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

jest.unstable_mockModule("../middlewares/authorization.js", () => ({
    default: (req, res, next) => next()
}))

const { default: testRouter } = await import("../routes/v1/testRouter.js");

const app = express();
app.use(express.json());
app.use("/api/test", testRouter);

describe("Test Router Logic", () => {
    test("GET /api/test - should return 200", async () => {
        const res = await request(app).get("/api/test");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    })
})