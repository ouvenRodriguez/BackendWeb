import jwt from "jsonwebtoken";

import config from "../utils/configServer.js";
import logger from "./logger.js";
import { ctxToken } from "../utils/constans.js";

const Token = {
  async sign(email, role) {
    try {
      console.log("Token.sign - Input role:", role);
      const json = {
        email,
        role,
      };
      const expiration = {
        expiresIn: config.expiration,
      };

      const token = jwt.sign(json, config.token, expiration);
      console.log("Token.sign - Generated token payload:", json);
      
      return token;
    } catch (error) {
      console.log(error);
      logger.child(ctxToken).error("Error generating token: " + error.message);
    }
  },

  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        logger.child(ctxToken).error("No token provided");
        return res
          .status(200)
          .json({
            success: false,
            message: "No tienes permiso para realizar esta acción",
          });
      }

      console.log("Token.verifyToken - Verifying token:", token);
      jwt.verify(token, config.token, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            logger.child(ctxToken).error("Expired token: " + err.message);
            return res
              .status(200)
              .json({
                success: false,
                message: "El token ha expirado",
              });
          } else {
            logger
              .child(ctxToken)
              .error("Error verificando el token: " + err.message);
            return res
              .status(200)
              .json({
                success: false,
                message: "No tienes permiso para realizar esta acción",
              });
          }
        }

        req.email = decoded.email;
        req.role = decoded.role;
        console.log(decoded)
        logger.child(ctxToken).info("Token verificado exitosamente");
        next();
      });
    } catch (error) {
      console.log(error);
      logger
        .child(ctxToken)
        .error("Error verificando el token: " + error.message);
      return res
        .status(200)
        .json({
          success: false,
          message: "No tienes permiso para realizar esta acción",
        });
    }
  },

  // validar roles 
  validateRole(allowedRoles) {
    return (req, res, next) => {
      try {
        console.log(req.role)
        if (!req.role) {
          logger.child(ctxToken).error("No role found in request");
          return res
            .status(403)
            .json({ success: false, body: { error: "No tienes permiso para realizar esta acción" } });
        }

        if (!allowedRoles.includes(req.role)) {
          logger.child(ctxToken).error("Role not allowed: " + req.role);
          return res
            .status(403)
            .json({ success: false, body: { error: "No tienes permiso para realizar esta acción" } });
        }

        next();
      } catch (error) {
        console.log(error);
        logger.child(ctxToken).error("Error validating role: " + error.message);
        return res
          .status(500)
          .json({ success: false, body: { error: "Error interno del servidor" } });
      }
    };
  },  
  
};

export default Token;
