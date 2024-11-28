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
import { DeleteOneMoviminetos } from "../services/remote/delete/DeleteOneMoviminetos";

const DeleteMoviminetosModal = ({ showDeleteModal, setShowDeleteModal, fetchData, selectedMoviminetos }) => {
    const [loading, setLoading] = useState(false);
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    
    useEffect(() => {
        // console.log("selectedMovihgcnbhgminetos:", selectedMoviminetos);

        
    }, [selectedMoviminetos]);

    const handleDelete = async () => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true); 

        try {
            if(Array.isArray(selectedMoviminetos) && selectedMoviminetos.length > 0) {
                for(const moviminetos of selectedMoviminetos) {
                    await DeleteOneMoviminetos(moviminetos.negocioId, moviminetos.id_almacen, moviminetos.movimientoId);
                }
                setMensajeExitoAlert("Moviminetos eliminados correctamente.");
                fetchData();
            } else {
                setMensajeErrorAlert("No se seleccionaron moviminetos para eliminar.");
            }
        } catch (error) {
            setMensajeErrorAlert("Error al eliminar moviminetos.");
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
            <strong>Eliminar moviminetos</strong>
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
        {Array.isArray(selectedMoviminetos) && selectedMoviminetos.length > 0 ? (
            <>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    <strong>Los siguientes moviminetos serán eliminados:</strong>
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {selectedMoviminetos.map((movimientos, index) => (
                        <Box
                            key={movimientos._id || index}
                            sx={{
                                marginBottom: 1,
                                padding: 1,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                            }}
                        >
                            <Typography variant="body2">
                                <strong>ID:</strong> {movimientos.movimientoId}
                            </Typography>
                            <Typography variant="body2">
                                <strong>tipo:</strong> {movimientos.tipo}
                            </Typography>
                            <Typography variant="body2">
                                <strong>cantidad Anterior:</strong> {movimientos.cantidadAnterior}
                            </Typography>
                            <Typography variant="body2">
                                <strong>cantidad Movimiento:</strong> {movimientos.cantidadMovimiento}
                            </Typography>
                            <Typography variant="body2">
                                <strong>cantidad Actual:</strong> {movimientos.cantidadActual}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </>
        ) : (
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                <strong>No hay moviminetos seleccionados.</strong>
            </Typography>
        )}
    </DialogContent>

    {/* Acciones del modal */}
    <DialogActions>
        <LoadingButton
            onClick={handleDelete}
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

export default DeleteMoviminetosModal;
