//const inventoryModel = require("../models/inventoryModel");
//const Validator = require("../validations/inventoryValidation");

const inventoryModel = require("../models/inventoryModel");
const Validator = require("../validations/inventoryValidation");

// Crear una nueva ubicación
async function createOne(req, res) {
  try {
    const { id, id_almacen, id_serie } = req.params; // ID de inventario, almacén y serie
    const nuevaUbicacion = req.body;

    const { error, value } = Validator.UbicacionSchemaJoi.validate(
      nuevaUbicacion,
      {
        abortEarly: false,
      }
    );

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
      return res
        .status(404)
        .json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén dentro del inventario
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res
        .status(404)
        .json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar la serie dentro del almacén
    const serie = almacen.series.find(
      (serie) => serie._id.toString() === id_serie
    );

    if (!serie) {
      return res
        .status(404)
        .json({ success: false, message: "Serie no encontrada" });
    }

    // Agregar la nueva ubicación al array de ubicaciones dentro de la serie
    serie.ubicaciones.push(nuevaUbicacion);

    // Guardar el inventario con la nueva ubicación
    await inventory.save();

    return res.status(201).json({
      success: true,
      message: "Ubicación agregada exitosamente",
      data: nuevaUbicacion,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "ID inválido o no encontrado" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function readAll(req, res) {
  try {
    const inventory = await inventoryModel.find();


    // Extraemos todas las series de todos los almacenes de todos los negocios
    const ubicaciones = inventory.flatMap((negocio) =>
      negocio.almacenes.flatMap((almacen) =>
        almacen.series.flatMap((serie) => 
          serie.ubicaciones.map((ubicacion) => ({
            negocioId: negocio._id,
            negocioNombre: negocio.nombre,
            almacenId: almacen._id,
            almacen: almacen.id_almacen,
            serieId: serie._id,
            nombre: serie.id_serie,
            idTipoStatusOK: ubicacion.idTipoStatusOK,
            ubicacion: ubicacion.ubicacion,
            actual: ubicacion.actual,
        }))
      ))
    );

    res.status(200).json({ success: true, data: ubicaciones });
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


// Actualizar una ubicación existente
async function updateOne(req, res) {
  try {
    const { id, id_almacen, id_serie, id_ubicacion } = req.params;

    const nuevaUbicacion = req.body;

    // Validar los datos enviados en el cuerpo de la solicitud
    const { error, value } = Validator.UbicacionSchemaJoi.validate(nuevaUbicacion, {
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
      return res
        .status(404)
        .json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén dentro del inventario
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res
        .status(404)
        .json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar la serie dentro del almacén
    const serie = almacen.series.find(
      (serie) => serie._id.toString() === id_serie
    );

    if (!serie) {
      return res
        .status(404)
        .json({ success: false, message: "Serie no encontrada" });
    }

    // Buscar la ubicación específica dentro de la serie
    const ubicacion = serie.ubicaciones.find(
      (ubicacion) => ubicacion._id.toString() === id_ubicacion
    );

    if (!ubicacion) {
      return res
        .status(404)
        .json({ success: false, message: "Ubicación no encontrada" });
    }

    // Actualizar los campos de la ubicación
    Object.assign(ubicacion, nuevaUbicacion);

    // Guardar el inventario con la ubicación actualizada
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Ubicación actualizada exitosamente",
      data: ubicacion,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "ID inválido o no encontrado" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

// Leer una ubicación específica
async function readOne(req, res) {
  try {
    const { id, id_almacen, id_serie, id_ubicacion } = req.params;
    // Buscar el inventario por ID de negocio
    const inventory = await inventoryModel.findById(id);

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén dentro del inventario
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res
        .status(404)
        .json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar la serie dentro del almacén
    const serie = almacen.series.find(
      (serie) => serie._id.toString() === id_serie
    );

    if (!serie) {
      return res
        .status(404)
        .json({ success: false, message: "Serie no encontrada" });
    }

    // Buscar la ubicación dentro de la serie
    const ubicacion = serie.ubicaciones.find(
      (ubicacion) => ubicacion._id.toString() === id_ubicacion);

    if (!ubicacion) {
      return res
        .status(404)
        .json({ success: false, message: "Ubicación no encontrada" });
    }


    return res.status(200).json({
      success: true,
      data: ubicacion,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "ID inválido o no encontrado" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

// Eliminar una ubicación
async function deleteOne(req, res) {
  try {
    const { id, id_almacen, id_serie, id_ubicacion } = req.params;
    // Buscar el inventario por ID de negocio
    const inventory = await inventoryModel.findById(id);

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Negocio no encontrado" });
    }

    // Buscar el almacén dentro del inventario
    const almacen = inventory.almacenes.find(
      (almacen) => almacen._id.toString() === id_almacen
    );

    if (!almacen) {
      return res
        .status(404)
        .json({ success: false, message: "Almacén no encontrado" });
    }

    // Buscar la serie dentro del almacén
    const serie = almacen.series.find(
      (serie) => serie._id.toString() === id_serie
    );

    if (!serie) {
      return res
        .status(404)
        .json({ success: false, message: "Serie no encontrada" });
    }

    // Buscar la ubicación dentro de la serie
    const index = serie.ubicaciones.findIndex(
      (ubicacion) => ubicacion._id.toString() === id_ubicacion);

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Ubicación no encontrada" });
    }

    // Eliminar la ubicación de la serie
    serie.ubicaciones.splice(index, 1);

    // Guardar el inventario con la ubicación eliminada
    await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Ubicación eliminada exitosamente",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "ID inválido o no encontrado" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  createOne,
  updateOne,
  readOne,
  readAll,
  deleteOne,
};
