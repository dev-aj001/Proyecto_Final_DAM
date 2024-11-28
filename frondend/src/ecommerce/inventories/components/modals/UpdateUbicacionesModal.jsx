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
import { UpdateOneUbicacion } from "../services/remote/put/UpdateOneUbicaciones";


const UpdateUbicacionesModal = ({ showUpdateModal, setShowUpdateModal, selectedUbicaciones, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [Loading, setLoading] = useState(false);


  useEffect(() => {
    handleSearchById();
    fetchData();
  }, [showUpdateModal]);

  const handleSearchById = async () => {
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    setLoading(true);
    try {
      
      formik.setValues({
        idTipoStatusOK: selectedUbicaciones?.idTipoStatusOK || "",
        ubicacion: selectedUbicaciones?.ubicacion || "",
        actual: false,
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
      idTipoStatusOK:"",
      ubicacion: "",
      actual: false,

    },
    validationSchema: Yup.object({
      idTipoStatusOK: Yup.string().required("Requerido"),
      ubicacion: Yup.string().required("Requerido"),

    }),

      onSubmit: async (values) => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true);
        try {
          // console.log(selectedUbicaciones.negocioId, selectedUbicaciones.almacenId, selectedUbicaciones.serieId,selectedUbicaciones._id);
         // console.log(values);
         await UpdateOneUbicacion(selectedUbicaciones.negocioId, selectedUbicaciones.almacenId, selectedUbicaciones.serieId,selectedUbicaciones._id, values);
         
         
         setMensajeExitoAlert("Datos actualizados exitosamente.");
        } catch (error) {
          setMensajeErrorAlert("Error al actualizar los datos.");
          // console.log(error);
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
            <strong>Actualizar Ubicacion</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID de ubicacion: <strong>{selectedUbicaciones?._id}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensajes de éxito o error */}
          {mensajeErrorAlert && <Alert severity="error">{mensajeErrorAlert}</Alert>}
          {mensajeExitoAlert && <Alert severity="success">{mensajeExitoAlert}</Alert>}

          {/* Campos del formulario */}
          
             
          <TextField
            label="idTipoStatusOK "
            fullWidth
            name="idTipoStatusOK"
            type="text"
            value={formik.values.idTipoStatusOK}
            onChange={formik.handleChange}
            error={formik.touched.idTipoStatusOK && Boolean(formik.errors.idTipoStatusOK)}
            helperText={formik.touched.idTipoStatusOK && formik.errors.idTipoStatusOK}
            sx={{ marginBottom: 2 }}
          />
          
          <TextField
            label="ubicacion"
            fullWidth
            name="ubicacion"
            type="text"
            value={formik.values.ubicacion}
            onChange={formik.handleChange}
            error={formik.touched.ubicacion && Boolean(formik.errors.ubicacion)}
            helperText={formik.touched.ubicacion && formik.errors.ubicacion}
            sx={{ marginBottom: 2 }}
          />
          
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

export default UpdateUbicacionesModal;
