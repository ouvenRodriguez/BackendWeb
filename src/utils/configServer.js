import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const config = {
  env: process.env.ENVIRONMENT,
  port: process.env.PORT,
  token: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION_TIME,
  salt: process.env.KEY_SALT,
  assets: process.env.ASSETS_PATH,

  db: {
    url: process.env.CONFIG_DB_URL,
  },
};

export default config;
