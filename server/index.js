import express from "express";      // load Express (builds the server)
import cors from "cors";            // load CORS (allows React to call the server)
import dotenv from "dotenv";        // load dotenv (reads the .env file)
import mongoose from "mongoose";    // load Mongoose (talks to MongoDB)

dotenv.config();                    // read .env, so process.env.MONGO_URI works
const app = express();              // create the server object
app.use(cors());                    // allow requests from other ports (React)
app.use(express.json());            // convert incoming JSON into req.body

mongoose
  .connect(process.env.MONGO_URI)   // connect to Atlas using the address in .env
  .then(() => console.log("MongoDB connected"))   // runs if the connection works
  .catch((err) => console.log(err));              // runs if it fails, prints the error

app.get("/api/hello", (req, res) => {             // when GET /api/hello arrives...
  res.json({ message: "Hello from the server" }); // ...reply with this JSON
});

app.listen(5000, () => console.log("Server running on port 5000")); // start the server on port 5000