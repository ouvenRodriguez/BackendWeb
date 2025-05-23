import config from "./src/utils/configServer.js";
import express from "express";
import cors from "cors";
import api from "./src/server/routes/index.js";
import logger from "./src/middleware/logger.js";
const app = express();
import "./src/utils/database.js";

app.use("/assets", express.static("assets"));
app.use(cors());
app.use(express.json());
app.use("/api", api);

import { sv } from "./src/utils/constans.js";

app.listen(config.port, (error) => {
  if (!error)
    logger
      .child(sv)
      .info(`Server running on ${config.env} port :${config.port}`);
  else logger.child(sv).fatal(error);
});
