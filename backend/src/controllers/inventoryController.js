const inventaryModel = require("../models/inventaryModel");

async function getallInvetory(req, res) {
  try {
    const inventary = await inventaryModel.find();
    res.status(200).json(inventary);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de negocios", error: error.message });
  }
}

async function getOneInvetory(req, res) {
  const idNegocio = req.params.id;
  try {
    const negocio = await inventaryModel.findById(idNegocio);
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
    const deleteteNegocio = await inventaryModel.findOneAndDelete(IdNegocio);

    if (!deleteteNegocio) {
      return res.status(404).json({ message: "Negocio no encontrada o no autorizada para eliminar" });
    }

    res.status(200).json({message:"Neogocio eliminado ",deleteteNegocio});
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar un negocio", error: error.message });
  }
}

module.exports = {
  getallInvetory,
  getOneInvetory,
  deleteOneInvetory,
}