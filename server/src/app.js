import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import "dotenv/config";

import v1 from "./routes/v1/index.js";

const app = express();

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/v1", cors(), v1);

export default app;