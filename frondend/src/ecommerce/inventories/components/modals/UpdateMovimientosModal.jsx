import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogTitle, Typography, TextField,
  DialogActions, Alert, Box, FormControlLabel, Checkbox, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { UpdateOneMoviminetos } from "../services/remote/put/UpdateOneMoviminetos";
import { getMovimientosById } from "../services/remote/get/GetMoviminetosById";

const UpdateMovimientosModal = ({ showUpdateModal, setShowUpdateModal, selectedMovimientos, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [selectMovimientos, setSelectMovimientos] = useState([]);
  const [Loading, setLoading] = useState(false);


  useEffect(() => {
    handleSearchById();
    fetchData();
  }, [showUpdateModal, selectedMovimientos]);
  const handleSearchById = async () => {
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    setLoading(true);
    try {
      const data = await getMovimientosById(selectedMovimientos?.negocioId, selectedMovimientos?.id_almacen, selectedMovimientos?.movimientoId);
      console.log("Valores del formulario:", data);
      formik.setValues({
        id_movimiento: data?.id_movimiento || "",
        tipo: data?.tipo || "",
        cantidadAnterior: data?.cantidadAnterior || "",
        cantidadMovimiento: data?.cantidadMovimiento || "",
        cantidadActual: data?.cantidadActual || "",
        referencia: data?.referencia || "",
      });
      setIsSearchDisabled(true); // Deshabilitar la búsqueda luego de buscar
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id_movimiento: "",
      tipo: "",
      cantidadAnterior: "",
      cantidadMovimiento: "",
      cantidadActual: "",
      referencia: "",
    },
    validationSchema: Yup.object().shape({
      id_movimiento: Yup.string().required("Campo requerido"),
      tipo: Yup.string().required("Campo requerido"),
      cantidadAnterior: Yup.string().required("Campo requerido"),
      cantidadMovimiento: Yup.string().required("Campo requerido"),
      cantidadActual: Yup.string().required("Campo requerido"),
      referencia: Yup.string().required("Campo requerido"),
    }),
    onSubmit: async (values) => {
      setMensajeErrorAlert(null);
      setMensajeExitoAlert(null);
      setLoading(true);
      try {
        await UpdateOneMoviminetos(selectedMovimientos.negocioId, selectedMovimientos.id_almacen, selectedMovimientos.movimientoId, values);
        setMensajeExitoAlert("Datos actualizados exitosamente.");
      } catch (error) {
        setMensajeErrorAlert("Error al actualizar los datos.");
      } finally {
        setLoading(false);
      }

    },
  });

  const handleClose = () => {
    formik.resetForm();
    setShowUpdateModal(false);
  }


  return (

    <Dialog open={showUpdateModal} onClose={handleClose} fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <strong>Actualizar Movientos</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID de Movientos: <strong>{selectedMovimientos?.movimientoId}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensajes de éxito o error */}
          {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}
          {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}

          {/* Campos del formulario */}


          <TextField
            label="id_movimiento"
            fullWidth
            name="id_movimiento"
            type="text"
            value={formik.values.id_movimiento}
            onChange={formik.handleChange}
            error={formik.touched.id_movimiento && Boolean(formik.errors.id_movimiento)}
            helperText={formik.touched.id_movimiento && formik.errors.id_movimiento}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Tipo"
            fullWidth
            name="tipo"
            type="text"
            value={formik.values.tipo}
            onChange={formik.handleChange}
            error={formik.touched.tipo && Boolean(formik.errors.tipo)}
            helperText={formik.touched.tipo && formik.errors.tipo}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="cantidad Anterior"
            fullWidth
            name="cantidadAnterior"
            type="text"
            value={formik.values.cantidadAnterior}
            onChange={formik.handleChange}
            error={formik.touched.cantidadAnterior && Boolean(formik.errors.cantidadAnterior)}
            helperText={formik.touched.cantidadAnterior && formik.errors.cantidadAnterior}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label=" cantidad Movimiento"
            fullWidth
            name="cantidadMovimiento"
            type="text"
            value={formik.values.cantidadMovimiento}
            onChange={formik.handleChange}
            error={formik.touched.cantidadMovimiento && Boolean(formik.errors.cantidadMovimiento)}
            helperText={formik.touched.cantidadMovimiento && formik.errors.cantidadMovimiento}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label=" cantidad Actual"
            fullWidth
            name="cantidadActual"
            type="text"
            value={formik.values.cantidadActual}
            onChange={formik.handleChange}
            error={formik.touched.cantidadActual && Boolean(formik.errors.cantidadActual)}
            helperText={formik.touched.cantidadActual && formik.errors.cantidadActual}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="referencia"
            fullWidth
            name="referencia"
            type="text"
            value={formik.values.referencia}
            onChange={formik.handleChange}
            error={formik.touched.referencia && Boolean(formik.errors.referencia)}
            helperText={formik.touched.referencia && formik.errors.referencia}
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

export default UpdateMovimientosModal;

