const Joi = require("joi");


// Esquema de validacion del modelo "DetailRowReg"
const DetailRowRegSchemaJoi = Joi.object({
    fechaReg: Joi.date().required(),
    usuarioReg: Joi.string(),
});

// Esquema de validacion del modelo "DetailRow"
const DetailRowSchemaJoi = Joi.object({
    activo: Joi.boolean(),
    borrado: Joi.boolean(),
    detail_row_reg: Joi.array().items(DetailRowRegSchemaJoi),
});

// Esquema de validacion del modelo "Movimiento"
const MovimientoSchemaJoi = Joi.object({
    id_movimiento: Joi.string().required(),
    tipo: Joi.string().required(),
    cantidadAnterior: Joi.number().required(),
    cantidadMovimiento: Joi.number().required(),
    cantidadActual: Joi.number().required(),
    referencia: Joi.string().required(),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "Estatus Venta Fisico" y "Estatus Venta"
const EstatusSchemaJoi = Joi.object({
    idTipoStatusOK: Joi.string().required(),
    actual: Joi.boolean().required(),
    observacion: Joi.string().required(),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "InfoAd"
const InfoAdSchemaJoi = Joi.object({
    idEtiquetaOK: Joi.string().required(),
    idEtiqueta: Joi.string().required(),
    etiqueta: Joi.string().required(),
    valor: Joi.number().required(),
    idTipoSeleccionOK: Joi.string().required(),
    secuencia: Joi.number().required(),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "Ubicacion"
const UbicacionSchemaJoi = Joi.object({
    idTipoStatusOK: Joi.string().required(),
    ubicacion: Joi.string().required(),
    actual: Joi.boolean().required(),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "Serie"
const SerieSchemaJoi = Joi.object({
    id_serie: Joi.string().required(),
    numero_serie: Joi.string().required(),
    numero_placa: Joi.string().required(),
    observacion: Joi.string(),
    estatus_fisico: Joi.array().items(EstatusSchemaJoi),
    estatus_venta: Joi.array().items(EstatusSchemaJoi),
    info_ad: Joi.array().items(InfoAdSchemaJoi),
    ubicaciones: Joi.array().items(UbicacionSchemaJoi),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "Almacen"
const AlmacenSchemaJoi = Joi.object({
    id_almacen: Joi.string().required(),
    principal: Joi.boolean().required(),
    cantidadActual: Joi.number().default(0),
    cantidadDisponible: Joi.number().default(0),
    cantidadApartada: Joi.number().default(0),
    cantidadMerma: Joi.number().default(0),
    stockMaximo: Joi.number().default(0),
    stockMinimo: Joi.number().default(0),
    info_ad: Joi.array().items(InfoAdSchemaJoi),
    movtos: Joi.array().items(MovimientoSchemaJoi),
    series: Joi.array().items(SerieSchemaJoi),
});

// Esquema de validacion del modelo "Almacen"
const AlmacenUpdateSchemaJoi = Joi.object({
    id_almacen: Joi.string(),
    principal: Joi.boolean(),
    cantidadActual: Joi.number().default(0),
    cantidadDisponible: Joi.number().default(0),
    cantidadApartada: Joi.number().default(0),
    cantidadMerma: Joi.number().default(0),
    stockMaximo: Joi.number().default(0),
    stockMinimo: Joi.number().default(0),
    info_ad: Joi.array().items(InfoAdSchemaJoi),
    movtos: Joi.array().items(MovimientoSchemaJoi),
    series: Joi.array().items(SerieSchemaJoi),
});

// Esquema de validacion del modelo "Negocio"
const NegocioSchemaJoi = Joi.object({
    nombre: Joi.string().required(),
    direccion: Joi.object({
        calle: Joi.string(),
        numero: Joi.string(),
        colonia: Joi.string(),
        ciudad: Joi.string(),
        estado: Joi.string(),
        codigo_postal: Joi.string().required(),
    }).required(),
    contacto: Joi.object({
        telefono: Joi.string(),
        email: Joi.string().email(),
    }),
    almacenes: Joi.array().items(AlmacenSchemaJoi),
    detail_row: DetailRowSchemaJoi,
});

// Esquema de validacion del modelo "Negocio" para actualizar
const NegocioUpdateSchemaJoi = Joi.object({
    nombre: Joi.string(),
    direccion: Joi.object({
        calle: Joi.string(),
        numero: Joi.string(),
        colonia: Joi.string(),
        ciudad: Joi.string(),
        estado: Joi.string(),
        codigo_postal: Joi.string(),
    }),
    contacto: Joi.object({
        telefono: Joi.string(),
        email: Joi.string().email(),
    }),
    almacenes: Joi.array().items(AlmacenSchemaJoi),
    detail_row: DetailRowSchemaJoi,
});

module.exports = 
{

    DetailRowRegSchemaJoi,
    DetailRowSchemaJoi,
    EstatusSchemaJoi,
    UbicacionSchemaJoi,
    InfoAdSchemaJoi,
    SerieSchemaJoi,
    MovimientoSchemaJoi,
    NegocioSchemaJoi,
    AlmacenSchemaJoi,

    AlmacenUpdateSchemaJoi,
    NegocioUpdateSchemaJoi
}