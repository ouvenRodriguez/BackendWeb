import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFormat = format.combine(
  format.timestamp({ format: "DD.MM.YYYY HH:mm:ss a" }),
  format.prettyPrint(),
  format.printf(
    (content) =>
      `[${content.timestamp}] - [${content.level.toUpperCase()}] ${
        content.ctx
      } - ${content.message}`
  )
);

const logger = createLogger({
  format: logFormat,
  service: "process",
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../logs", "error.log"),
      level: "error",
    }),
  ],
});

export default logger;
