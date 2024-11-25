const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");

async function createOne(req, res) {
  try {
    req.body.detail_row.detail_row_reg = [getDetailRowReg()];

    const { error, value } = Validator.NegocioSchemaJoi.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `Validacion fallida: ${error.details
          .map((details) => details.message)
          .join(", ")}`
      );
    }

    const inventory = await inventoryModel.create(value);
    return res.status(200).json({ success: true, message: inventory });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function getDetailRowReg() {
  const user = 'UsusernameTest010101';
  const date = new Date();

  return {
    fechaReg: date,
    usuarioReg: user,
  }
}

async function readAll(req, res) {
  try {
    const inventory = await inventoryModel.find();
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function readOne(req, res) {
  try {
    const id = req.params.id;
    const negocio = await inventoryModel.findById(id);

    res.status(200).json({ success: true, data: negocio });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function deleteOne(req, res) {
  try {
    const id = req.params.id;
    const deleteteNegocio = await inventoryModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, data: deleteteNegocio });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function updateOne(req, res) {
  try {
    const id = req.params.id; // ID del instituto a actualizar

    const { error, value } = Validator.NegocioUpdateSchemaJoi.validate( req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `Validacion fallida: ${error.details
          .map((details) => details.message)
          .join(", ")}`
      );
    }

    const inventory = await inventoryModel.findByIdAndUpdate(id, 
      value,
      { new: true } // Retorna el documento actualizado
    );

    return res.status(200).json({ success: true, message: inventory});
    
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  createOne,
  readAll,
  readOne,
  deleteOne,
  updateOne,
};