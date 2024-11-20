import { InventoriesModel } from "../models/InventoriesModel";
import {getDetailRow} from "./Utils"

// FIC: obtiene los valores capturados en la ventana modal
// enviados desde el evento onSubmit de Formik 
export const InventoriesValues = (values) => {
    let Inventory = InventoriesModel(); // Cambié el nombre del modelo a InventoryModel
    Inventory.nombre = values.nombre;
    Inventory.direccion = values.direccion;
    Inventory.telefono = values.contacto.telefono;
    Inventory.email = values.contacto.email;
    Inventory.almacenes = values.almacenes;
    Inventory.detail_row = getDetailRow(values.detail_row);
    return Inventory;
};


