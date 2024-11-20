const inventoryModel = require('../models/inventoryModel');


async function createOneInventory(req, res){
    const nuevoNegocio = new inventoryModel({
        nombre: req.body.nombre,
        direccion: {
            calle: req.body.calle || "",
            numero: req.body.numero || "",
            colonia: req.body.numero || "",
            ciudad: req.body.numero || "",
            estado: req.body.numero || "",
            codigo_postal: req.body.codigo_postal || "",
        },
        contacto: {
            telefono: req.body.telefono || "",
            email: req.body.email || ""
        },
        almacenes: [],
        detail_row: {}
    });
    try {
        console.log(nuevoNegocio);
        await nuevoNegocio.save();
        res.status(201).json(nuevoNegocio);
    } catch (error) {
        res.status(500).json({ message: "Error al guardar el negocio", error: error.message });
    }
}

async function getallInvetory(req, res) {
    try {
      const inventory = await inventoryModel.find();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la lista de negocios", error: error.message });
    }
  }
  
  async function getOneInvetory(req, res) {
    const idNegocio = req.params.id;
    try {
      const negocio = await inventoryModel.findById(idNegocio);
      if (!negocio) {
        return res.status(404).json({ message: "Negocio no encontrada " });
      }
  
      res.status(200).json(negocio);
      } catch (error) {
      res.status(500).json({ message: "Error al obtener a un negocios", error: error.message });
    }
  }
  async function deleteOneInvetory(req, res) {
    const IdNegocio = req.params.id;
   console.log(IdNegocio);
  
    try {
      const deleteteNegocio = await inventoryModel.findOneAndDelete(IdNegocio);
  
      if (!deleteteNegocio) {
        return res.status(404).json({ message: "Negocio no encontrada o no autorizada para eliminar" });
      }
  
      res.status(200).json({message:"Neogocio eliminado ",deleteteNegocio});
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar un negocio", error: error.message });
    }
  }

  async function updateInventory(req, res) {
    const username = req.user.username; // Usuario autenticado
    const inventoryId = req.params.id; // ID del instituto a actualizar
  
    // Validaciones
    if (!req.body.nombre && !req.body.direccion && !req.body.contacto) {
      return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar: 'nombre', 'direccion' o 'contacto'." });
    }
  
    const filter = {
      username, // Verificar que el instituto pertenece al usuario
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
        return res.status(404).json({ message: "Instituto no encontrado o no autorizado para actualizar" });
      }
  
      res.status(200).json(updatedInventory);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el instituto", error: error.message });
    }
  }


module.exports = {
    createOneInventory,
    getallInvetory,
    getOneInvetory,
    deleteOneInvetory,
    updateInventory
}