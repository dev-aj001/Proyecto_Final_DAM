import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogTitle, Typography, TextField,
  DialogActions, Alert, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { UpdateOneAlmacen } from "../services/remote/put/UpdateOneAlmacenes";
import { getAlmacenesById } from "../services/remote/get/GetAlmacenesById";

const UpdateAlmacenesModal = ({ showUpdateModal, setShowUpdateModal, selectedAlmacenes, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [Loading, setLoading] = useState(false);
  const [almacenesData, setAlmacenesData] = useState(null);

  // Carga los datos del almacén cuando el modal se abre
  useEffect(() => {
    if (selectedAlmacenes?._id) {
      const fetchData = async () => {
        try {
          const response = await getAlmacenesById(selectedAlmacenes?.idNeg, selectedAlmacenes?._id);
          setAlmacenesData(response); // Actualiza el estado con los datos del almacén
        } catch (error) {
          console.error("Error al obtener los datos del almacén:", error);
        }
      };
      fetchData();
    }
  }, [selectedAlmacenes?._id, selectedAlmacenes?.idNeg]);

  // Configuración de Formik
  const formik = useFormik({
    enableReinitialize: true, // Permite actualizar los valores iniciales
    initialValues: {
      id_almacen: almacenesData?.id_almacen || "",
      cantidadActual: almacenesData?.cantidadActual || "",
      cantidadDisponible: almacenesData?.cantidadDisponible || "",
      cantidadApartada: almacenesData?.cantidadApartada || "",
      cantidadMerma: almacenesData?.cantidadMerma || "",
      stockMaximo: almacenesData?.stockMaximo || "",
      stockMinimo: almacenesData?.stockMinimo || "",
    },
    validationSchema: Yup.object({
      id_almacen: Yup.string().required("El ID del almacén es requerido"),
      cantidadActual: Yup.number().required("La cantidad actual es requerida"),
      cantidadDisponible: Yup.number().required("La cantidad disponible es requerida"),
      cantidadApartada: Yup.number().required("La cantidad apartada es requerida"),
      cantidadMerma: Yup.number().required("La cantidad de merma es requerida"),
      stockMaximo: Yup.number().required("El stock máximo es requerido"),
      stockMinimo: Yup.number().required("El stock mínimo es requerido"),
    }),
    onSubmit: async (values) => {
      setMensajeErrorAlert(null);
      setMensajeExitoAlert(null);
      setLoading(true);
      try {

        console.log("Valores del formulario:", values);
        const response = await UpdateOneAlmacen(selectedAlmacenes.idNeg, selectedAlmacenes._id, values);
        if (!response || ![200, 201].includes(response.status)) {
          throw new Error(response.data?.message || "Error al actualizar almacén");
        }
        setMensajeExitoAlert("Almacén actualizado con éxito");
        fetchData(); // Refresca la tabla
    
        setTimeout(() => setMensajeExitoAlert(null), 3000);

       
      } catch (error) {
        setMensajeErrorAlert(error.message || "Error al actualizar almacén");
      } finally {
        setLoading(false);
      }
    }
  });

  // Cierra el modal y reinicia el formulario
  const handleClose = () => {
    formik.resetForm();
    setShowUpdateModal(false);
  };

  return (
    <Dialog open={showUpdateModal} onClose={handleClose} fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <strong>Actualizar Almacén</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID Inventario: <strong>{selectedAlmacenes?._id}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensajes de éxito o error */}
          {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}
          {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}

          {/* Campos del formulario */}
          <TextField
            label="ID del Almacén"
            fullWidth
            name="id_almacen"
            value={formik.values.id_almacen}
            onChange={formik.handleChange}
            error={formik.touched.id_almacen && Boolean(formik.errors.id_almacen)}
            helperText={formik.touched.id_almacen && formik.errors.id_almacen}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cantidad Actual"
            fullWidth
            name="cantidadActual"
            type="number"
            value={formik.values.cantidadActual}
            onChange={formik.handleChange}
            error={formik.touched.cantidadActual && Boolean(formik.errors.cantidadActual)}
            helperText={formik.touched.cantidadActual && formik.errors.cantidadActual}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cantidad Disponible"
            fullWidth
            name="cantidadDisponible"
            type="number"
            value={formik.values.cantidadDisponible}
            onChange={formik.handleChange}
            error={formik.touched.cantidadDisponible && Boolean(formik.errors.cantidadDisponible)}
            helperText={formik.touched.cantidadDisponible && formik.errors.cantidadDisponible}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cantidad Apartada"
            fullWidth
            name="cantidadApartada"
            type="number"
            value={formik.values.cantidadApartada}
            onChange={formik.handleChange}
            error={formik.touched.cantidadApartada && Boolean(formik.errors.cantidadApartada)}
            helperText={formik.touched.cantidadApartada && formik.errors.cantidadApartada}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cantidad Merma"
            fullWidth
            name="cantidadMerma"
            type="number"
            value={formik.values.cantidadMerma}
            onChange={formik.handleChange}
            error={formik.touched.cantidadMerma && Boolean(formik.errors.cantidadMerma)}
            helperText={formik.touched.cantidadMerma && formik.errors.cantidadMerma}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Stock Máximo"
            fullWidth
            name="stockMaximo"
            type="number"
            value={formik.values.stockMaximo}
            onChange={formik.handleChange}
            error={formik.touched.stockMaximo && Boolean(formik.errors.stockMaximo)}
            helperText={formik.touched.stockMaximo && formik.errors.stockMaximo}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Stock Mínimo"
            fullWidth
            name="stockMinimo"
            type="number"
            value={formik.values.stockMinimo}
            onChange={formik.handleChange}
            error={formik.touched.stockMinimo && Boolean(formik.errors.stockMinimo)}
            helperText={formik.touched.stockMinimo && formik.errors.stockMinimo}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>Cerrar</Button>


          <LoadingButton
            loading={Loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            type="submit"
          >
            Guardar Cambios
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateAlmacenesModal;
