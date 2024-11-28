import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteOneUbicacion } from "../services/remote/delete/DeleteOneUbicacion";

const DeleteUbicacionesModal = ({ showDeleteModal, setShowDeleteModal, fetchData, selectUbicaciones  }) => { 
    const [loading, setLoading] = useState(false);
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    useEffect(() => {
        // console.log("Series seleccionadas:", selectUbicaciones);

        // Aquí no se realiza ógica adicional porque los almacenes ya se reciben como prop
    }, [selectUbicaciones]);

    const handleDeleteUbicaciones = async () => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true); 

        try {
            if (Array.isArray(selectUbicaciones) && selectUbicaciones.length > 0) {
                for (const ubicacion of selectUbicaciones) {
                    await DeleteOneUbicacion(ubicacion.negocioId, ubicacion.almacenId, ubicacion.serieId, ubicacion._id);
                }
                setMensajeExitoAlert("Series eliminados correctamente.");
                fetchData();
                
            } else {
                setMensajeErrorAlert("No se seleccionaron series para eliminar.");
            }
        } catch (error) {
            setMensajeErrorAlert("Error al eliminar series.");
        } finally {
            setLoading(false);  
        }
};
const handleClose = () => {
    
    setShowDeleteModal(false);
    setMensajeErrorAlert(null);
    setMensajeExitoAlert(null);
    
   
};

 

return (
    <Dialog open={showDeleteModal} onClose={handleClose} fullWidth>
        {/* Título del modal */}
        <DialogTitle>
            <Typography variant="h6" component="div">
                <strong>Eliminar Ubicaciones</strong>
            </Typography>
        </DialogTitle>

        <DialogContent>
            {mensajeErrorAlert && (
                <Typography color="error" sx={{ marginBottom: 2 }}>
                    {mensajeErrorAlert}
                </Typography>
            )}
            {mensajeExitoAlert && (
                <Typography color="success" sx={{ marginBottom: 2 }}>
                    {mensajeExitoAlert}
                </Typography>
            )}
            {Array.isArray(selectUbicaciones) && selectUbicaciones.length > 0 ? (
                <>
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        <strong>Las siguientes Ubicaciones serán eliminados:</strong>
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                        {selectUbicaciones.map((ubicacion, index) => (
                            <Box
                                key={ubicacion._id || index}
                                sx={{
                                    marginBottom: 1,
                                    padding: 1,
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                }}
                            >
                                <Typography variant="body2">
                                    <strong>idTipoStatusOK:</strong> {ubicacion.idTipoStatusOK}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>ubicacion:</strong> {ubicacion.ubicacion}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>actual:</strong> {ubicacion.actual}
                                </Typography>
                                
                            </Box>
                        ))}
                    </Box>
                </>
            ) : (
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    <strong>No hay Ubicaciones seleccionados.</strong>
                </Typography>
            )}
        </DialogContent>

        {/* Acciones del modal */}
        <DialogActions>
            <LoadingButton
                onClick={handleDeleteUbicaciones}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                loading={loading}
            >
                Eliminar
            </LoadingButton>
            <LoadingButton
                onClick={handleClose}
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

export default DeleteUbicacionesModal;
