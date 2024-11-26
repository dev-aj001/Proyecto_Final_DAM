import React, { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, TextField,
    DialogActions, Alert, Box, FormControlLabel, Checkbox, FormGroup, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { AddOneService } from "../services/remote/post/AddOneServis";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import { getAlmacenesById } from "../services/remote/get/GetAlmacenesById";

const AddIServisModal = ({ showAddModal, setShowAddModal, fetchData }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [negocios, setNegocios] = useState([]); // Para almacenar los negocios
    const [almacen, setAlmacen] = useState([]); // Para almacenar los inventories
    const [negocioSeleccionado, setNegocioSeleccionado] = useState(""); // Para almacenar los inventories

    const fetchAlmacenes = async (id) => {
        try {
            const allInventoriesData = await getAlmacenesById(id);
            setAlmacen(allInventoriesData); // Asignar los datos al estado de inventories
            console.log("Almacenes obtenidos:", allInventoriesData);
        } catch (error) {
            console.error("Error fetching inventories:", error);
        }
    };

    useEffect(() => {
        const fetchNegocios = async () => {
            try {
                const allInventoriesData = await getAllInventories();
                const validatedData = allInventoriesData.map((item) => ({
                    _id: item._id || "No disponible",
                    Nombre: item.nombre || "No disponible",
                    Telefono: item.contacto?.telefono || "No disponible",
                    Email: item.contacto?.email || "No disponible",
                    Direccion: "C.P.:" + item.direccion?.codigo_postal + ", Colonia: " + item.direccion?.colonia || "No disponible",
                }));
                setNegocios(validatedData); // Asignar los datos al estado de inventories
            } catch (error) {
                console.error("Error fetching inventories:", error);
            }
        };
        fetchNegocios();

        
        // fetchAlmacenes();
    }, []);

    const formik = useFormik({
        initialValues: {
            id_negocio: "", // Aquí permitimos múltiples selecciones
            id_almacen: "",
            id_serie: "",
            numero_serie: "",
            numero_placa: "",
            observacion: "",
        },
        validationSchema: Yup.object({
            id_negocio: Yup.string().required("El campo es requerido"),
            id_almacen: Yup.string().required("Requerido"),
            id_serie: Yup.string().required("Requerido"),
            numero_serie: Yup.string().required("Requerido"),
            numero_placa: Yup.string().required("Requerido"),
            observacion: Yup.string().required("Requerido"),
        }),
        onSubmit: async (values) => {
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                console.log("Valores del formulario:", values);
                const data = {
                    id_serie: values.id_serie,
                    numero_serie: values.numero_serie,
                    numero_placa: values.numero_placa,
                    observacion: values.observacion,
                };
                const response = await AddOneService(values.id_negocio, values.id_almacen, data);
                if (response.status !== 200) {
                    throw new Error(response.data?.message || "Error al crear inventario");
                }
                setMensajeExitoAlert("Inventario creado correctamente");
                fetchData();
                formik.resetForm();
                setTimeout(() => {
                    setMensajeExitoAlert(null);
                }, 3000);
            } catch (e) {
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
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
            <DialogTitle>
                <Typography variant="h6">Agregar Series</Typography>
                <CloseIcon
                    onClick={() => setShowAddModal(false)}
                    style={{ cursor: "pointer", position: "absolute", right: 10, top: 10 }}
                />
            </DialogTitle>
            <DialogContent>
                {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}
                {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}

                <Box display="flex" flexDirection="column" gap={2}>

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="id_negocio-label">Negocio</InputLabel>
                        <Select
                            labelId="id_negocio-label"
                            id="id_negocio"
                            name="id_negocio"
                            value={formik.values.id_negocio}
                            onChange={(e)=>{
                                formik.handleChange(e);
                                // setNegocioSeleccionado(e.target.value);
                                fetchAlmacenes(e.target.value);
                                console.log("Seleccion: " + e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.id_negocio && Boolean(formik.errors.id_negocio)}
                        >
                            {negocios.map((negocios) => (
                                <MenuItem key={negocios._id} value={negocios._id}>
                                    {negocios.Nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.id_negocio && formik.errors.id_negocio && (
                            <Typography variant="caption" color="error">
                                {formik.errors.id_negocio}
                            </Typography>
                        )}
                        {/* ID Almacen */}


                       


                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="id_almacen-label">Almacen</InputLabel>
                        <Select
                            labelId="id_almacen-label"
                            id="id_almacen"
                            name="id_almacen"
                            value={formik.values.id_almacen}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.id_almacen && Boolean(formik.errors.id_almacen)}
                        >
                          
                            {almacen.map((almacen) => (
                                <MenuItem key={almacen._id} value={almacen._id}>
                                    {almacen.id_almacen}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.id_almacen && formik.errors.id_almacen && (
                            <Typography variant="caption" color="error">
                                {formik.errors.id_almacen}
                            </Typography>
                        )}
                    </FormControl>




                    {/* ID Serie */}
                    <TextField
                        label="ID Serie"
                        name="id_serie"
                        value={formik.values.id_serie}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.id_serie && formik.errors.id_serie && (
                        <Typography color="error">{formik.errors.id_serie}</Typography>
                    )}

                    {/* Número de Serie */}
                    <TextField
                        label="Número de Serie"
                        name="numero_serie"
                        value={formik.values.numero_serie}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.numero_serie && formik.errors.numero_serie && (
                        <Typography color="error">{formik.errors.numero_serie}</Typography>
                    )}

                    {/* Número de Placa */}
                    <TextField
                        label="Número de Placa"
                        name="numero_placa"
                        value={formik.values.numero_placa}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.numero_placa && formik.errors.numero_placa && (
                        <Typography color="error">{formik.errors.numero_placa}</Typography>
                    )}

                    {/* Observación */}
                    <TextField
                        label="Observación"
                        name="observacion"
                        value={formik.values.observacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.observacion && formik.errors.observacion && (
                        <Typography color="error">{formik.errors.observacion}</Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit}
                    startIcon={<SaveIcon />}
                >
                    Guardar
                </LoadingButton>
                <LoadingButton
                    onClick={() => setShowAddModal(false)}
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloseIcon />}
                >
                    Cerrar
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddIServisModal;
