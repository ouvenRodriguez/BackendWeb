import bcrypt from "bcrypt";
import config from "../utils/configServer.js";
import Validations from "../utils/validations.js";
import logger from "../middleware/logger.js";
const Crypto = {
  async encrypt(password) {
    try {
      if (!password) {
        return { success: false, message: "No contiene contraseña" };
      }

      if (!Validations.forPassword(password)) {
        return {
          success: false,
          message:
            "La contraseña es inválida. Debe contener al menos una letra y un número, y tener al menos 8 caracteres",
        };
      }

      const salt = await bcrypt.genSalt(parseInt(config.salt));
      const hash = await bcrypt.hash(password, salt);
      return { success: true, hash };
    } catch (error) {
      logger.error(error.message);
      return { success: false, message: error.message };
    }
  },

  async verify(password, hash) {
    return await bcrypt.compare(password, hash);
  },
};

export default Crypto;