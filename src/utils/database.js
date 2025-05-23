import mongoose from "mongoose";
import config from "./configServer.js";


mongoose.connect(config.db.url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

export default mongoose;
