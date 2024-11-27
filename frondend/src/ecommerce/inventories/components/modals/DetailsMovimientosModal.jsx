import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { getMovimientosById } from "../services/remote/get/GetMoviminetosById";


const DetailsMovimientosModal = ({ showDetailsModal, setShowDetailsModal,  selectedMovimientos, onClose  }) => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        setShowDetailsModal(false);
    };

    useEffect(() => {
        console.log(selectedMovimientos);
        const fetchMovimientos = async () => {
            setLoading(true);
            try {
                const details = await Promise.all(
                    selectedMovimientos.map(series => getMovimientosById(series.negocioId, series.id_almacen, series.movimientoId))
                );
                console.log("details",details);
                setMovimientos(details);

            } catch (error) {
                console.error("Error al obtener los detalles de la serie:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovimientos();
    }, [selectedMovimientos, showDetailsModal]);

    return (
        <Dialog
            open={showDetailsModal}
            onClose={handleClose}
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
                        {movimientos.length > 0 ? (
                            <>
                                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                    <strong><h2>Detalles de los movimientos seleccionados:</h2></strong>
                                </Typography>
                                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {movimientos.map((moviminetos, index) => (
                                        <Box
                                            key={moviminetos._id || index}
                                            sx={{
                                                marginBottom: 1,
                                                padding: 1,
                                                border: "1px solid #ccc",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                <strong>ID:</strong> {moviminetos.id_movimiento}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>tipo:</strong> {moviminetos.tipo}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>cantidad Anterior:</strong> {moviminetos.cantidadAnterior}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>cantidad Movimiento:</strong> {moviminetos.cantidadMovimiento}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>cantidad Actual:</strong> {moviminetos.cantidadActual}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>referencia:</strong> {moviminetos.referencia}
                                            </Typography>
                                            
                                            {/* Agregar más detalles según lo que se recupere del servicio */}
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                <strong>No hay movimientos seleccionados o no se encontraron detalles.</strong>
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>

            {/* Acciones del modal */}
            <DialogActions>
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
        }

export default DetailsMovimientosModal