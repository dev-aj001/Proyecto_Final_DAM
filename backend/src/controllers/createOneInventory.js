const inventoryModel = require('../models/inventaryModel');


const create = async (req, res) => {
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

module.exports = create;