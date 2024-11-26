const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");


async function createOne(req, res) {
  try {
    const { id, idAlmacen } = req.params; // ID del inventario y almacén
    const { error, value } = Validator.InfoAdSchemaJoi.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `Validación fallida: ${error.details
          .map((details) => details.message)
          .join(", ")}`
      );
    }
    console.log( id, idAlmacen);
    // Buscar el inventario por ID y el almacén específico por su ID
    const inventory = await inventoryModel.findOneAndUpdate(
      {
        _id: id,
        "almacenes._id": idAlmacen, // Validar que el almacén existe
      },
      {
        $push: { "almacenes.$.info_ad": value }, // Agregar la serie al almacén
      },
      { new: true } // Retorna el documento actualizado
    );

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventario o almacén no encontrado" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Movimiento creada exitosamente", inventory });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Inventario o almacén no encontrado" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function updateOne(req, res) {
    try {
      const id = req.params.id;
      const { error, value } = Validator.AlmacenUpdateSchemaJoi.validate( req.body, {
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
        { $push: { almacenes: value } },  // $push agrega el valor sin sobrescribir
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

async function readOne(req, res) {
    
}

async function readAll(req, res) {
  try {
    const inventory = await inventoryModel.find();

    // Extraemos todos los movimientos con los IDs de negocio, almacén y movimiento
    const infoAds = inventory.flatMap((negocio) =>
      negocio.almacenes.flatMap((almacen) =>
        almacen.info_ad.map((info) => ({
          negocioId: negocio._id,
          negocioNombre: negocio.nombre,
          almacenId: almacen._id,
          almacenNombre: almacen.nombre || null, // Si el almacén tiene un nombre
          infoAdId: info._id,
          idEtiquetaOK: info.idEtiquetaOK,
          idEtiqueta: info.idEtiqueta,
          etiqueta: info.etiqueta,
          valor: info.valor,
          idTipoSeleccionOK: info.idTipoSeleccionOK,
          secuencia: info.secuencia,
          detail_row: info.detail_row,
        }))
      )
    );

    res.status(200).json({ success: true, data: infoAds });
  } catch (error) {
    if (error.name === "CastError") {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res
        .status(404)
        .json({ success: false, message: "Inventarios no encontrados" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function deleteOne(req, res) {
    
}

module.exports = {
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne,
}