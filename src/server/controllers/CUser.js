import Validations from "../../utils/validations.js";
import MUser from "../models/MUser.js";
import logger from "../../middleware/logger.js";
import { apiUser } from "../../utils/constans.js";
import Crypto from "../../middleware/crypto.js";
import Token from "../../middleware/token.js";

export const registerUser = async (data) => {
  const ctx = { ctx: apiUser + "[/register] [CONTROLLER] [registerUser]" };
  try {
    if (!Validations.forEmail(data.email)) {
      logger.child(ctx).error("Invalid email");
      return {
        success: false,
        body: {
          error: "El correo electrónico es inválido",
        },
      };
    }

    const user = await MUser.findOne({ email: data.email });

    if (user) {
      logger.child(ctx).error("User not found");
      return {
        success: false,
        body: {
          error: "Este correo electrónico ya se encuentra registrado",
        },
      };
    }

    const encryptionResult = await Crypto.encrypt(data.pass);

    if (!encryptionResult.success) {
      logger.child(ctx).error(encryptionResult.message);
      return {
        success: false,
        body: {
          error: "Error al intentar registrar el usuario",
        },
      };
    }

    const newUser = await MUser.create({
      email: data.email,
      pass: encryptionResult.hash,
      name: data.name,
      lastName: data.lastName,
    });

    const token = await Token.sign(newUser.email, newUser.role);

    return {
      success: true,
      body: { data: token, message: "Usuario registrado" },
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: { error: "Error al intentar registrar el usuario" },
    };
  }
};

export const loginUser = async (data) => {
  const ctx = { ctx: apiUser + "[/login] [CONTROLLER] [loginUser]" };
  try {
    const user = await MUser.findOne({ email: data.email });

    if (!user) {
      logger.child(ctx).error("User not found");
      return {
        success: false,
        body: {
          error: "El usuario no existe, por favor regístrate",
        },
      };
    }

    const encryptionResult = await Crypto.verify(data.pass, user.pass);

    if (!encryptionResult) {
      logger.child(ctx).error("Invalid password");
      return {
        success: false,
        body: {
          error:
            "Las credenciales son incorrectas, por favor ingresa las credenciales correspondientes",
        },
      };
    }
    const token = await Token.sign(user.email, user.role);

    return {
      success: true,
      body: { data: { token, role: user.role }, message: "Inicio de sesión exitoso" },
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: {
        error: "Error al intentar iniciar sesión, por favor intente nuevamente",
      },
    };
  }
};

export const infoUser = async (data) => {
  const ctx = { ctx: apiUser + "[/info] [CONTROLLER] [infoUser]" };
  try {
    const user = await MUser.findOne({ email: data.email }).select(
      "-pass -__v -_id"
    );
    return { success: true, body: { data: user, message: "Usuario obtenido" } };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return { success: false, body: { error: "Error al obtener el usuario" } };
  }
};

export const createUserWithRole = async (data, role) => {
  const ctx = { ctx: apiUser + "[/create-user] [CONTROLLER] [createUserWithRole]" };
  try {
    if (!Validations.forEmail(data.email)) {
      logger.child(ctx).error("Invalid email");
      return {
        success: false,
        body: {
          error: "El correo electrónico es inválido",
        },
      };
    }

    const user = await MUser.findOne({ email: data.email });

    if (user) {
      logger.child(ctx).error("User already exists");
      return {
        success: false,
        body: {
          error: "Este correo electrónico ya se encuentra registrado",
        },
      };
    }

    const encryptionResult = await Crypto.encrypt(data.pass);

    if (!encryptionResult.success) {
      logger.child(ctx).error(encryptionResult.message);
      return {
        success: false,
        body: {
          error: "Error al intentar crear el usuario",
        },
      };
    }

    const newUser = await MUser.create({
      email: data.email,
      pass: encryptionResult.hash,
      name: data.name,
      lastName: data.lastName,
      role: role
    });

    return {
      success: true,
      body: {
        data: {
          email: newUser.email,
          name: newUser.name,
          lastName: newUser.lastName,
          role: newUser.role
        },
        message: `Usuario ${role} creado exitosamente`
      },
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: { error: "Error al intentar crear el usuario" },
    };
  }
};

export const getAllUserWithRole = async (role) => {
  const ctx = { ctx: apiUser + "[/all/users] [CONTROLLER] [getAllUserWithRole]" };
  try {
    const users = await MUser.find({ role });

    return {
      success: true,
      body: {
        data: users,
        message: "Usuarios obtenidos"
      }
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: {
        error: "Error al obtener los usuarios"
      }
    };
  }
}

export const updateUser = async (userId, data) => {
  const ctx = { ctx: apiUser + "[/update-user] [CONTROLLER] [updateUser]" };
  try {
    const user = await MUser.findById(userId);

    if (!user) {
      logger.child(ctx).error("User not found");
      return {
        success: false,
        body: {
          error: "Usuario no encontrado"
        }
      };
    }

    if (data.email && data.email !== user.email) {
      if (!Validations.forEmail(data.email)) {
        logger.child(ctx).error("Invalid email");
        return {
          success: false,
          body: {
            error: "El correo electrónico es inválido"
          }
        };
      }

      const existingUser = await MUser.findOne({ email: data.email });
      if (existingUser) {
        logger.child(ctx).error("Email already exists");
        return {
          success: false,
          body: {
            error: "Este correo electrónico ya está registrado"
          }
        };
      }
    }

    if (data.pass) {
      const encryptionResult = await Crypto.encrypt(data.pass);
      if (!encryptionResult.success) {
        logger.child(ctx).error(encryptionResult.message);
        return {
          success: false,
          body: {
            error: "Error al actualizar la contraseña"
          }
        };
      }
      data.pass = encryptionResult.hash;
    }

    const updatedUser = await MUser.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).select("-pass -__v");

    return {
      success: true,
      body: {
        data: updatedUser,
        message: "Usuario actualizado exitosamente"
      }
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: {
        error: "Error al actualizar el usuario"
      }
    };
  }
};

export const deleteUser = async (userId) => {
  const ctx = { ctx: apiUser + "[/delete-user] [CONTROLLER] [deleteUser]" };
  try {
    const user = await MUser.findById(userId);

    if (!user) {
      logger.child(ctx).error("User not found");
      return {
        success: false,
        body: {
          error: "Usuario no encontrado"
        }
      };
    }

    await MUser.findByIdAndDelete(userId);

    return {
      success: true,
      body: {
        message: "Usuario eliminado exitosamente"
      }
    };
  } catch (error) {
    console.log(error);
    logger.child(ctx).error(error);
    return {
      success: false,
      body: {
        error: "Error al eliminar el usuario"
      }
    };
  }
}; 
