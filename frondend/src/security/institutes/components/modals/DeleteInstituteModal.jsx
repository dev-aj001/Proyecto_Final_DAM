import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogTitle, Typography, DialogActions, Alert, Box,
    IconButton, TextField
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DeleteOneInstitute } from "../services/remote/delete/DeleteOneInstitute";
import { getInstituteById } from "../services/remote/get/GetInstituteById";

const DeleteInstituteModal = ({ deleteInstituteShowModal, setDeleteInstituteShowModal, onInstituteDeleted, instituteIdProp }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [foundInstitute, setFoundInstitute] = useState(null);
    const [instituteId, setInstituteId] = useState(instituteIdProp || "");

    const handleCloseModal = () => {
        setDeleteInstituteShowModal(false);
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setFoundInstitute(null);
        setInstituteId("");
    };

    const handleSearchInstitute = async () => {
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");

        try {
            const institute = await getInstituteById(instituteId);
            if (!institute) {
                setMensajeErrorAlert("Instituto no encontrado");
                setFoundInstitute(null);
            } else {
                setFoundInstitute(institute);
                setIsSearchDisabled(true);
            }
        } catch (error) {
            setMensajeErrorAlert("No se pudo encontrar el Instituto");
        }
    };

    const handleDeleteInstitute = async () => {
        if (!foundInstitute) return;

        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setLoading(true);

        try {
            await DeleteOneInstitute(instituteId);
            setMensajeExitoAlert("Instituto eliminado correctamente");

            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setMensajeExitoAlert(""), 5000);

            if (onInstituteDeleted) {
                onInstituteDeleted(); // Actualizar la lista de institutos en el componente padre
            }

            handleRefresh(); // Refrescar la vista después de eliminar
        } catch (error) {
            setMensajeErrorAlert("No se pudo eliminar el Instituto");
            setTimeout(() => setMensajeErrorAlert(""), 5000);
        }

        setLoading(false);
    };

    const handleRefresh = () => {
        setInstituteId("");
        setFoundInstitute(null);
        setMensajeErrorAlert("");
        setMensajeExitoAlert("");
        setIsSearchDisabled(false);
    };

    return (
        <Dialog open={deleteInstituteShowModal} onClose={handleCloseModal} fullWidth>
            <DialogTitle>
                <Typography component="h6">
                    <strong>Eliminar Instituto</strong>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                    {mensajeErrorAlert && <Alert severity="error"><b>¡ERROR!</b> ─ {mensajeErrorAlert}</Alert>}
                    {mensajeExitoAlert && <Alert severity="success"><b>¡ÉXITO!</b> ─ {mensajeExitoAlert}</Alert>}

                    {/* Campo de búsqueda del instituto */}
                    <TextField
                        id="IdInstitutoOK"
                        label="Buscar Instituto por ID"
                        value={instituteId}
                        onChange={(e) => setInstituteId(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <IconButton onClick={handleSearchInstitute} color="primary" disabled={isSearchDisabled}>
                        <SearchIcon />
                    </IconButton>

                    {/* Si el instituto se encontró, mostrar información */}
                    {foundInstitute && (
                        <Box mt={2}>
                            <Typography>Instituto encontrado:</Typography>
                            <Typography><strong>ID Institución OK:</strong> {foundInstitute.IdInstitutoOK}</Typography>
                            <Typography><strong>ID Institución BK:</strong> {foundInstitute.IdInstitutoBK}</Typography>
                            <Typography><strong>Descripción:</strong> {foundInstitute.DesInstituto}</Typography>
                            <Typography><strong>Matriz:</strong> {foundInstitute.Matriz}</Typography>
                            <Typography><strong>Tipo de Giro:</strong> {foundInstitute.IdTipoGiroOK}</Typography>
                            <Typography><strong>Instituto Superior OK:</strong> {foundInstitute.IdInstitutoSupOK ? foundInstitute.IdInstitutoSupOK : 'N/A'}</Typography> {/* Mostrar 'N/A' si no existe */}
                        </Box>
                    )}
                    {!foundInstitute && <Typography mt={2}>Introduce un ID para buscar el instituto.</Typography>}
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box m="auto">
                    <LoadingButton
                        color="secondary"
                        startIcon={<CloseIcon />}
                        variant="outlined"
                        onClick={handleCloseModal}
                    >
                        CERRAR
                    </LoadingButton>
                    <LoadingButton
                        color="error"
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        onClick={handleDeleteInstitute}
                        loading={loading}
                        disabled={!foundInstitute}
                    >
                        ELIMINAR
                    </LoadingButton>
                    <LoadingButton
                        color="primary"
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={handleRefresh}
                    >
                        REFRESCAR
                    </LoadingButton>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteInstituteModal;
