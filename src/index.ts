import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import ErrorHandler from "./utils/errors.handler";
const app: Application = express();
const port = process.env.PORT || 5000;
import moment from "moment";
import { connectDB } from "./config/db.config";

app.use(
  cors({
    origin: ["http://localhost:5173","https://property-frontend-yrc7.onrender.com","http://localhost:5174"],
    credentials: true,
  })
);

connectDB();

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//---------------------------------------------------------------
//Routes
import propertyRoutes from "./routes/propertyRoute";
import adminRoutes from "./routes/adminRoute";
import blogRoute from "./routes/blogRoute";
import s3Route from "./routes/s3Route";
app.use("/v1/property", propertyRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/blog", blogRoute);
app.use("/v1", s3Route);

//---------------------------------------------------------------

app.get("/health", (req: Request, res: Response) => {
  const date = moment().format("YYYY-MM-DD HH:mm:ss");
  res.status(200).send({
    message: "Server is running",
    status_code: 200,
    entry_time: date,
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new ErrorHandler({
      message: "Route not found",
      message_code: "ROUTE_NOT_FOUND",
    })
  );
});

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const { message, message_code } = err;
    res.status(500).json({
      error: {
        message: message || "Internal Server Error",
        message_code: message_code || "INTERNAL_SERVER_ERROR",
      },
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
