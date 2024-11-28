import { getDetailRow } from "../helpers/Utils";

export function InventoriesModel() {
    let Inventories = {
        nombre: { type: String, required: true },
        direccion: {
          calle: { type: String, required: true },
          numero: { type: String, required: true },
          colonia: { type: String, required: true },
          ciudad: { type: String, required: true },
          estado: { type: String, required: true },
          codigo_postal: { type: String, required: true },
        },
        contacto: {
          telefono: { type: String },
          email: { type: String },
        },
        almacenes: [AlmacenSchema],
        detail_row: DetailRowSchema,

    };

    // console.log(Inventories);

    return Inventories;
};

