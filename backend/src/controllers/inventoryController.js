const inventaryModel = require("../models/inventaryModel");

async function deleteOneInvetory(req, res) {
  const IdNegocio = req.params.id;

  const filter = {_id: IdNegocio};

  try {
    const deleteteNegocio = await inventaryModel.findOneAndDelete(filter);

    if (!deleteteNegocio) {
      return res.status(404).json({ message: "Negocio no encontrada o no autorizada para eliminar" });
    }

    res.status(200).json({message:"Negociacion ",deleteteNegocio});
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar un negocio", error: error.message });
  }
}

module.exports = {
  deleteOneInvetory,
}