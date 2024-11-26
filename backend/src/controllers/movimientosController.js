const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");


async function createOne(req, res) {
  try {
    const { id, idAlmacen } = req.params; // ID del inventario y almacén
    const { error, value } = Validator.MovimientoSchemaJoi.validate(req.body, {
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
        $push: { "almacenes.$.movtos": value }, // Agregar la serie al almacén
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
    const { id, id_almacen, id_movto } = req.params;

    // Validar los datos enviados en el cuerpo de la solicitud
    const { error, value } = Validator.MovimientoSchemaJoi.validate(req.body, {
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
    const movto = almacen.movtos.find(
      (movto) => movto._id.toString() === id_movto
    );

    if (!movto) {
      return res.status(404).json({ success: false, message: "Movimiento no encontrado" });
    }

    // Actualizar los datos del movimiento con los valores proporcionados
    Object.assign(movto, value);

    // Guardar el inventario con el movimiento actualizado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Movimiento actualizado exitosamente",
      data: movto,
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
    const id_serie = req.params.id_movto;
  
    console.log(id_almacen);
  
    const { almacenes } = await inventoryModel.findById(id);
  
    const almacen = almacenes.find((e)=> e._id == id_almacen );
    const serie = almacen.movtos.find((e)=> e._id == id_serie);
  
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

    // Extraemos todos los movimientos con los IDs de negocio, almacén y movimiento
    const movtos = inventory.flatMap((negocio) =>
      negocio.almacenes.flatMap((almacen) =>
        almacen.movtos.map((movimiento) => ({
          negocioId: negocio._id,
          negocioNombre: negocio.nombre,
          almacenId: almacen._id,
          almacenNombre: almacen.nombre || null, // Si el almacén tiene un nombre
          movimientoId: movimiento._id,
          tipo: movimiento.tipo,
          cantidadAnterior: movimiento.cantidadAnterior,
          cantidadMovimiento: movimiento.cantidadMovimiento,
          cantidadActual: movimiento.cantidadActual,
          referencia: movimiento.referencia,
          detail_row: movimiento.detail_row,
        }))
      )
    );

    res.status(200).json({ success: true, data: movtos });
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
    const { id, id_almacen, id_movto } = req.params;

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
    const movtoIndex = almacen.movtos.findIndex(
      (movto) => movto._id.toString() === id_movto
    );

    if (movtoIndex === -1) {
      return res.status(404).json({ success: false, message: "Movimiento no encontrado" });
    }

    // Eliminar el movimiento del arreglo de movimientos del almacén
    almacen.movtos.splice(movtoIndex, 1);

    // Guardar el inventario con el movimiento eliminado
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Movimiento eliminado exitosamente",
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