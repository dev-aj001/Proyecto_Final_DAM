import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogTitle, Typography, TextField,
  DialogActions, Alert, Box, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllInventories } from "../services/remote/get/GetAllInventories"; // Asegúrate de que la consulta esté bien importada
import { AddOneAlmacenes } from "../services/remote/post/AddOneAlmacenes";

const AddAlmacenesModal = ({ showAddModal, setShowAddModal, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]); // Estado para almacenar los inventarios

  // Cargar los inventarios al iniciar el componente
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const allInventoriesData = await getAllInventories();
        const validatedData = allInventoriesData.map((item) => ({
          _id: item._id || "No disponible",
          Nombre: item.nombre || "No disponible",
          Telefono: item.contacto?.telefono || "No disponible",
          Email: item.contacto?.email || "No disponible",
          Direccion: "C.P.:" + item.direccion?.codigo_postal + ", Colonia: " + item.direccion?.colonia || "No disponible",
        }));
        setInventories(validatedData); // Asignar los datos al estado de inventories
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
    };

    fetchInventories();
  }, []);

  const formik = useFormik({
    initialValues: {
      id_negocio: "",
      id_almacen: "",
      principal: false,
      cantidadActual: "",
      cantidadDisponible: "",
      cantidadApartada: "",
      cantidadMerma: "",
      stockMaximo: "",
      stockMinimo: "",
    },
    validationSchema: Yup.object({
      id_negocio: Yup.string().required("El campo es requerido"),
      id_almacen: Yup.string().required("El campo es requerido"),
      cantidadActual: Yup.number().required("El campo es requerido"),
      cantidadDisponible: Yup.number().required("El campo es requerido"),
      cantidadApartada: Yup.number().required("El campo es requerido"),
      cantidadMerma: Yup.number().required("El campo es requerido"),
      stockMaximo: Yup.number().required("El campo es requerido"),
      stockMinimo: Yup.number().required("El campo es requerido"),
    }),

    onSubmit: async (values) => {
      setMensajeErrorAlert(null);
      setMensajeExitoAlert(null);
      setLoading(true);
      try {
        const data = await AddOneAlmacenes(values);
        if (data?.status === 200) {
          setMensajeExitoAlert("Almacén creado exitosamente.");
          fetchData();
          formik.resetForm();
        } else {
          setMensajeErrorAlert(data?.message || "Error al crear almacén");
        }
      } catch (error) {
        setMensajeErrorAlert(error.message || "Error al crear almacén");
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
            <strong>Agregar Nuevo Almacén</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }} dividers>
        <FormControl fullWidth margin="dense">
  <InputLabel id="id_negocio-label">ID negocio*</InputLabel>
  <Select
    labelId="id_negocio-label"
    id="id_negocio"
    name="id_negocio"  
    value={formik.values.id_negocio}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.id_negocio && Boolean(formik.errors.id_negocio)}
  >
    {inventories.map((inventory) => (
      <MenuItem key={inventory._id} value={inventory._id}>
        {inventory._id}
      </MenuItem>
    ))}
  </Select>
  {formik.touched.id_negocio && formik.errors.id_negocio && (
    <Typography variant="caption" color="error">
      {formik.errors.id_negocio}
    </Typography>
  )}
</FormControl>


          <TextField
            id="id_almacen"
            label="ID Almacén*"
            {...commonTextFieldProps}
            value={formik.values.id_almacen}
            error={formik.touched.id_almacen && Boolean(formik.errors.id_almacen)}
            helperText={formik.touched.id_almacen && formik.errors.id_almacen}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="principal"
                checked={formik.values.principal}
                onChange={formik.handleChange}
              />
            }
            label="Principal"
          />
          <TextField
            id="cantidadActual"
            label="Cantidad Actual*"
            {...commonTextFieldProps}
            value={formik.values.cantidadActual}
            error={formik.touched.cantidadActual && Boolean(formik.errors.cantidadActual)}
            helperText={formik.touched.cantidadActual && formik.errors.cantidadActual}
          />
          <TextField
            id="cantidadDisponible"
            label="Cantidad Disponible*"
            {...commonTextFieldProps}
            value={formik.values.cantidadDisponible}
            error={formik.touched.cantidadDisponible && Boolean(formik.errors.cantidadDisponible)}
            helperText={formik.touched.cantidadDisponible && formik.errors.cantidadDisponible}
          />
          <TextField
            id="cantidadApartada"
            label="Cantidad Apartada*"
            {...commonTextFieldProps}
            value={formik.values.cantidadApartada}
            error={formik.touched.cantidadApartada && Boolean(formik.errors.cantidadApartada)}
            helperText={formik.touched.cantidadApartada && formik.errors.cantidadApartada}
          />
          <TextField
            id="cantidadMerma"
            label="Cantidad Merma*"
            {...commonTextFieldProps}
            value={formik.values.cantidadMerma}
            error={formik.touched.cantidadMerma && Boolean(formik.errors.cantidadMerma)}
            helperText={formik.touched.cantidadMerma && formik.errors.cantidadMerma}
          />
          <TextField
            id="stockMaximo"
            label="Stock Máximo*"
            {...commonTextFieldProps}
            value={formik.values.stockMaximo}
            error={formik.touched.stockMaximo && Boolean(formik.errors.stockMaximo)}
            helperText={formik.touched.stockMaximo && formik.errors.stockMaximo}
          />
          <TextField
            id="stockMinimo"
            label="Stock Mínimo*"
            {...commonTextFieldProps}
            value={formik.values.stockMinimo}
            error={formik.touched.stockMinimo && Boolean(formik.errors.stockMinimo)}
            helperText={formik.touched.stockMinimo && formik.errors.stockMinimo}
          />
        </DialogContent>
        <DialogActions>
          <Box m="auto">
            {mensajeErrorAlert && (
              <Alert severity="error">
                <b>¡ERROR!</b> {mensajeErrorAlert}
              </Alert>
            )}
            {mensajeExitoAlert && (
              <Alert severity="success">
                <b>¡ÉXITO!</b> {mensajeExitoAlert}
              </Alert>
            )}
          </Box>
          <LoadingButton
            color="secondary"
            startIcon={<CloseIcon />}
            variant="outlined"
            
            onClick={() => {
              formik.resetForm();
              setShowAddModal(false)}}
          >
            CERRAR
          </LoadingButton>
          <LoadingButton
            onClick={() => {
              console.log(formik.values);
            }}
            color="primary"
            startIcon={<SaveIcon />}
            variant="contained"
            type="submit"
            loading={loading}
          >
            GUARDAR
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAlmacenesModal;
