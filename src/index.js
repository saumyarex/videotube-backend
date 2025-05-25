import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(`Server error : ${err}`);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB error : ", error);
  });
