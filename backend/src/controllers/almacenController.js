const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");

async function createOne(req, res) {
  try {
    const id = req.params.id;
    const { error, value } = Validator.AlmacenSchemaJoi.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `Validacion fallida: ${error.details
          .map((details) => details.message)
          .join(", ")}`
      );
    }

    const inventory = await inventoryModel.findByIdAndUpdate(
      id,
      { $push: { almacenes: value } }, // $push agrega el valor sin sobrescribir
      { new: true } // Retorna el documento actualizado
    );

    return res.status(200).json({ success: true, message: inventory });
  } catch (error) {
    if (error.name === "CastError") {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res
        .status(404)
        .json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function updateOne(req, res) {
  try {
    const id = req.params.id;
    const idAlmacen = req.params.idAlmacen;
    const { error, value } = Validator.AlmacenUpdateSchemaJoi.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (error) {
      throw new Error(
        `Validacion fallida: ${error.details
          .map((details) => details.message)
          .join(", ")}`
      );
    }

    // value._id = idAlmacen;

    console.log(id, idAlmacen);

    const almacen = await inventoryModel.findOneAndUpdate(
      { _id: id, "almacenes": idAlmacen }, // Encuentra el documento y el elemento específico
      {
        $set: {
          "almacenes.$": value, // Actualiza solo el elemento coincidente
        },
      }
    );

    console.log(almacen);

    return res.status(200).json({ success: true, message: almacen });
  } catch (error) {
    if (error.name === "CastError") {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res
        .status(404)
        .json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function readOne(req, res) {}

async function readAll(req, res) {}

async function deleteOne(req, res) {}

module.exports = {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
};
