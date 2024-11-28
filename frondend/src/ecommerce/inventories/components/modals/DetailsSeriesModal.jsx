import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { getseriesById } from "../services/remote/get/GetSeriesById";


const DetailsSeriesModal = ({ showDetailsModal, setShowDetailsModal, selectedSeries, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [seriesData, setSeriesData] = useState([]);

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        onClose();
    };

    useEffect(() => {
        // console.log("selectedSeries",selectedSeries);
        const fetchSeriesData = async () => {
            setLoading(true);
            try {
                const details = await Promise.all(
                    selectedSeries.map(series => getseriesById(series.negocioId, series.id_almacen, series.id_serie))
                );
                // console.log("details",details);
                setSeriesData(details);

            } catch (error) {
                console.error("Error al obtener los detalles de la serie:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeriesData();
    }, [selectedSeries, showDetailsModal]);

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
                        {seriesData.length > 0 ? (
                            <>
                                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                    <strong><h2>Detalles de los inventarios seleccionados:</h2></strong>
                                </Typography>
                                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {seriesData.map((series, index) => (
                                        <Box
                                            key={series._id || index}
                                            sx={{
                                                marginBottom: 1,
                                                padding: 1,
                                                border: "1px solid #ccc",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                <strong>ID:</strong> {series.id_serie}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>numero_serie:</strong> {series.numero_serie}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>numero_placa:</strong> {series.numero_placa}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>observacion:</strong> {series.observacion}
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
        }

export default DetailsSeriesModal

