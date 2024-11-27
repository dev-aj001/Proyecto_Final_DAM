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
import { UpdateOneInfoad } from "../services/remote/put/UpdateOneInfoad";
import { getInfoadById } from "../services/remote/get/GetInfoadById";

const UpdateInfoadModal = ({ showUpdateModal, setShowUpdateModal, selectedInfoad, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [infoadData, setInfoadData] = useState([]);
  const [Loading, setLoading] = useState(false);


  useEffect(() => {
    handleSearchById();
    fetchData();
  }, [showUpdateModal, selectedInfoad]);

  const handleSearchById = async () => {
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    setLoading(true);
    try {
      const data = await getInfoadById(selectedInfoad?.negocioId, selectedInfoad?.almacenId, selectedInfoad?.infoAdId);
      formik.setValues({
        idEtiquetaOK: data.idEtiquetaOK || "",
        idEtiqueta: data.idEtiqueta || "",
        etiqueta: data.etiqueta || "",
        valor: data.valor || "",
        idTipoSeleccionOK: data.idTipoSeleccionOK || "",
        secuencia: data.secuencia || "",
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
      idEtiquetaOK: "",
      idEtiqueta: "",
      etiqueta: "",
      valor: "",
      idTipoSeleccionOK: "",
      secuencia: "",
    },
    validationSchema: Yup.object({
      idEtiquetaOK: Yup.string().required("ID de Etiqueta OK es requerido"),
      idEtiqueta: Yup.string().required("ID de Etiqueta es requerido"),
      etiqueta: Yup.string().required("Etiqueta es requerido"),
      valor: Yup.string().required("Valor es requerido"),
      idTipoSeleccionOK: Yup.string().required("ID de Etiqueta es requerido"),
      secuencia: Yup.string().required("Secuencia es requerido"),

    }),

    onSubmit: async (values) => {
      setMensajeErrorAlert(null);
      setMensajeExitoAlert(null);
      setLoading(true);
      try {
        console.log(selectedInfoad.negocioId, selectedInfoad.almacenId, selectedInfoad.infoAdId);
        console.log(values);
        await UpdateOneInfoad(selectedInfoad.negocioId, selectedInfoad.almacenId, selectedInfoad.infoAdId, values);


        setMensajeExitoAlert("Datos actualizados exitosamente.");
      } catch (error) {
        setMensajeErrorAlert("Error al actualizar los datos.");
        console.log(error);
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
            <strong>Actualizar Infoad</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID de Serie: <strong>{selectedInfoad?.infoAdId}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensajes de éxito o error */}
          {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}
          {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}

          {/* Campos del formulario */}


          <TextField
            label="idEtiquetaOK"
            fullWidth
            name="idEtiquetaOK"
            type="text"
            value={formik.values.idEtiquetaOK}
            onChange={formik.handleChange}
            error={formik.touched.idEtiquetaOK && Boolean(formik.errors.idEtiquetaOK)}
            helperText={formik.touched.idEtiquetaOK && formik.errors.idEtiquetaOK}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="idEtiqueta"
            fullWidth
            name="idEtiqueta"
            type="text"
            value={formik.values.idEtiqueta}
            onChange={formik.handleChange}
            error={formik.touched.idEtiqueta && Boolean(formik.errors.idEtiqueta)}
            helperText={formik.touched.idEtiqueta && formik.errors.idEtiqueta}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="etiqueta"
            fullWidth
            name="etiqueta"
            type="text"
            value={formik.values.etiqueta}
            onChange={formik.handleChange}
            error={formik.touched.etiqueta && Boolean(formik.errors.etiqueta)}
            helperText={formik.touched.etiqueta && formik.errors.etiqueta}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label=" valor"
            fullWidth
            name="valor"
            type="text"
            value={formik.values.valor}
            onChange={formik.handleChange}
            error={formik.touched.valor && Boolean(formik.errors.valor)}
            helperText={formik.touched.valor && formik.errors.valor}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label=" idTipoSeleccionOK"
            fullWidth
            name="idTipoSeleccionOK"
            type="text"
            value={formik.values.idTipoSeleccionOK}
            onChange={formik.handleChange}
            error={formik.touched.idTipoSeleccionOK && Boolean(formik.errors.idTipoSeleccionOK)}
            helperText={formik.touched.idTipoSeleccionOK && formik.errors.idTipoSeleccionOK}
            sx={{ marginBottom: 2 }}
          />


          <TextField
            label=" secuencia"
            fullWidth
            name="secuencia"
            type="text"
            value={formik.values.secuencia}
            onChange={formik.handleChange}
            error={formik.touched.secuencia && Boolean(formik.errors.secuencia)}
            helperText={formik.touched.secuencia && formik.errors.secuencia}
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

export default UpdateInfoadModal;
