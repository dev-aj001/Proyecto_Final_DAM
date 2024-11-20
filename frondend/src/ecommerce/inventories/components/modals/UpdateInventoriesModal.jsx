import React, { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, TextField,
    DialogActions, Alert, Box, FormControlLabel, Checkbox, IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search"; // Agregar el ícono de búsqueda
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { getInventoryById } from "../services/remote/get/GetInventoriesById"; // Asegúrate de tener esta función en el servicio

import { UpdateOneInventory } from "../services/remote/put/UpdateOneInventories";
const UpdateInventoryModal = ({ showUpdateModal, setShowUpdateModal, inventoryData, onInventoryUpdated, fetchData }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [inventoryId, setInventoryId] = useState(""); // Almacenar el ID del inventario
    const [isSearchDisabled, setIsSearchDisabled] = useState(false); // Para habilitar/deshabilitar el campo de ID

    useEffect(() => {
        if (inventoryData) {
            formik.setValues({
                nombre: inventoryData.nombre || "",
                direccion: {
                    calle: inventoryData.direccion?.calle || "",
                    numero: inventoryData.direccion?.numero || "",
                    colonia: inventoryData.direccion?.colonia || "",
                    ciudad: inventoryData.direccion?.ciudad || "",
                    estado: inventoryData.direccion?.estado || "",
                    codigo_postal: inventoryData.direccion?.codigo_postal || "",
                },
                contacto: {
                    telefono: inventoryData.contacto?.telefono || "",
                    email: inventoryData.contacto?.email || "",
                },
                Activo: inventoryData.Activo || false,
                Borrado: inventoryData.Borrado || false,
            });
            setInventoryId(inventoryData._id); // Establecer el ID del inventario al abrir el modal
        }
    }, [inventoryData]);

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
            console.log("Valores enviados:", values);

            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                const response = await UpdateOneInventory(inventoryId, values); // Se pasa el ID del inventario a actualizar
                if (response && ![200, 201].includes(response.status)) {
                    throw new Error(response.data?.message || "Error al actualizar inventario");
                }
                 console.log(values);

                // Actualiza el mensaje de éxito
                setMensajeExitoAlert("Inventario actualizado correctamente");

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
                setMensajeErrorAlert(e.message || "Error al actualizar inventario");
            } finally {
                setLoading(false);
            }
        },
    });

    // Función para buscar el inventario por ID
    const handleSearchById = async () => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true);
        try {
            const data = await getInventoryById(inventoryId);
            formik.setValues({
                nombre: data.nombre || "",
                direccion: {
                    calle: data.direccion?.calle || "",
                    numero: data.direccion?.numero || "",
                    colonia: data.direccion?.colonia || "",
                    ciudad: data.direccion?.ciudad || "",
                    estado: data.direccion?.estado || "",
                    codigo_postal: data.direccion?.codigo_postal || "",
                },
                contacto: {
                    telefono: data.contacto?.telefono || "",
                    email: data.contacto?.email || "",
                },
                Activo: data.Activo || false,
                Borrado: data.Borrado || false,
            });
            setIsSearchDisabled(true); // Deshabilitar la búsqueda después de buscar
        } catch (error) {
            setMensajeErrorAlert("No se pudo encontrar el inventario con ese ID.");
        } finally {
            setLoading(false);
        }
    };

    // Función para recargar el formulario
    const handleReloadForm = () => {
        formik.resetForm();
        setInventoryId(""); // Limpiar el ID del inventario
        setIsSearchDisabled(false); // Habilitar la búsqueda nuevamente
    };

    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
    };

    const handleClose = () => {
        formik.resetForm(); // Reinicia los valores del formulario
        setInventoryId(""); // Limpiar el ID del inventario
        setIsSearchDisabled(false); // Habilitar la búsqueda nuevamente
        setShowUpdateModal(false); // Cerrar el modal
    };

    return (
        <Dialog open={showUpdateModal} onClose={handleClose} fullWidth>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        <strong>Actualizar Inventario</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
                    {/* ID del inventario */}
                    <TextField
                        id="inventoryId"
                        label="ID del Inventario"
                        {...commonTextFieldProps}
                        value={inventoryId}
                        onChange={(e) => setInventoryId(e.target.value)}
                        disabled={isSearchDisabled} // Deshabilitar solo si se ha realizado la búsqueda
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleSearchById} disabled={isSearchDisabled}>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
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
                    {/* Contacto */}
                    <Typography variant="subtitle1" gutterBottom><strong>Contacto</strong></Typography>
                    <TextField id="contacto.telefono" label="Teléfono" {...commonTextFieldProps}
                        value={formik.values.contacto.telefono}
                    />
                    <TextField id="contacto.email" label="Correo Electrónico" {...commonTextFieldProps}
                        value={formik.values.contacto.email}
                    />
                    {/* Estado */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="Activo"
                                checked={formik.values.Activo}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Activo"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="Borrado"
                                checked={formik.values.Borrado}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Borrado"
                    />
                    {/* Mensajes de error y éxito */}
                    {mensajeErrorAlert && (
                        <Box sx={{ marginTop: 2 }}>
                            <Alert severity="error">{mensajeErrorAlert}</Alert>
                        </Box>
                    )}
                    {mensajeExitoAlert && (
                        <Box sx={{ marginTop: 2 }}>
                            <Alert severity="success">{mensajeExitoAlert}</Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        loading={Loading}
                    >
                        Guardar
                    </LoadingButton>
                    <LoadingButton
                        onClick={handleReloadForm}
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloseIcon />}
                    >
                        Recargar
                    </LoadingButton>
                    <LoadingButton
                        onClick={handleClose}
                        variant="outlined"
                        color="secondary"
                    >
                        Cerrar
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateInventoryModal;
