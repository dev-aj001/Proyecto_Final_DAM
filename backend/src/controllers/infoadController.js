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
    const { id, id_almacen, id_infoAd } = req.params;

    // Validar los datos enviados en el cuerpo de la solicitud
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

    // Buscar el inventario por ID de negocio
    const inventory = await inventoryModel.findById(id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén específico dentro del negocio
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res.status(404).json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar el movimiento dentro del almacén
    const infoAd = almacen.info_ad.find(
      (info) => info._id.toString() === id_infoAd
    );

    if (!infoAd) {
      return res.status(404).json({ success: false, message: "Informacion no encontrado" });
    }

    // Actualizar los datos del movimiento con los valores proporcionados
    Object.assign(infoAd, value);

    // Guardar el inventario con el movimiento actualizado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Serie actualizado exitosamente",
      data: infoAd,
    });
  } catch (error) {
    if (error.name === "CastError") {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "ID inválido o no encontrado" });
    }

    // Manejar cualquier otro error
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function readOne(req, res) {
  try {
    const id = req.params.id;
    const id_almacen = req.params.idAlmacen;
    const id_infoAd = req.params.id_infoAd;
  
    const { almacenes } = await inventoryModel.findById(id);
  
    const almacen = almacenes.find((e)=> e._id == id_almacen );
    const info = almacen.info_ad.find((e)=> e._id == id_infoAd);
  
    res.status(200).json({ success: true, data: info });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Informacion no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  
  }}

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
          almacenNombre: almacen.id_almacen || null, // Si el almacén tiene un nombre
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
  try {
    const { id, id_almacen, id_infoAd } = req.params;

    // Buscar el inventario por ID de negocio
    const inventory = await inventoryModel.findById(id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén específico dentro del negocio
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res.status(404).json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar el movimiento dentro del almacén
    const index = almacen.info_ad.findIndex(
      (infoAd) => infoAd._id.toString() === id_infoAd
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Informacion no encontrada" });
    }

    // Eliminar el movimiento del arreglo de movimientos del almacén
    almacen.info_ad.splice(index, 1);

    // Guardar el inventario con el movimiento eliminado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Informacion eliminada exitosamente",
    });
  } catch (error) {
    if (error.name === "CastError") {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "ID inválido o no encontrado" });
    }

    // Manejar cualquier otro error
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne,
}