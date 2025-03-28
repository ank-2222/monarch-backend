import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import moment from "moment";
import "dotenv/config";
import ErrorHandler from "./utils/errors.handler";
import { connectDB } from "./config/db.config";
import pino from "pino";
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      timeStampKey: "time",
    },
  },
});

// Initialize Express app
const app: Application = express();
const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

//---------------------------------------------------------------
// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://property-frontend-yrc7.onrender.com",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//---------------------------------------------------------------
// Routes
import propertyRoutes from "./routes/propertyRoute";
import adminRoutes from "./routes/adminRoute";
import blogRoute from "./routes/blogRoute";
import agentRoute from "./routes/agentRoute";
import s3Route from "./routes/s3Route";

app.use("/v1/property", propertyRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/blog", blogRoute);
app.use("/v1/agent", agentRoute);
app.use("/v1", s3Route);

//---------------------------------------------------------------
// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  const date = moment().format("YYYY-MM-DD HH:mm:ss");
  res.status(200).json({
    message: "Server is running",
    status_code: 200,
    entry_time: date,
  });
});

//---------------------------------------------------------------
// 404 - Route Not Found
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new ErrorHandler({
      message: "Route not found",
      message_code: "ROUTE_NOT_FOUND",
    })
  );
});

//-------------------------------------------------------------

// General Error Handler
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    if (err instanceof ErrorHandler) {
      res.status(err.status).json({
        message: err.message || "Internal Server Error",
        message_code: err.message_code || "INTERNAL_SERVER_ERROR",
      });
    }
    // Handle other errors

    const statusCode =
      err.message_code === "NO_TOKEN" ||
      err.message_code === "USER_NOT_FOUND" ||
      err.message_code === "TOKEN_FAILED"
        ? 401
        : 500;

    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      message_code: err.message_code || "INTERNAL_SERVER_ERROR",
    });
  }
);

//---------------------------------------------------------------
// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
