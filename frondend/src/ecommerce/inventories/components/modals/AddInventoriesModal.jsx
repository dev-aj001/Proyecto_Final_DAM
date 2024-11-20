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
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            nombre: "",
            direccion: {
                calle: "",
                numero: "",
                colonia: "",
                ciudad: "",
                estado: "",
                codigo_postal: "",
            },
            contacto: {
                telefono: "",
                email: "",
            },
            Activo: false,
            Borrado: false,
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            direccion: Yup.object().shape({
                calle: Yup.string().required("La calle es obligatoria"),
                numero: Yup.string().required("El número es obligatorio"),
                colonia: Yup.string().required("La colonia es obligatoria"),
                ciudad: Yup.string().required("La ciudad es obligatoria"),
                estado: Yup.string().required("El estado es obligatorio"),
                codigo_postal: Yup.string().required("El código postal es obligatorio"),
            }),
            contacto: Yup.object().shape({
                telefono: Yup.string(),
                email: Yup.string().email("Correo inválido"),
            }),
        }),
        onSubmit: async (values) => {
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                const response = await AddOneInventory(values);
                if (response && ![200, 201].includes(response.status)) {
                    throw new Error(response.data?.message || "Error al crear inventario");
                }

                // Actualiza el mensaje de éxito
                setMensajeExitoAlert("Inventario creado correctamente");

                // Actualiza la tabla
                fetchData();

                // Reinicia el formulario
                formik.resetForm();

                // Limpia mensajes después de 3 segundos (opcional)
                setTimeout(() => {
                    setMensajeExitoAlert(null);
                }, 3000);

            } catch (e) {
                console.error("Error:", e);
                setMensajeErrorAlert(e.message || "Error al crear inventario");
            } finally {
                setLoading(false);
            }
        },
    });

    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
    };

    return (
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        <strong>Agregar Nuevo Inventario</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
                    <TextField id="nombre" label="Nombre*" {...commonTextFieldProps}
                        value={formik.values.nombre}
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        helperText={formik.touched.nombre && formik.errors.nombre}
                    />
                    {/* Dirección */}
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
                    <FormControlLabel control={<Checkbox id="Activo" checked={formik.values.Activo} onChange={formik.handleChange} />}
                        label="Activo" />
                    <FormControlLabel control={<Checkbox id="Borrado" checked={formik.values.Borrado} onChange={formik.handleChange} />}
                        label="Borrado" />
                </DialogContent>
                <DialogActions>
                    <Box m="auto">
                        {mensajeErrorAlert && <Alert severity="error"><b>¡ERROR!</b> {mensajeErrorAlert}</Alert>}
                        {mensajeExitoAlert && <Alert severity="success"><b>¡ÉXITO!</b> {mensajeExitoAlert}</Alert>}
                    </Box>
                    <LoadingButton color="secondary" startIcon={<CloseIcon />} variant="outlined" onClick={() => setShowAddModal(false)}>CERRAR</LoadingButton>
                    <LoadingButton color="primary" startIcon={<SaveIcon />} variant="contained" type="submit" loading={Loading}>GUARDAR</LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddInventoryModal;
