const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");


async function createOne(req, res) {
  try {
    const { id, idAlmacen } = req.params; // ID del inventario y almacén
    const { error, value } = Validator.SerieSchemaJoi.validate(req.body, {
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
        $push: { "almacenes.$.series": value }, // Agregar la serie al almacén
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
      .json({ success: true, message: "Serie creada exitosamente", inventory });
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
    const { id, id_almacen, id_serie } = req.params;

    // Validar los datos enviados en el cuerpo de la solicitud
    const { error, value } = Validator.SerieSchemaJoi.validate(req.body, {
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
    const serie = almacen.series.find(
      (serie) => serie._id.toString() === id_serie
    );

    if (!serie) {
      return res.status(404).json({ success: false, message: "Serie no encontrado" });
    }

    // Actualizar los datos del movimiento con los valores proporcionados
    Object.assign(serie, value);

    // Guardar el inventario con el movimiento actualizado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Serie actualizado exitosamente",
      data: serie,
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
    const id_almacen = req.params.id_almacen;
    const id_serie = req.params.id_serie;
  
    console.log(id_almacen);
  
    const { almacenes } = await inventoryModel.findById(id);
  
    const almacen = almacenes.find((e)=> e._id == id_almacen );
    const serie = almacen.series.find((e)=> e._id == id_serie);
  
    res.status(200).json({ success: true, data: serie });
  } catch (error) {
    if (error.name === 'CastError') {
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    }
    // Cualquier otro error se maneja normalmente
    return res.status(400).json({ success: false, message: error.message });
  
  }}

async function readAll(req, res) {
  try {
    const inventory = await inventoryModel.find();

    // Extraemos todas las series de todos los almacenes de todos los negocios
    const series = inventory.flatMap((negocio) =>
      negocio.almacenes.flatMap((almacen) =>
        almacen.series.map((serie) => ({
          negocioId: negocio._id,
          negocioNombre: negocio.nombre,
          almacenId: almacen._id,
          almacen: almacen.id_almacen,
          serieId: serie._id,
          nombre: serie.id_serie,
          numeroSerie: serie.numero_serie,
          numeroPlaca: serie.numero_placa,
          observacion: serie.observacion,
        }))
      )
    );

    res.status(200).json({ success: true, data: series });
  } catch (error) {
    if (error.name === "CastError") {
      console.log(error);
      // Si el error es de tipo CastError, significa que el ID no es válido o no se encontró
      return res
        .status(404)
        .json({ success: false, message: "Inventarios no encontrados" });
    }
    // Cualquier otro error se maneja normalmente
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function deleteOne(req, res) {
  try {
    const { id, id_almacen, id_serie } = req.params;

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
    const index = almacen.series.findIndex(
      (serie) => serie._id.toString() === id_serie
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Serie no encontrada" });
    }

    // Eliminar el movimiento del arreglo de movimientos del almacén
    almacen.series.splice(index, 1);

    // Guardar el inventario con el movimiento eliminado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Serie eliminada exitosamente",
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