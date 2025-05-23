import MProduct from "../models/MProduct.js";

export const createProduct = async (data) => {
  const { name, price, description, image, category, cantity, status } = data;

  try {
    const newMProduct = new MProduct({
      name,
      price,
      description,
      image,
      category,
      cantity,
      status,
    });

    await newMProduct.save();

    return {
      success: true,
      message: "Producto creado exitosamente",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear el MProducto",
    };
  }
};

export const getAllProducts = async () => {
  try {
    const products = await MProduct.find();
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al obtener los productos",
    };
  }
};

export const getProductById = async (id) => {
  try {
    const product = await MProduct.findById(id);
    if (!product) {
      return {
        success: false,
        error: "Producto no encontrado",
      };
    }
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al obtener el producto",
    };
  }
};

export const updateProduct = async (id  , updates) => {
  try {
    const updatedProduct = await MProduct.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProduct) {
      return {
        success: false,
        error: "Producto no encontrado",
      };
    }
    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al actualizar el producto",
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    const product = await MProduct.findById(id);
    if (!product) {
      return {
        success: false,
        error: "Producto no encontrado",
      };
    }
    product.status = 0; 
    await product.save();
    return {
      success: true,
      message: "Producto eliminado exitosamente",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error al eliminar el producto",
    };
  }
};
