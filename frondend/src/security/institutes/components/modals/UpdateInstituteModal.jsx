import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, TextField,
    DialogActions, Alert, Box, Checkbox, FormControlLabel, IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { UpdateOneInstitute } from "../services/remote/put/UpdateOneInstitute";
import { getInstituteById } from "../services/remote/get/GetInstituteById";

const UpdateInstituteModal = ({ UpdateInstituteShowModal, setUpdateInstituteShowModal, onInstituteUpdated, UpdateTable, institute }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [isIdInstitutoOKEditable, setIsIdInstitutoOKEditable] = useState(true);

    const commonTextFieldProps = {
        fullWidth: true,
        margin: "normal",
        variant: "outlined",
    };

    const formik = useFormik({
        initialValues: {
            IdInstitutoOK: institute?.IdInstitutoOK || "",
            IdInstitutoBK: institute?.IdInstitutoBK || "",
            DesInstituto: institute?.DesInstituto || "",
            Matriz: institute?.Matriz === 'S' || false,
            IdTipoGiroOK: institute?.IdTipoGiroOK || "",
            IdInstitutoSupOK: institute?.IdInstitutoSupOK || ""
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            IdInstitutoOK: Yup.string().required("Campo requerido"),
            IdInstitutoBK: Yup.string().required("Campo requerido"),
            DesInstituto: Yup.string().required("Campo requerido"),
            Matriz: Yup.bool().required("Campo requerido"),
            IdTipoGiroOK: Yup.string()
                .required("Campo requerido")
                .matches(/^[a-zA-Z0-9-]+$/, 'Solo se permiten caracteres alfanuméricos y el símbolo "-"'),
            IdInstitutoSupOK: Yup.string(),
        }),
        onSubmit: async (values) => {
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            setLoading(true);
            try {
                const updatedInstitute = {
                    ...values,
                    Matriz: values.Matriz ? 'S' : 'N'
                };
                await UpdateOneInstitute(updatedInstitute);
                setMensajeExitoAlert("Instituto actualizado correctamente");

                if (onInstituteUpdated) {
                    onInstituteUpdated();
                }

                UpdateTable();
                formik.resetForm(); // Limpiar el formulario después de una actualización exitosa
            } catch (e) {
                setMensajeErrorAlert("No se pudo actualizar el Instituto");
            }
            setLoading(false);
        },
    });

    const handleSearchInstitute = async () => {
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        const id = formik.values.IdInstitutoOK;
        
        try {
            const foundInstitute = await getInstituteById(id);
            if (!foundInstitute) {
                setMensajeErrorAlert("Instituto no encontrado");
                return;
            }
            formik.setValues({
                ...foundInstitute,
                Matriz: foundInstitute.Matriz === 'S'
            });
            setIsSearchDisabled(true); // Desactivar el botón de búsqueda
            setIsIdInstitutoOKEditable(false); // Hacer no editable el campo `IdInstitutoOK`
        } catch (error) {
            setMensajeErrorAlert("Instituto no encontrado");
        }
    };

    const handleResetSearch = () => {
        formik.resetForm(); // Reiniciar el formulario a sus valores iniciales
        setIsSearchDisabled(false); // Habilitar el botón de búsqueda
        setIsIdInstitutoOKEditable(true); // Hacer editable el campo `IdInstitutoOK`
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
    };

    const handleCloseModal = () => {
        setUpdateInstituteShowModal(false);
        formik.resetForm();
        setIsSearchDisabled(false);
        setIsIdInstitutoOKEditable(true);
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
    };

    return (
        <Dialog open={UpdateInstituteShowModal} onClose={handleCloseModal} fullWidth>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography component="h6">
                        <strong>Actualizar Instituto</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }} dividers>
                    <Box display="flex" alignItems="center">
                        <TextField 
                            id="IdInstitutoOK" 
                            label="IdInstitutoOK*" 
                            value={formik.values.IdInstitutoOK} 
                            onChange={formik.handleChange} 
                            {...commonTextFieldProps}
                            disabled={!isIdInstitutoOKEditable}
                            error={formik.touched.IdInstitutoOK && Boolean(formik.errors.IdInstitutoOK)}
                            helperText={formik.touched.IdInstitutoOK && formik.errors.IdInstitutoOK}
                        />
                        <IconButton 
                            onClick={handleSearchInstitute} 
                            color="primary"
                            disabled={isSearchDisabled}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleResetSearch} 
                            color="secondary"
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                    <TextField id="IdInstitutoBK" label="IdInstitutoBK*" value={formik.values.IdInstitutoBK} {...commonTextFieldProps}
                        onChange={formik.handleChange}
                        error={formik.touched.IdInstitutoBK && Boolean(formik.errors.IdInstitutoBK)}
                        helperText={formik.touched.IdInstitutoBK && formik.errors.IdInstitutoBK}
                    />
                    <TextField id="DesInstituto" label="DesInstituto*" value={formik.values.DesInstituto} {...commonTextFieldProps}
                        onChange={formik.handleChange}
                        error={formik.touched.DesInstituto && Boolean(formik.errors.DesInstituto)}
                        helperText={formik.touched.DesInstituto && formik.errors.DesInstituto}
                    />
                    <FormControlLabel control={<Checkbox id="Matriz" checked={formik.values.Matriz} onChange={formik.handleChange} name="Matriz" color="primary" />}
                        label="Matriz*" />
                    <TextField id="IdTipoGiroOK" label="IdTipoGiroOK*" value={formik.values.IdTipoGiroOK} {...commonTextFieldProps}
                        onChange={formik.handleChange}
                        error={formik.touched.IdTipoGiroOK && Boolean(formik.errors.IdTipoGiroOK)}
                        helperText={formik.touched.IdTipoGiroOK && formik.errors.IdTipoGiroOK}
                    />
                    <TextField id="IdInstitutoSupOK" label="IdInstitutoSupOK" value={formik.values.IdInstitutoSupOK} {...commonTextFieldProps}
                        onChange={formik.handleChange}
                        error={formik.touched.IdInstitutoSupOK && Boolean(formik.errors.IdInstitutoSupOK)}
                        helperText={formik.touched.IdInstitutoSupOK && formik.errors.IdInstitutoSupOK}
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box m="auto">
                        {mensajeErrorAlert && <Alert severity="error"><b>¡ERROR!</b> ─ {mensajeErrorAlert}</Alert>}
                        {mensajeExitoAlert && <Alert severity="success"><b>¡ÉXITO!</b> ─ {mensajeExitoAlert}</Alert>}
                    </Box>
                    <LoadingButton color="secondary" startIcon={<CloseIcon />} variant="outlined" onClick={handleCloseModal}>CERRAR</LoadingButton>
                    <LoadingButton color="primary" startIcon={<SaveIcon />} variant="contained" type="submit" loading={Loading}>ACTUALIZAR</LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateInstituteModal;
