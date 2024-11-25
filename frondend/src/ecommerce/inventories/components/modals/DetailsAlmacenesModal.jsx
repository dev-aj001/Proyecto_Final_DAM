import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { getAlmacenesById } from "../services/remote/get/GetAlmacenesById";

const DetailsAlmacenesModal = ({ showDetailsModal, setShowDetailsModal, selectedAlmacenes, onClose }) => {

const [almacenesData, setAlmacenesData] = useState([]);
const [loading, setLoading] = useState(false);

const handleCloseModal = () => {
    setShowDetailsModal(false);
    onClose();
};

useEffect(() => {
    console.log("selectedAlmacenes:", selectedAlmacenes);   
    if (showDetailsModal && selectedAlmacenes.length > 0) {
        setLoading(true);
        const fetchAlmacenesDetails = async () => {
            try {
                const details = await Promise.all(
                    selectedAlmacenes.map(almacenes => getAlmacenesById(almacenes.idNeg , almacenes._id))
                );
                setAlmacenesData(details);
            } catch (error) {
                console.error("Error al obtener los detalles de los almacenes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlmacenesDetails();
    }
}, [showDetailsModal, selectedAlmacenes]);

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
                        {almacenesData.length > 0 ? (
                            <>
                                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                    <strong><h2>Detalles de los almacenes seleccionados:</h2></strong>
                                </Typography>
                                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {almacenesData.map((almacenes, index) => (
                                        <Box
                                            key={almacenes._id || index}
                                            sx={{
                                                marginBottom: 1,
                                                padding: 1,
                                                border: "1px solid #ccc",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                <strong>ID de negocio:</strong> {selectedAlmacenes[index].idNeg}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Nombre negocio:</strong> {selectedAlmacenes[index].nombre}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Nombre almacen:</strong> {almacenes.id_almacen}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Cantidad actual:</strong> {almacenes.cantidadActual}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Cantidad disponible:</strong> {almacenes.cantidadDisponible}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Canyidad merma:</strong> {almacenes.cantidadMerma}
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

export default DetailsAlmacenesModal;
