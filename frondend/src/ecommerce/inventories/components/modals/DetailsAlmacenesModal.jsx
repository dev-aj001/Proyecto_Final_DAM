import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
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
                        selectedAlmacenes.map(almacenes => getAlmacenesById(almacenes.idNeg, almacenes._id))
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
                                    {almacenesData.map((almacen, index) => (
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
                                                <strong>Detalles del almacen:</strong>
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Nombre de almacen:</strong> {almacen.id_almacen}
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
                {/* <LoadingButton
                    onClick={()=>{alert("series")}}
                    variant="outlined"
                    color="secondary"
                    startIcon={<ConfirmationNumberIcon />}
                >
                    Ver Series
                </LoadingButton> */}
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
