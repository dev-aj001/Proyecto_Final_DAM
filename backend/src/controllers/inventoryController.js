const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");


async function createOne(req, res){
  const nuevoNegocio = new inventoryModel({
      nombre: req.body.nombre,
      direccion: {
          calle: req.body.direccion.calle || "",
          numero: req.body.direccion.numero || "",
          colonia: req.body.direccion.colonia || "",
          ciudad: req.body.direccion.ciudad || "",
          estado: req.body.direccion.estado || "",
          codigo_postal: req.body.direccion.codigo_postal || "",
      },
      contacto: {
          telefono: req.body.contacto.telefono || "",
          email: req.body.contacto.email || ""
      },
      almacenes: [],
      detail_row: {}
  });

  try {
      await nuevoNegocio.save();
      res.status(201).json({ success: false, message: nuevoNegocio});
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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
    res.status(200).json({ success: true, data:inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function readOne(req, res) {
  const idNegocio = req.params.id;
  try {
    const negocio = await inventoryModel.findById(idNegocio);
    if (!negocio) {
      return res.status(404).json({ success: false, message: "Negocio no encontrada" });
    }

    res.status(200).json({ success: true, data: negocio });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
async function deleteOne(req, res) {
  const IdNegocio = req.params.id;

  try {
    const deleteteNegocio = await inventoryModel.findByIdAndDelete(IdNegocio);

    if (!deleteteNegocio) {
      return res.status(404).json({success: false, message: "Negocio no encontrada o no autorizada para eliminar" });
    }

    res.status(200).json({ success: true, data: deleteteNegocio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateOne(req, res) {
  
  const inventoryId = req.params.id; // ID del instituto a actualizar

  // Validaciones
  if (!req.body.nombre && !req.body.direccion && !req.body.contacto) {
    return res.status(400).json({ success: false, message: "Debe proporcionar al menos un campo para actualizar: 'nombre', 'direccion' o 'contacto'." });
  }

  const filter = {
    _id: inventoryId, // Filtrar por ID del instituto
  };

  const update = {};

  // Actualizar los campos si estÃ¡n presentes en el cuerpo de la solicitud
  if (req.body.nombre !== undefined) {
    update.nombre = req.body.nombre;
  }

  if (req.body.direccion !== undefined) {
    update.direccion = req.body.direccion;
  }

  if (req.body.contacto !== undefined) {
    update.contacto = req.body.contacto;
  }

  try {
    const updatedInventory = await inventoryModel.findOneAndUpdate(filter, update, { new: true });

    if (!updatedInventory) {
      return res.status(404).json({ success: false, message: "Negocio no encontrado o no autorizado para actualizar" });
    }

    res.status(200).json({ success: true, data: updatedInventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createOne,
  readAll,
  readOne,
  deleteOne,
  updateOne,
};