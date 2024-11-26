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
import { UpdateOneSeries } from "../services/remote/put/UpdateOneSeries";
import { getseriesById } from "../services/remote/get/GetSeriesById";

const UpdateSeriesModal = ({ showUpdateModal, setShowUpdateModal, selectedSeries, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [seriesData, setSeriesData] = useState([]);
  const [Loading, setLoading] = useState(false);


  useEffect(() => {
    handleSearchById();
    fetchData();
  }, [showUpdateModal, selectedSeries]);

  const handleSearchById = async () => {
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    setLoading(true);
    try {
      const data = await getseriesById(selectedSeries?.negocioId, selectedSeries?.id_almacen, selectedSeries?.id_serie);
     setSeriesData(data);
      setIsSearchDisabled(true); // Deshabilitar la búsqueda luego de buscar
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id_serie: "",
      numero_serie: "",
      numero_placa: "",
      observacion: "",
    },
    validationSchema: Yup.object({
      id_serie: Yup.string().required("El campo ID de serie es obligatorio"),
      numero_serie: Yup.string().required("El campo Número de serie es obligatorio"),
      numero_placa: Yup.string().required("El campo Número de placa es obligatorio"),
      observacion: Yup.string().required("El campo Observación es obligatorio"),

    }),

      onSubmit: async (values) => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true);
        try {
          await UpdateOneSeries(selectedSeries.negocioId, selectedSeries.id_almacen, selectedSeries.id_serie, values);
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
  };
  return (
    <Dialog open={showUpdateModal} onClose={handleClose} fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <strong>Actualizar Series</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID de Serie: <strong>{selectedSeries?.id_serie}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensajes de éxito o error */}
          {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}
          {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}

          {/* Campos del formulario */}
          <TextField
            label="Número de Serie"
            fullWidth
            name="id_Nserie"
            value={formik.values.id_serie}
            onChange={formik.handleChange}
            error={formik.touched.id_serie && Boolean(formik.errors.id_serie)}
            helperText={formik.touched.id_serie && formik.errors.id_serie}
            sx={{ marginBottom: 2 }}
          />
          
          <TextField
            label="numero de placa"
            fullWidth
            name="numero_placa"
            type="number"
            value={formik.values.numero_placa}
            onChange={formik.handleChange}
            error={formik.touched.numero_placa && Boolean(formik.errors.numero_placa)}
            helperText={formik.touched.numero_placa && formik.errors.numero_placa}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label=" observacion"
            fullWidth
            name="observacion"
            type="text"
            value={seriesData.observacion}
            onChange={formik.handleChange}
            error={formik.touched.observacion && Boolean(formik.errors.observacion)}
            helperText={formik.touched.observacion && formik.errors.observacion}
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

export default UpdateSeriesModal;
