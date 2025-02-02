import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import createHtttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import mealKitRoutes from "./routes/mealKit";
import mealPlanRoutes from "./routes/mealPlan";
import env from "./utils/validateEnv";
import { requireAuth } from "./middleware/requireAuth";



const app = express();

// enabling cors for all routes
app.use(cors());

// Content-Type: application/json handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// using morgan to log http requests into the console
if (env.ENVIRONMENT === 'development') {
    app.use(morgan("dev"));
}

// mealkit endpoint
app.use("/api/v1/mealKit", mealKitRoutes);

// meal plan endpoint
app.use("/api/v1/mealPlan", requireAuth, mealPlanRoutes);


// middleware to handle an endpoint not found
app.use((req, res, next) => {
    next(createHtttpError(404, "Endpoint not found"));
});

// middleware to handle errors
app.use((error: unknown, req: Request, res: Response) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });

});

export default app;