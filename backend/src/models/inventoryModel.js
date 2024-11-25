const mongoose = require("mongoose");

const DetailRowRegSchema = new mongoose.Schema({
  fechaReg: { type: Date, required: true },
  usuarioReg: { type: String },
},
{ _id: false }
);

const DetailRowSchema = new mongoose.Schema({
  activo: { type: Boolean },
  borrado: { type: Boolean },
  detail_row_reg: [DetailRowRegSchema],
},
{ _id: false }
);

const EstatusVentaSchema = new mongoose.Schema({
  idTipoStatusOK: { type: String, required: true },
  actual: { type: Boolean, required: true },
  observacion: { type: String, required: true },
  detail_row: DetailRowSchema,
});

const EstatusFisicoSchema = new mongoose.Schema({
  idTipoStatusOK: { type: String, required: true },
  actual: { type: Boolean, required: true },
  observacion: { type: String, required: true },
  detail_row: DetailRowSchema,
});

const UbicacionSchema = new mongoose.Schema({
  idTipoStatusOK: { type: String, required: true },
  ubicacion: { type: String, required: true },
  actual: { type: Boolean, required: true },
  detail_row: DetailRowSchema,
});

const InfoAdSchema = new mongoose.Schema({
  idEtiquetaOK: { type: String, required: true },
  idEtiqueta: { type: String, required: true },
  etiqueta: { type: String, required: true },
  valor: { type: Number, required: true },
  idTipoSeleccionOK: { type: String, required: true },
  secuencia: { type: Number, required: true },
  detail_row: DetailRowSchema,
});

const SerieSchema = new mongoose.Schema({
  id_serie: { type: String, required: true },
  numero_serie: { type: String, required: true },
  numero_placa: { type: String, required: true },
  observacion: { type: String },
  estatus_fisico: [EstatusFisicoSchema],
  estatus_venta: [EstatusVentaSchema],
  info_ad: [InfoAdSchema],
  ubicaciones: [UbicacionSchema],
  detail_row: DetailRowSchema,
});

const MovimientoSchema = new mongoose.Schema({
  id_movimiento: { type: String, required: true },
  tipo: { type: String, required: true },
  cantidadAnterior: { type: Number, required: true },
  cantidadMovimiento: { type: Number, required: true },
  cantidadActual: { type: Number, required: true },
  referencia: { type: String, required: true },
  detail_row: DetailRowSchema,
});

const AlmacenSchema = new mongoose.Schema({
  id_almacen: { type: String, required: true },
  principal: { type: Boolean, required: true },
  cantidadActual: { type: Number, default: 0 },
  cantidadDisponible: { type: Number, default: 0 },
  cantidadApartada: { type: Number, default: 0 },
  cantidadMerma: { type: Number, default: 0 },
  stockMaximo: { type: Number, default: 0 },
  stockMinimo: { type: Number, default: 0 },
  info_ad: [InfoAdSchema],
  movtos: [MovimientoSchema],
  series: [SerieSchema],
});

const NegocioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: {
    calle: { type: String },
    numero: { type: String },
    colonia: { type: String },
    ciudad: { type: String },
    estado: { type: String },
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