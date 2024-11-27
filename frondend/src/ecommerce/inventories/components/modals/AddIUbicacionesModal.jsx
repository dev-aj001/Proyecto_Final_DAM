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
import { AddOneUbicaciones } from "../services/remote/post/AddOneUbicaciones";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import { getAlmacenesById } from "../services/remote/get/GetAlmacenesById";
import { getAllseriesById } from "../services/remote/get/GetAllSeriesById";


const AddUbicacionModal = ({ showAddModal, setShowAddModal, fetchData }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [negocios, setNegocios] = useState([]); // Para almacenar los negocios
    const [almacen, setAlmacen] = useState([]); // Para almacenar los inventories
    const [series, setSeries] = useState([]); // Para almacenar los inventories

    const fetchAlmacenes = async (id) => {
        try {
            const allInventoriesData = await getAlmacenesById(id);
            setAlmacen(allInventoriesData); // Asignar los datos al estado de inventories
        } catch (error) {
            console.error("Error fetching inventories:", error);
        }
    };

    const fetchSeries = async (idNeg, idAlmac) => {
        try {
            const allInventoriesData = await getAllseriesById(idNeg, idAlmac);
            setSeries(allInventoriesData); // Asignar los datos al estado de inventories
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
            idTipoStatusOK: "",
            ubicacion: "",
            actual:false,
            
        },
        validationSchema: Yup.object({
            id_negocio: Yup.string().required("El campo es requerido"),
            id_almacen: Yup.string().required("Requerido"),
            id_serie: Yup.string().required("Requerido"),
            idTipoStatusOK: Yup.string().required("Requerido"),
            ubicacion: Yup.string().required("Requerido"),
        }),
        onSubmit: async (values) => {
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                console.log("Valores del formulario:", values);
                const data = {
                    idTipoStatusOK: values.idTipoStatusOK,
                    ubicacion: values.ubicacion,
                    actual:values.actual
                };
                const response = await AddOneUbicaciones(values.id_negocio, values.id_almacen,values.id_serie, data);
                
                setMensajeExitoAlert("Ubicaciones creado correctamente");
                fetchData();
                formik.resetForm();
                setTimeout(() => {
                    setMensajeExitoAlert(null);
                }, 3000);
            } catch (e) {
                setMensajeErrorAlert(e.message || "Error al crear Info ad");
                console.log(e);
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
                <Typography variant="h6">Agregar Ubicaciones</Typography>
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
                            onChange={(e)=>{
                                formik.handleChange(e);
                                // setNegocioSeleccionado(e.target.value);
                                fetchSeries(formik.values.id_negocio,e.target.value);
                                console.log("Seleccion: " + e.target.value);
                                
                            }}
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



                    <FormControl fullWidth margin="dense">
                        <InputLabel id="id_serie-label">Serie</InputLabel>
                        <Select
                            labelId="id_serie-label"
                            id="id_serie"
                            name="id_serie"
                            value={formik.values.id_serie}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.id_serie && Boolean(formik.errors.id_serie)}
                        >
                          
                            {series.map((serie) => (
                                <MenuItem key={serie._id} value={serie._id}>
                                    {serie.id_serie}
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
                        label="idTipoStatusOK"
                        name="idTipoStatusOK"
                        value={formik.values.idTipoStatusOK}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.idTipoStatusOK && formik.errors.idTipoStatusOK && (
                        <Typography color="error">{formik.errors.idTipoStatusOK}</Typography>
                    )}



                    {/* ID Serie */}
                    <TextField
                        label="ubicacion"
                        name="ubicacion"
                        value={formik.values.ubicacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        margin="dense"
                    />
                    {formik.touched.ubicacion && formik.errors.ubicacion && (
                        <Typography color="error">{formik.errors.ubicacion}</Typography>
                    )}

                
                  {/* Activo / Borrado */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="actual"
                  checked={formik.values.actual}
                  onChange={formik.handleChange}
                />
              }
              label="actual"
            />
           
          </Box>


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

export default AddUbicacionModal;
