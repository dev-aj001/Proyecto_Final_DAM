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
import { AddOneMoviminetos } from "../services/remote/post/AddOneMoviminetos";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import { getAlmacenesById } from "../services/remote/get/GetAlmacenesById";

const AddMovimientosModal = ({ showAddModal, setShowAddModal, fetchData }) => {
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
            id_movimiento: "",
            tipo: "",
            cantidadAnterior: "",
            cantidadMovimiento: "",
            cantidadActual: "",
            referencia: "",
        },
        validationSchema: Yup.object({
            id_negocio: Yup.string().required("El campo es requerido"),
            id_almacen: Yup.string().required("Requerido"),
            id_movimiento: Yup.string().required("Requerido"),
            tipo: Yup.string().required("Requerido"),
            cantidadAnterior: Yup.number().required("Requerido"),
            cantidadActual: Yup.number().required("Requerido"),
            referencia: Yup.string().required("Requerido"),
        }),
        onSubmit: async (values) => {
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                console.log("Valores del formulario:", values);
                const data = {
                    id_movimiento: values.id_movimiento,
                    tipo: values.tipo,
                    cantidadAnterior: values.cantidadAnterior,
                    cantidadMovimiento: values.cantidadMovimiento,
                    cantidadActual: values.cantidadActual,
                    referencia: values.referencia,
                };
                const response = await AddOneMoviminetos(values.id_negocio, values.id_almacen, data);
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
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth>
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
                        label="ID Movimiento"
                        name="id_movimiento"
                        value={formik.values.id_movimiento}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.id_movimiento && formik.errors.id_movimiento && (
                        <Typography color="error">{formik.errors.id_movimiento}</Typography>
                    )}

                    {/* Número de Serie */}
                    <TextField
                        label="Tipo"
                        name="tipo"
                        value={formik.values.tipo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.tipo && formik.errors.tipo && (
                        <Typography color="error">{formik.errors.tipo}</Typography>
                    )}

                    {/* Número de Placa */}
                    <TextField
                        label="Cant. Anterior"
                        name="cantidadAnterior"
                        value={formik.values.cantidadAnterior}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.cantidadAnterior && formik.errors.cantidadAnterior && (
                        <Typography color="error">{formik.errors.cantidadAnterior}</Typography>
                    )}

                    {/* Observación */}
                    <TextField
                        label="Cant. Movimiento"
                        name="cantidadMovimiento"
                        value={formik.values.cantidadMovimiento}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.cantidadMovimiento && formik.errors.cantidadMovimiento && (
                        <Typography color="error">{formik.errors.cantidadMovimiento}</Typography>
                    )}

                    {/* Observación */}
                    <TextField
                        label="Cant. Actual"
                        name="cantidadActual"
                        value={formik.values.cantidadActual}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.cantidadActual && formik.errors.cantidadActual && (
                        <Typography color="error">{formik.errors.cantidadActual}</Typography>
                    )}

                    {/* Observación */}
                    <TextField
                        label="Referencia"
                        name="referencia"
                        value={formik.values.referencia}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.referencia && formik.errors.referencia && (
                        <Typography color="error">{formik.errors.referencia}</Typography>
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

export default AddMovimientosModal;
