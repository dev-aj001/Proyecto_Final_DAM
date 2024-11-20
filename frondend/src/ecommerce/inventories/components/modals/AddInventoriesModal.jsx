import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, TextField,
    DialogActions, Alert, Box, FormControlLabel, Checkbox
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { AddOneInventory } from "../services/remote/post/AddOneInventories";

const AddInventoryModal = ({ showAddModal, setShowAddModal, onInventoryAdded, fetchData }) => {
    // Estados para manejar mensajes de error, éxito y estado de carga
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    // Configuración de formulario utilizando Formik
    const formik = useFormik({
        // Valores iniciales del formulario
        initialValues: {
            nombre: "", // Nombre del inventario
            direccion: { // Dirección del inventario
                calle: "",
                numero: "",
                colonia: "",
                ciudad: "",
                estado: "",
                codigo_postal: "",
            },
            contacto: { // Información de contacto
                telefono: "",
                email: "",
            },
            Activo: false, // Estado del inventario (activo/inactivo)
            Borrado: false, // Indicador de borrado
        },
        // Validación del formulario usando Yup
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"), // Valida que el nombre esté presente
            direccion: Yup.object().shape({ // Valida los campos dentro de dirección
                calle: Yup.string().required("La calle es obligatoria"),
                numero: Yup.string().required("El número es obligatorio"),
                colonia: Yup.string().required("La colonia es obligatoria"),
                ciudad: Yup.string().required("La ciudad es obligatoria"),
                estado: Yup.string().required("El estado es obligatorio"),
                codigo_postal: Yup.string().required("El código postal es obligatorio"),
            }),
            contacto: Yup.object().shape({ // Valida los campos dentro de contacto
                telefono: Yup.string(),
                email: Yup.string().email("Correo inválido"), // Valida el formato del correo electrónico
            }),
        }),
        // Lógica que se ejecuta cuando el formulario es enviado
        onSubmit: async (values) => {
            setMensajeErrorAlert(null); // Limpia mensajes de error previos
            setMensajeExitoAlert(null); // Limpia mensajes de éxito previos
            setLoading(true); // Indica que la operación está en curso
            try {
                // Envía los datos al servidor
                const response = await AddOneInventory(values);
                // Verifica si la respuesta del servidor fue exitosa
                if (response && ![200, 201].includes(response.status)) {
                    throw new Error(response.data?.message || "Error al crear inventario");
                }

                // Mensaje de éxito
                setMensajeExitoAlert("Inventario creado correctamente");

                // Actualiza los datos del inventario
                fetchData();

                // Reinicia los valores del formulario
                formik.resetForm();

                // Limpia el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    setMensajeExitoAlert(null);
                }, 3000);

            } catch (e) {
                // Captura y muestra el error
                console.error("Error:", e);
                setMensajeErrorAlert(e.message || "Error al crear inventario");
            } finally {
                setLoading(false); // Detiene el estado de carga
            }
        },
    });

    // Propiedades comunes para todos los campos de texto
    const commonTextFieldProps = {
        onChange: formik.handleChange, // Maneja los cambios de valor
        onBlur: formik.handleBlur, // Maneja la salida del campo
        fullWidth: true, // El campo ocupa todo el ancho
        margin: "dense", // Espaciado denso entre campos
    };

    return (
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth>
            {/* Formulario del modal */}
            <form onSubmit={formik.handleSubmit}>
                {/* Título del modal */}
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        <strong>Agregar Nuevo Inventario</strong>
                    </Typography>
                </DialogTitle>
                {/* Contenido del modal */}
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
                    {/* Campo: Nombre */}
                    <TextField id="nombre" label="Nombre*" {...commonTextFieldProps}
                        value={formik.values.nombre} // Valor del campo
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)} // Muestra error si existe
                        helperText={formik.touched.nombre && formik.errors.nombre} // Texto de ayuda si hay error
                    />
                    {/* Grupo de campos: Dirección */}
                    <Typography variant="subtitle1" gutterBottom><strong>Dirección</strong></Typography>
                    <TextField id="direccion.calle" label="Calle*" {...commonTextFieldProps}
                        value={formik.values.direccion.calle}
                        error={formik.touched.direccion?.calle && Boolean(formik.errors.direccion?.calle)}
                        helperText={formik.touched.direccion?.calle && formik.errors.direccion?.calle}
                    />
                    <TextField id="direccion.numero" label="Número*" {...commonTextFieldProps}
                        value={formik.values.direccion.numero}
                        error={formik.touched.direccion?.numero && Boolean(formik.errors.direccion?.numero)}
                        helperText={formik.touched.direccion?.numero && formik.errors.direccion?.numero}
                    />
                    <TextField id="direccion.colonia" label="Colonia*" {...commonTextFieldProps}
                        value={formik.values.direccion.colonia}
                        error={formik.touched.direccion?.colonia && Boolean(formik.errors.direccion?.colonia)}
                        helperText={formik.touched.direccion?.colonia && formik.errors.direccion?.colonia}
                    />
                    <TextField id="direccion.ciudad" label="Ciudad*" {...commonTextFieldProps}
                        value={formik.values.direccion.ciudad}
                        error={formik.touched.direccion?.ciudad && Boolean(formik.errors.direccion?.ciudad)}
                        helperText={formik.touched.direccion?.ciudad && formik.errors.direccion?.ciudad}
                    />
                    <TextField id="direccion.estado" label="Estado*" {...commonTextFieldProps}
                        value={formik.values.direccion.estado}
                        error={formik.touched.direccion?.estado && Boolean(formik.errors.direccion?.estado)}
                        helperText={formik.touched.direccion?.estado && formik.errors.direccion?.estado}
                    />
                    <TextField id="direccion.codigo_postal" label="Código Postal*" {...commonTextFieldProps}
                        value={formik.values.direccion.codigo_postal}
                        error={formik.touched.direccion?.codigo_postal && Boolean(formik.errors.direccion?.codigo_postal)}
                        helperText={formik.touched.direccion?.codigo_postal && formik.errors.direccion?.codigo_postal}
                    />
                    {/* Grupo de campos: Contacto */}
                    <Typography variant="subtitle1" gutterBottom><strong>Contacto</strong></Typography>
                    <TextField id="contacto.telefono" label="Teléfono" {...commonTextFieldProps}
                        value={formik.values.contacto.telefono}
                        error={formik.touched.contacto?.telefono && Boolean(formik.errors.contacto?.telefono)}
                        helperText={formik.touched.contacto?.telefono && formik.errors.contacto?.telefono}
                    />
                    <TextField id="contacto.email" label="Correo Electrónico" {...commonTextFieldProps}
                        value={formik.values.contacto.email}
                        error={formik.touched.contacto?.email && Boolean(formik.errors.contacto?.email)}
                        helperText={formik.touched.contacto?.email && formik.errors.contacto?.email}
                    />
                    {/* Campos de selección */}
                    <FormControlLabel control={<Checkbox id="Activo" checked={formik.values.Activo} onChange={formik.handleChange} />}
                        label="Activo" />
                    <FormControlLabel control={<Checkbox id="Borrado" checked={formik.values.Borrado} onChange={formik.handleChange} />}
                        label="Borrado" />
                </DialogContent>
                {/* Acciones del modal */}
                <DialogActions>
                    {/* Mensajes de error o éxito */}
                    <Box m="auto">
                        {mensajeErrorAlert && <Alert severity="error"><b>¡ERROR!</b> {mensajeErrorAlert}</Alert>}
                        {mensajeExitoAlert && <Alert severity="success"><b>¡ÉXITO!</b> {mensajeExitoAlert}</Alert>}
                    </Box>
                    {/* Botón: Cerrar */}
                    <LoadingButton color="secondary" startIcon={<CloseIcon />} variant="outlined" onClick={() => setShowAddModal(false)}>CERRAR</LoadingButton>
                    {/* Botón: Guardar */}
                    <LoadingButton color="primary" startIcon={<SaveIcon />} variant="contained" type="submit" loading={Loading}>GUARDAR</LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddInventoryModal;
