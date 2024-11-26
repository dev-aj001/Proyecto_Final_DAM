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
import { DeleteOneAlmacen } from "../services/remote/delete/DeleteOneAlmacen";

const DeleteAlmacenesModal = ({ showDeleteModal, setShowDeleteModal, fetchData, selectAlmacenes }) => {
    const [loading, setLoading] = useState(false);
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    useEffect(() => {
        // Aquí no se realiza ógica adicional porque los almacenes ya se reciben como prop
    }, [selectAlmacenes]);

    const handleDeleteAlmacenes = async () => {
        setMensajeErrorAlert(null);
        setMensajeExitoAlert(null);
        setLoading(true);

        try {
            if (Array.isArray(selectAlmacenes) && selectAlmacenes.length > 0) {
                for (const almacenes of selectAlmacenes) {
                    await DeleteOneAlmacen(almacenes.idNeg, almacenes._id);
                }
                setMensajeExitoAlert("Almacenes eliminados correctamente.");
                fetchData();
                
            } else {
                setMensajeErrorAlert("No se seleccionaron almacenes para eliminar.");
            }
        } catch (error) {
            setMensajeErrorAlert("Error al eliminar los almacenes.");
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
                    <strong>Eliminar Almacenes</strong>
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
                {Array.isArray(selectAlmacenes) && selectAlmacenes.length > 0 ? (
                    <>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            <strong>Los siguientes almacenes serán eliminados:</strong>
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                            {selectAlmacenes.map((almacen, index) => (
                                <Box
                                    key={almacen._id || index}
                                    sx={{
                                        marginBottom: 1,
                                        padding: 1,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>ID:</strong> {almacen._id}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Nombre:</strong> {almacen.id_almacen}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Cantidad actual:</strong> {almacen.cantidadActual}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Cantidad apartada:</strong> {almacen.cantidadApartada}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Cantidad merma:</strong> {almacen.cantidadMerma}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Cantidad apartada:</strong> {almacen.cantidadApartada}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Stock maximo:</strong> {almacen.stockMaximo}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Stock minimo:</strong> {almacen.stockMinimo}
                                    </Typography> 
                                </Box>
                            ))}
                        </Box>
                    </>
                ) : (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        <strong>No hay almacenes seleccionados.</strong>
                    </Typography>
                )}
            </DialogContent>

            {/* Acciones del modal */}
            <DialogActions>
                <LoadingButton
                    onClick={handleDeleteAlmacenes}
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

export default DeleteAlmacenesModal;
