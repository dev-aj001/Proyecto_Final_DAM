import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Stack, Divider, Button, CircularProgress, Card, CardContent, TextField } from "@mui/material";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import { getInventoryById } from "../services/remote/get/GetInventoriesById";

const renderObjectFields = (obj, level = 0) => {
    if (typeof obj !== "object" || obj === null) {
        return (
            <Typography variant="body2" sx={{ ml: level * 2, display: "inline" }}>
                {obj || "No disponible"}
            </Typography>
        );
    }

    return (
        <Box sx={{ ml: level * 2 }}>
            {Object.entries(obj).map(([key, value]) => (
                <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                        <strong>{key}:</strong>{" "}
                        {typeof value === "object" && value !== null ? (
                            renderObjectFields(value, level + 1)
                        ) : (
                            <span>{value || "No disponible"}</span>
                        )}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};



const DetailsInventoryModal = ({ showDetailsModal, setShowDetailsModal }) => {
    const [inventories, setInventories] = useState([]); // Estado para los inventarios
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const [searchId, setSearchId] = useState(""); // Estado para el ID ingresado
    const [filteredInventory, setFilteredInventory] = useState(null); // Estado para el inventario buscado por ID

    const fetchAllInventories = () => {
        setLoading(true);
        setError(null);
        setSearchId(""); // Limpia el campo de búsqueda
        setFilteredInventory(null); // Limpia cualquier resultado filtrado
        getAllInventories()
            .then((data) => {
                setInventories(data || []); // Previene errores si `data` es null
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener los inventarios:", err);
                setError("No se pudieron cargar los inventarios.");
                setLoading(false);
            });
    };
    
    
    // Lógica para cargar inventarios al abrir el modal
    useEffect(() => {
        if (showDetailsModal) {
            fetchAllInventories();
        }
    }, [showDetailsModal]);

    const handleSearchById = () => {
        if (!searchId) {
            setError("Por favor, ingrese un ID válido.");
            return;
        }

        setLoading(true);
        setError(null);
        getInventoryById(searchId)
            .then((data) => {
                setFilteredInventory(data); // Guardar el inventario encontrado
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al buscar el inventario:", err);
                setError("No se encontró un inventario con ese ID.");
                setLoading(false);
            });
    };

    const handleCloseModal = () => {
        setSearchId("");             // Limpia el ID de búsqueda
        setFilteredInventory(null);  // Limpia el inventario buscado
        setError(null);              // Limpia errores
        setInventories([]);          // Limpia la lista de inventarios cargados
        setShowDetailsModal(false);  // Cierra el modal
    };
    return (
        <Modal
            open={showDetailsModal}
            onClose={handleCloseModal}
            aria-labelledby="details-modal-title"
            aria-describedby="details-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography id="details-modal-title" variant="h5" component="h2" gutterBottom>
                    Detalles de Inventarios
                </Typography>

                {/* Opciones de búsqueda */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Buscar por ID"
                        variant="outlined"
                        fullWidth
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearchById}
                            disabled={loading}
                            sx={{ textTransform: "none" }}
                        >
                            Buscar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={fetchAllInventories}
                            disabled={loading}
                            sx={{ textTransform: "none" }}
                        >
                            Refrescar
                        </Button>
                    </Stack>
                </Box>

                {/* Estado de carga */}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Manejo de errores */}
                {error && (
                    <Typography color="error" sx={{ mt: 3 }}>
                        {error}
                    </Typography>
                )}

                {/* Mostrar inventario buscado por ID */}
                {!loading && !error && filteredInventory && (
                    <Card sx={{ boxShadow: 2, border: "1px solid #ddd", p: 2, mt: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Inventario encontrado</strong>
                            </Typography>
                            {renderObjectFields(filteredInventory)}
                        </CardContent>
                    </Card>
                )}

                {/* Mostrar todos los inventarios */}
                {!loading && !error && !filteredInventory && inventories.length > 0 && (
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        {inventories.map((inventory, index) => (
                            <Card key={index} sx={{ boxShadow: 2, border: "1px solid #ddd", p: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Inventario {index + 1}</strong>
                                    </Typography>
                                    {renderObjectFields(inventory)}
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                {/* Mensaje si no hay inventarios */}
                {!loading && !error && inventories.length === 0 && !filteredInventory && (
                    <Typography sx={{ mt: 3 }}>No hay inventarios disponibles.</Typography>
                )}

                {/* Botón para cerrar el modal, siempre visible */}
                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        py: 1,
                        px: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        bgcolor: "transparent", // Ajustar para que coincida con el fondo
                        boxShadow: "none", // Eliminar la línea o sombra superior
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowDetailsModal(false)}
                        sx={{
                            px: 3,
                            py: 1.5,
                            fontSize: "1rem",
                            borderRadius: "8px",
                            bgcolor: "#1976d2",
                            textTransform: "none",
                            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                            "&:hover": {
                                bgcolor: "#115293",
                                boxShadow: "0 6px 12px rgba(17, 82, 147, 0.4)",
                            },
                        }}
                    >
                        Cerrar
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
};

export default DetailsInventoryModal;
