import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Alert,
    Box,
    IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

// Servicios para obtener y eliminar inventarios
import { getInventoryById } from "../services/remote/get/GetInventoriesById";
import { DeleteOneInventory } from "../services/remote/delete/DeleteOneInventories";

const DeleteInventoryModal = ({ showDeleteModal, setShowDeleteModal, fetchData }) => {
    // Estados para manejar el ID del inventario, los datos obtenidos, mensajes de alerta y el estado de carga
    const [inventoryId, setInventoryId] = useState(""); // ID ingresado por el usuario
    const [inventoryData, setInventoryData] = useState(null); // Datos del inventario encontrados
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState(""); // Mensaje de error
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState(""); // Mensaje de éxito
    const [Loading, setLoading] = useState(false); // Estado de carga para botones
    const [isSearchDisabled, setIsSearchDisabled] = useState(false); // Deshabilitar búsqueda tras encontrar un inventario

    // Función para buscar un inventario por ID
    const handleSearchById = async () => {
        setMensajeErrorAlert(null); // Limpiar mensajes de error previos
        setMensajeExitoAlert(null); // Limpiar mensajes de éxito previos
        setLoading(true); // Indicar que está cargando
        try {
            const data = await getInventoryById(inventoryId); // Obtener datos del inventario
            setInventoryData(data); // Guardar datos obtenidos
            setIsSearchDisabled(true); // Deshabilitar campo de búsqueda
        } catch (error) {
            setInventoryData(null); // Limpiar datos si no se encuentra
            setMensajeErrorAlert("No se pudo encontrar el inventario con ese ID."); // Mostrar mensaje de error
        } finally {
            setLoading(false); // Finalizar estado de carga
        }
    };

    // Función para eliminar un inventario
    const handleDeleteInventory = async () => {
        setMensajeErrorAlert(null); // Limpiar mensajes de error previos
        setMensajeExitoAlert(null); // Limpiar mensajes de éxito previos
        setLoading(true); // Indicar que está cargando
        try {
            await DeleteOneInventory(inventoryId); // Llamar al servicio para eliminar el inventario
            setMensajeExitoAlert("Inventario eliminado correctamente."); // Mostrar mensaje de éxito
            setInventoryData(null); // Limpiar datos del inventario
            setInventoryId(""); // Reiniciar el ID ingresado
            fetchData(); // Actualizar la lista de inventarios
        } catch (error) {
            setMensajeErrorAlert("Error al eliminar el inventario."); // Mostrar mensaje de error
        } finally {
            setLoading(false); // Finalizar estado de carga
        }
    };

    // Función para recargar el formulario
    const handleReloadForm = () => {
        setInventoryId(""); // Reiniciar el ID ingresado
        setInventoryData(null); // Limpiar datos del inventario
        setMensajeErrorAlert(null); // Limpiar mensajes de error
        setMensajeExitoAlert(null); // Limpiar mensajes de éxito
        setIsSearchDisabled(false); // Habilitar campo de búsqueda
    };

    // Función para cerrar el modal
    const handleClose = () => {
        handleReloadForm(); // Reiniciar formulario al cerrar
        setShowDeleteModal(false); // Cerrar el modal
    };

    return (
        <Dialog open={showDeleteModal} onClose={handleClose} fullWidth>
            {/* Título del modal */}
            <DialogTitle>
                <Typography variant="h6" component="div">
                    <strong>Eliminar Inventario</strong>
                </Typography>
            </DialogTitle>
            {/* Contenido del modal */}
            <DialogContent sx={{ display: "flex", flexDirection: "column" }} dividers>
                {/* Campo para ingresar ID del inventario */}
                <TextField
                    id="inventoryId"
                    label="ID del Inventario"
                    fullWidth
                    margin="dense"
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)} // Actualizar ID ingresado
                    disabled={isSearchDisabled} // Deshabilitar si ya se buscó un inventario
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleSearchById} disabled={isSearchDisabled}>
                                <SearchIcon /> {/* Botón para buscar */}
                            </IconButton>
                        ),
                    }}
                />
                {/* Mostrar detalles del inventario encontrado */}
                {inventoryData && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">
                            <strong>Detalles del Inventario:</strong>
                        </Typography>
                        <Typography>Nombre: {inventoryData.nombre}</Typography>
                        <Typography>Estado: {inventoryData.Activo ? "Activo" : "Inactivo"}</Typography>
                        {/* Puedes agregar más detalles aquí si es necesario */}
                    </Box>
                )}
                {/* Mostrar mensajes de error y éxito */}
                {mensajeErrorAlert && (
                    <Box sx={{ marginTop: 2 }}>
                        <Alert severity="error">{mensajeErrorAlert}</Alert> {/* Mensaje de error */}
                    </Box>
                )}
                {mensajeExitoAlert && (
                    <Box sx={{ marginTop: 2 }}>
                        <Alert severity="success">{mensajeExitoAlert}</Alert> {/* Mensaje de éxito */}
                    </Box>
                )}
            </DialogContent>
            {/* Acciones del modal */}
            <DialogActions>
                {/* Botón para eliminar inventario */}
                {inventoryData && (
                    <LoadingButton
                        onClick={handleDeleteInventory}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        loading={Loading}
                        fetchData={fetchData} // Actualizar datos tras eliminar
                    >
                        Eliminar
                    </LoadingButton>
                )}
                {/* Botón para recargar formulario */}
                <LoadingButton
                    onClick={handleReloadForm}
                    variant="outlined"
                    color="secondary"
                    startIcon={<RefreshIcon />}
                >
                    Recargar
                </LoadingButton>
                {/* Botón para cerrar el modal */}
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
