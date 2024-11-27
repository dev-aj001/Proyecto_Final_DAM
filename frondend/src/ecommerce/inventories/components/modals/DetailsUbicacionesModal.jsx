import { Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";


const DetailsUbicacionesModal = ({ showDetailsModal, setShowDetailsModal, selecteUbicaciones, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        onClose();
    };

    useEffect(() => {

        console.log("selecteUbicaciones", selecteUbicaciones);
       
    }, [selecteUbicaciones]);

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
                        Cargando detalles de las Ubicaciones...
                    </Typography>
                ) : (
                    <>
                       {Array.isArray(selecteUbicaciones) && selecteUbicaciones.length > 0 ? (
                <>
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        <strong>Informacion de las siguientes Ubicaciones :</strong>
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                        {selecteUbicaciones.map((ubicacion, index) => (
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

export default DetailsUbicacionesModal

