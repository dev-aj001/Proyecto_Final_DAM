import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { getInventoryById } from "../services/remote/get/GetInventoriesById";

const DetailsInventoryModal = ({ showDetailsModal, setShowDetailsModal, selectedInventory, onClose }) => {
    const [inventoryDetails, setInventoryDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        onClose();
    };

    useEffect(() => {
        if (showDetailsModal && selectedInventory.length > 0) {
            setLoading(true);
            const fetchInventoryDetails = async () => {
                try {
                    // Aquí consultamos cada inventario por ID
                    const details = await Promise.all(
                        selectedInventory.map(inventory => getInventoryById(inventory._id))
                    );
                    setInventoryDetails(details);
                } catch (error) {
                    console.error("Error al obtener los detalles de los inventarios:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInventoryDetails();
        }
    }, [showDetailsModal, selectedInventory]);

    return (
        <Dialog
            open={showDetailsModal}
            onClose={handleCloseModal}
            aria-labelledby="details-modal-title"
            aria-describedby="details-modal-description"
            fullWidth
            maxWidth="lg"
        >
            <DialogContent>
                {loading ? (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        Cargando detalles de los inventarios...
                    </Typography>
                ) : (
                    <>
                        {inventoryDetails.length > 0 ? (
                            <>
                                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                    <strong><h2>Detalles de los inventarios seleccionados:</h2></strong>
                                </Typography>
                                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {inventoryDetails.map((inventory, index) => (
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
                                                <strong>Nombre:</strong> {inventory.nombre}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Dirección:</strong> {inventory.direccion?.calle}, {inventory.direccion?.numero}, {inventory.direccion?.colonia}, {inventory.direccion?.ciudad}, {inventory.direccion?.estado}, {inventory.direccion?.codigo_postal}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Teléfono:</strong> {inventory.contacto?.telefono}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Email:</strong> {inventory.contacto?.email}
                                            </Typography>
                                            {/* Agregar más detalles según lo que se recupere del servicio */}
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                <strong>No hay inventarios seleccionados o no se encontraron detalles.</strong>
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>

            {/* Acciones del modal */}
            <DialogActions>
                <LoadingButton
                    onClick={handleCloseModal}
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

export default DetailsInventoryModal;
