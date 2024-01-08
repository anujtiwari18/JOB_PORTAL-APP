//import
//const express = require("express");
// pakages import
import express from "express";
//Api Document
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';



import "express-async-errors";
import dotenv from 'dotenv'
import colors from "colors"
import cors from 'cors'
import morgan from 'morgan'
import testRoutes from './routes/testRoutes.js';
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import errorMiddelware from "./middelwares/errorMiddleware.js";
import userRoute from './routes/userRoutes.js';
import jobRoute from './routes/jobRoutes.js';
//dot env config
dotenv.config();
// security package
import helmet from 'helmet';
import xss from "xss-clean";
import mongoSanitize from 'express-mongo-sanitize';
//connection mongodb
connectDB();
//  swagger api config

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: 'job portal Application',
      description: 'Node Expressjs job Portal Application'
    },
    servers: [
      {
        url: "http;//localhost:8080"
      }
    ]

  },
  apis: ['./routes/*.js']
}

//use api
const spec = swaggerDoc(option);
// rest object
const app = express();
// middelwares
app.use(helmet());
app.use(xss(''));
app.use(mongoSanitize());
app.use(express.json());
app.use(cors())
app.use(morgan("dev"));
//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);



// validation middelware
app.use(errorMiddelware);

//app.get("/", (req, res) => {
//  res.send("<h1> welcome to job portal This is server</h1>");
//});
const PORT = process.env.PORT || 8080
//listen
app.listen(PORT, () => {
  console.log(`Node server Running in ${process.env.DEV_MODE} MODE on port no ${PORT}`.bgCyan.white);
});
