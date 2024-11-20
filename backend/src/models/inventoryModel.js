const mongoose = require("mongoose");

const EstatusSchema = new mongoose.Schema({
    estado: { type: String, required: true },
    fecha: { type: Date, required: true },
  });
  
  const InfoAdSchema = new mongoose.Schema({
    clave: { type: String },
    descripcion: { type: String },
    marca: { type: String },
    modelo: { type: String },
    anio: { type: Number },
  });
  
  const UbicacionSchema = new mongoose.Schema({
    pasillo: { type: Number },
    estante: { type: String },
  });
  
  const DetailRowSchema = new mongoose.Schema({
    descripcion: { type: String },
    costo: { type: Number },
    precio_venta: { type: Number },
    categoria: { type: String },
    tipo_negocio: { type: String },
    num_empleados: { type: Number },
    ingresos_anuales: { type: Number },
  });
  
  const SerieSchema = new mongoose.Schema({
    id_serie: { type: String, required: true },
    numero_serie: { type: String, required: true },
    estatus_fisico: [EstatusSchema],
    estatus_venta: [EstatusSchema],
    info_ad: [InfoAdSchema],
    ubicaciones: [UbicacionSchema],
    detail_row: DetailRowSchema,
  });
  
  const MovimientoSchema = new mongoose.Schema({
    id_movimiento: { type: String, required: true },
    tipo: { type: String, required: true },
    fecha: { type: Date, required: true },
    cantidad: { type: Number, required: true },
  });
  
  const AlmacenSchema = new mongoose.Schema({
    id_almacen: { type: String, required: true },
    nombre: { type: String, required: true },
    ubicacion: {
      latitud: { type: Number, required: true },
      longitud: { type: Number, required: true },
    },
    info_ad: [InfoAdSchema],
    movtos: [MovimientoSchema],
    series: [SerieSchema],
  });
  
  const NegocioSchema = new mongoose.Schema({
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
  });
  
  const Inventario = mongoose.model("Inventario", NegocioSchema);

  module.exports = Inventario;