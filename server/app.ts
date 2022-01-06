import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import morgan from "morgan";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1", userRouter);

app.listen(PORT, () =>
	console.log(`App Running on http://localhost:${PORT} ⚡`)
);
