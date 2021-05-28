import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import ProductRouter from "./routes/product.js";

import "./db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => res.send("hello world"));

app.use("/api/products", ProductRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running at http://127.0.0.1:${process.env.PORT}`)
);
