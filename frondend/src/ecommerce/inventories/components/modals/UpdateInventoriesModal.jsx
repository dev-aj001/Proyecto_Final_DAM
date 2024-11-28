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
import { UpdateOneInventory } from "../services/remote/put/UpdateOneInventories";
import { getInventoryById } from "../services/remote/get/GetInventoriesById"; // Asegúrate de tener esta función en el servicio

const UpdateInventoryModal = ({ showUpdateModal, setShowUpdateModal, selectedInventory, fetchData }) => {
  const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
  const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
  const [Loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);

 useEffect(() => {
  if (selectedInventory?._id) {
    const fetchData = async () => {
      try {
        const response = await getInventoryById(selectedInventory._id);
        // console.log('Datos del inventario:', response); // Verifica la respuesta
        setInventoryData(response.data); // Actualiza el estado
      } catch (error) {
        console.error('Error al obtener los datos del inventario:', error);
      }
    };
    handleSearchById();
    fetchData();
  }
}, [selectedInventory?._id]);



const handleSearchById = async () => {
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    setLoading(true);
    try {
        const data = await getInventoryById(selectedInventory?._id);
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
    } finally {
        setLoading(false);
    }
};


  // Actualiza los valores del formulario cuando los datos del inventario cambian
  const formik = useFormik({
    enableReinitialize: true, // Esto permite reiniciar el formulario con los nuevos valores
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
      setMensajeErrorAlert(null);
      setMensajeExitoAlert(null);
      setLoading(true);
      try {
        const response = await UpdateOneInventory(selectedInventory._id, values); // Usamos el _id desde selectedInventory
        if (response && ![200, 201].includes(response.status)) {
          throw new Error(response.data?.message || "Error al actualizar inventario");
        }

        setMensajeExitoAlert("Inventario actualizado correctamente");
        fetchData(); // Actualiza la tabla después de la actualización
      

        setTimeout(() => {
          setMensajeExitoAlert(null);
        }, 3000);

       
      } catch (e) {
        setMensajeErrorAlert(e.message || "Error al actualizar inventario");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm(); // Reinicia los valores del formulario
    setShowUpdateModal(false); // Cierra el modal
  };

  return (
    <Dialog open={showUpdateModal} onClose={handleClose} fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            <strong>Actualizar Inventario</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            ID: <strong>{selectedInventory?._id}</strong> {/* Aquí muestra el ID */}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
          {/* Mensaje de éxito o error */}
          {mensajeErrorAlert && (
            <Alert severity="error">{mensajeErrorAlert}</Alert>
          )}
          {mensajeExitoAlert && (
            <Alert severity="success">{mensajeExitoAlert}</Alert>
          )}

          {/* Nombre */}
          <TextField
            label="Nombre"
            fullWidth
            name="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            sx={{ marginBottom: 2 }}
          />

          {/* Dirección */}
          <TextField
            label="Calle"
            fullWidth
            name="direccion.calle"
            value={formik.values.direccion.calle}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.calle && Boolean(formik.errors.direccion?.calle)}
            helperText={formik.touched.direccion?.calle && formik.errors.direccion?.calle}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Número"
            fullWidth
            name="direccion.numero"
            value={formik.values.direccion.numero}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.numero && Boolean(formik.errors.direccion?.numero)}
            helperText={formik.touched.direccion?.numero && formik.errors.direccion?.numero}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Colonia"
            fullWidth
            name="direccion.colonia"
            value={formik.values.direccion.colonia}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.colonia && Boolean(formik.errors.direccion?.colonia)}
            helperText={formik.touched.direccion?.colonia && formik.errors.direccion?.colonia}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Ciudad"
            fullWidth
            name="direccion.ciudad"
            value={formik.values.direccion.ciudad}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.ciudad && Boolean(formik.errors.direccion?.ciudad)}
            helperText={formik.touched.direccion?.ciudad && formik.errors.direccion?.ciudad}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Estado"
            fullWidth
            name="direccion.estado"
            value={formik.values.direccion.estado}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.estado && Boolean(formik.errors.direccion?.estado)}
            helperText={formik.touched.direccion?.estado && formik.errors.direccion?.estado}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Código Postal"
            fullWidth
            name="direccion.codigo_postal"
            value={formik.values.direccion.codigo_postal}
            onChange={formik.handleChange}
            error={formik.touched.direccion?.codigo_postal && Boolean(formik.errors.direccion?.codigo_postal)}
            helperText={formik.touched.direccion?.codigo_postal && formik.errors.direccion?.codigo_postal}
            sx={{ marginBottom: 2 }}
          />

          {/* Contacto */}
          <TextField
            label="Teléfono"
            fullWidth
            name="contacto.telefono"
            value={formik.values.contacto.telefono}
            onChange={formik.handleChange}
            error={formik.touched.contacto?.telefono && Boolean(formik.errors.contacto?.telefono)}
            helperText={formik.touched.contacto?.telefono && formik.errors.contacto?.telefono}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Correo electrónico"
            fullWidth
            name="contacto.email"
            value={formik.values.contacto.email}
            onChange={formik.handleChange}
            error={formik.touched.contacto?.email && Boolean(formik.errors.contacto?.email)}
            helperText={formik.touched.contacto?.email && formik.errors.contacto?.email}
            sx={{ marginBottom: 2 }}
          />

          {/* Activo / Borrado */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="Activo"
                  checked={formik.values.Activo}
                  onChange={formik.handleChange}
                />
              }
              label="Activo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="Borrado"
                  checked={formik.values.Borrado}
                  onChange={formik.handleChange}
                />
              }
              label="Borrado"
            />
          </Box>
        </DialogContent>

        {/* Acciones */}
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

export default UpdateInventoryModal;
