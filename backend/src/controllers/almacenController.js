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




async function readOne(req, res) {
try {
  const id = req.params.id;
  const id_almacen = req.params.id_almacen;

  console.log(id_almacen);

  const { almacenes } = await inventoryModel.findById(id);

  const almacen = almacenes.find((e)=> e._id == id_almacen );

  console.log(almacen, almacenes);
  
  res.status(200).json({ success: true, data: almacen });
} catch (error) {
  if (error.name === 'CastError') {
    // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
    return res.status(404).json({ success: false, message: "Inventario no encontrado" });
  }
  // Cualquier otro error se maneja normalmente
  return res.status(400).json({ success: false, message: error.message });

}}

async function readAllbyId(req, res) {

  try {
    const { almacenes} = await inventoryModel.findById(req.params.id);
    res.status(200).json({ success: true, data: almacenes });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
}}

async function readAll(req, res) {
  try {
    const inventory = await inventoryModel.find();

    // Extraemos únicamente los IDs en formato de objeto
    const almacenes = inventory.flatMap((negocio) => 
      negocio.almacenes.map((almacen) => ({
        id: negocio._id,
       nombre: negocio.nombre,
        almacen: almacen}))
    );

    res.status(200).json({ success: true, data: almacenes });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventarios no encontrados" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function deleteOne(req, res) {
  try {
    const id = req.params.id; // ID del inventario
    const idAlmacen = req.params.idAlmacen; // ID del almacén a eliminar

    // Encuentra el documento y elimina el almacén específico
    const resultado = await inventoryModel.findOneAndUpdate(
      { _id: id }, // Busca el documento por ID
      { $pull: { almacenes: { _id: idAlmacen } } }, // Elimina el almacén con el ID especificado
      { new: true } // Retorna el documento actualizado
    );

    if (!resultado) {
      return res
        .status(404)
        .json({ success: false, message: "Inventario o almacén no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Almacén eliminado", data: resultado });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "ID de inventario no válido" });
    }

    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }} 

async function updateOne(req, res) {
  try {
    const id = req.params.id;
    const idAlmacen = req.params.id_almacen;
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

     value._id = idAlmacen;

    console.log("ID del inventario:", id, idAlmacen);

    const almacen = await inventoryModel.findOneAndUpdate(
      { _id: id, "almacenes._id": idAlmacen }, // Encuentra el documento y el elemento específico
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

module.exports = {
  createOne,
  readOne,
  readAllbyId,
  updateOne,
  deleteOne,
  readAll
};
