const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

mongoose
  .connect("mongodb://127.0.0.1:27017/baganet")
  .then(() => console.log("Connected to baganet database"))
  .catch((err) => console.log("Error connecting to database:", err));

app.use("/patients", projectRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
