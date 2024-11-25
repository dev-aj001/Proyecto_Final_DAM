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
import { DeleteOneInventory } from "../services/remote/delete/DeleteOneInventories";

const DeleteInventoryModal = ({ showDeleteModal, setShowDeleteModal, fetchData, selectInventory }) => {
    const [Loading, setLoading] = useState(false); // Estado de carga
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState(""); // Mensaje de error
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState(""); // Mensaje de éxito

    useEffect(() => {
        // Aquí no es necesario hacer la llamada API para obtener los inventarios ya que los datos se pasan por props
        // solo se mostrarán los inventarios seleccionados que ya están en el estado selectInventory

    }, [selectInventory]);

    const handleDeleteInventory = async () => {
        setMensajeErrorAlert(null); // Limpiar mensajes de error previos
        setMensajeExitoAlert(null); // Limpiar mensajes de éxito previos
        setLoading(true); // Indicar que está cargando

        try {
            // Asegurarse de que selectInventory es un array y realizar la eliminación de cada inventario
            if (Array.isArray(selectInventory) && selectInventory.length > 0) {
                // Iterar sobre todos los inventarios seleccionados y eliminarlos
                for (const inventory of selectInventory) {
                    await DeleteOneInventory(inventory._id); // Llamar al servicio para eliminar cada inventario
                }
                setMensajeExitoAlert("Inventarios eliminados correctamente."); // Mostrar mensaje de éxito
                fetchData(); // Actualizar la lista de inventarios
                
            } else {
                setMensajeErrorAlert("No se seleccionaron inventarios para eliminar."); // Si no se seleccionó ningún inventario
            }
        } catch (error) {
            setMensajeErrorAlert("Error al eliminar los inventarios."); // Mostrar mensaje de error
        } finally {
            setLoading(false); // Finalizar estado de carga
        }
    };

    const handleClose = () => {
        setShowDeleteModal(false); // Cerrar el modal
    };

    return (
        <Dialog open={showDeleteModal} onClose={handleClose} fullWidth>
            {/* Título del modal */}
            <DialogTitle>
                <Typography variant="h6" component="div">
                    <strong>Eliminar Inventarios</strong>
                </Typography>
            </DialogTitle>

            <DialogContent>
                {Array.isArray(selectInventory) && selectInventory.length > 0 ? (
                    <>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            <strong>Los siguientes inventarios serán eliminados:</strong>
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                            {selectInventory.map((inventory, index) => (
                                <Box
                                    key={inventory._id || index}
                                    sx={{
                                        marginBottom: 1,
                                        padding: 1,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>ID:</strong> {inventory._id}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Nombre:</strong> {inventory.Nombre}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Dirección:</strong> {inventory.Direccion}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Teléfono:</strong> {inventory.Telefono}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {inventory.Email}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </>
                ) : (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        <strong>No hay inventarios seleccionados.</strong>
                    </Typography>
                )}
            </DialogContent>

            {/* Acciones del modal */}
            <DialogActions>
                <LoadingButton
                    onClick={handleDeleteInventory}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    loading={Loading}
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

export default DeleteInventoryModal;
