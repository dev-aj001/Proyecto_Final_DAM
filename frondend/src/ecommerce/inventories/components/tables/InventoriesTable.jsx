import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Stack, Tooltip, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import AddInventoryModal from "../modals/AddInventoriesModal";
import UpdateInventoryModal from "../modals/UpdateInventoriesModal";
import DeleteInventoryModal from "../modals/DeleteInventoriesModal"; // Importar el modal de eliminación
import DetailsInventoryModal from "../modals/DetailsInventoryModal";

const InventoriesColumns = [
  { accessorKey: "_id", header: "ID", size: 150 },
  { accessorKey: "Nombre", header: "Nombre", size: 150 },
  { accessorKey: "Direccion", header: "Dirección", size: 150 },
  { accessorKey: "Telefono", header: "Telefono", size: 150 },
  { accessorKey: "Email", header: "Email", size: 150 },
];

const InventoriesTable = () => {
  const [loadingTable, setLoadingTable] = useState(true);
  const [inventoriesData, setInventoriesData] = useState([]);
  const [addInventoryShowModal, setAddInventoryShowModal] = useState(false);
  const [updateInventoryShowModal, setUpdateInventoryShowModal] = useState(false);
  const [deleteInventoryShowModal, setDeleteInventoryShowModal] = useState(false); // Estado para el modal de eliminación
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [detailsInventoryShowModal, setDetailsInventoryShowModal] = useState(false);


  const fetchData = async () => {
    try {
      const allInventoriesData = await getAllInventories();
      const validatedData = allInventoriesData.map((item) => ({
        _id: item._id || "No disponible",
        Nombre: item.nombre || "No disponible",
        Telefono: item.contacto?.telefono || "No disponible",
        Email: item.contacto?.email || "No disponible",
        Direccion: "C.P.:" + item.direccion?.codigo_postal + ", Colonia: " + item.direccion?.colonia || "No disponible",
      }));
      setInventoriesData(validatedData);
      setLoadingTable(false);
    } catch (error) {
      console.error("Error al obtener los inventarios:", error);
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <MaterialReactTable
        columns={InventoriesColumns}
        data={inventoriesData}
        state={{ isLoading: loadingTable }}
        initialState={{ density: "compact", showGlobalFilter: true }}
        renderTopToolbarCustomActions={() => (
          <Stack direction="row" sx={{ m: 1 }}>
            <Tooltip title="Agregar">
              <IconButton onClick={() => setAddInventoryShowModal(true)}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Editar">
              <IconButton onClick={() => setUpdateInventoryShowModal(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton onClick={() => setDeleteInventoryShowModal(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Detalles">
              <IconButton
                onClick={() => {
                  setDetailsInventoryShowModal(true);
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>


          </Stack>
        )}
      />

      {/* Modal para agregar inventario */}
      <AddInventoryModal
        showAddModal={addInventoryShowModal}
        setShowAddModal={setAddInventoryShowModal}
        fetchData={fetchData}
        onClose={() => setAddInventoryShowModal(false)}
      />

      {/* Modal para actualizar inventario */}
      <UpdateInventoryModal
        showUpdateModal={updateInventoryShowModal}
        setShowUpdateModal={setUpdateInventoryShowModal}
        fetchData={fetchData}
      />

      {/* Modal para eliminar inventario */}
      <DeleteInventoryModal
        showDeleteModal={deleteInventoryShowModal}
        setShowDeleteModal={setDeleteInventoryShowModal}
        fetchData={fetchData}
        onClose={() => setDeleteInventoryShowModal(false)}
      />

      {/* Modal para ver detalles del inventario */}
      <DetailsInventoryModal
        showDetailsModal={detailsInventoryShowModal}
        setShowDetailsModal={setDetailsInventoryShowModal}
        inventories={inventoriesData}
      />

    </Box>
  );
};

export default InventoriesTable;
